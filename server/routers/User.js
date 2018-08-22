var router = require('express').Router();
var validator = require('validator');
var db = require('../models/index');
var md5 = require('md5');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer'),
  transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b875e043cfbc66",
      pass: "b1676fee64c0e4"
    }
  });
const EmailTemplate = require('email-templates-v2').EmailTemplate;
const path = require('path');
const Promise = require('bluebird'),
  validate = require('express-validation');
const RSA_PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, "../secure/private.key"));
const verifytoken = require('../middleware/verifytoken.js');
/*---------Routes Functionality-------------*/

router.route('/forgetpassword').post(function (req, res) {
  if (req.body) {
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (user) {
      if (!user) {
        res.json({ error: true, result: '', text: 'There is no user for this userid' });
      }
      else {
        let users = [{
          name: 'User',
          id: user.id,
          email: user.email,
          token: md5(user.id)
        }];
        user.update({ forgettoken: md5(user.id) }).then((response) => {
          sendmailtoUser('Forgetpassword', users);
          res.json({ error: true, result: '', text: 'Password recovery email has been sent on your mail id' });
        }).catch((err) => {
          res.json({ error: true, result: err, text: 'Error found during updation' });
        });
      }
    }).catch((err) => {
      res.json({ error: true, result: err, text: 'Something is wrong!!' });
    });
  }
  else {
    res.json({ error: true, result: '', text: 'parameter not found' });
  }
});

router.route('/changepassword').post(function (req, res) {
  if (req.body) {
    console.log('currentpassword:' + req.body.currentpassword);
    bcrypt.hash(req.body.currentpassword, saltRounds, function (err, hash) {
      console.log(hash);
      db.User.findOne({
        where: {
          id: req.body.userid
        }
      }).then(function (user) {
        if (!user) {
          res.json({ error: true, result: '', text: 'User does not exist.' });
        }
        else if (user.forgettoken == req.body.forgettoken) {
          bcrypt.compare(req.body.currentpassword, user.password, function (err, response) {
            if (err) {
              res.json({ error: true, result: err, text: 'errr' });
            }
            else if (response) {
              bcrypt.hash(req.body.newpassword, saltRounds, function (err, newhash) {
                // let users = [{
                //   name: 'User',
                //   id: user.id,
                //   email: user.email
                // }];
                //sendmailtoUser('Passwordchangeconfirmation', users);
                user.update({ password: newhash, forgettoken: '' }).then((response) => {
                  res.json({ error: false, result: '', text: 'Your password has been updated' });
                }).catch((err) => {
                  res.json({ error: true, result: err, text: 'Error found during updation' });
                });
              });
            }
            else {
              res.json({ error: false, result: '', text: 'current password is not correct' });
            }
          });
        }
        else {
          res.json({ error: true, result: err, text: 'Recovery password token does not exist' });
        }
      }).catch((err) => {
        res.json({ error: true, result: err, text: 'Password recovery email has been sent on your mail id' });
      });
    });
  }
  else {
    res.json({ error: true, result: '', text: 'parameter not found' });
  }
});

router.route('/register').post(function (req, res) {
  if (req.body) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      req.body.password = hash;
      req.body.confirmation_key = md5(req.body.email);
      db.User.create(req.body).then(response => {
        let users = [{
          name: 'User',
          id: response.id,
          key: req.body.confirmation_key,
          email: response.email
        }];
        sendmailtoUser('Confirmation', users);
        res.json({ error: true, result: { isverify: response.isverify, id: response.id, email: response.email }, text: 'User registered successfully,please confirm registration process' });
      }).catch((err) => {
        res.json({ error: true, result: '', text: err.errors[0].message });
      });
    });
  }
  else {
    res.json({ error: true, result: '', text: 'parameter not found' });
  }
});

router.get('/confirm', validate(require('../validation/confirm_user.js')), function (req, res) {

  db.User.findOne({
    where: {
      id: req.query.id,
      confirmation_key: req.query.key
    }
  }).then(function (user) {
    if (!user) {
      res.redirect('/confirmaccount?status=failed');
    }
    else {
      user.update({ isverify: 1, confirmation_key: '' }).then((response) => {
        res.redirect('/confirmaccount?status=success');
      }).catch((err) => {
        res.redirect('/confirmaccount?status=error');
      });
    }
  }).catch((err) => {
    res.redirect('/confirmaccount?status=error');
  });
});

router.post('/login', validate(require('../validation/login.js')), function (req, res) {
  db.User.findOne({
    where: {
      email: req.body.email
    },
  }).then(function (user) {
    //console.log(user);
    if (user == null) {
      res.json({ error: true, result: '', text: 'Invalid Email and password' });
    }
    else if (user.isverify == 1) {

      bcrypt.compare(req.body.password, user.password, function (err, response) {
        if (err) {
          res.json({ error: true, result: err, text: 'errr' });
        }
        else if (response) {

          const token = jwt.sign({ id: user.id }, RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: 120
          });
          var obj = {};
          obj.id = user.id;
          obj.email = user.email;
          obj.token = token;
          res.json({ error: false, result: obj, text: 'user verified' });
        }
        else {
          res.json({ error: false, result: '', text: 'password is not valid' });
        }
      });

    }
    else {
      res.json({ error: false, result: '', text: 'Account is not activated yet,check your email and confirm your account.' });
    }
  });


});


router.get('/id/:userid', verifytoken, function (req, res) {
  if (!validator.isInt(req.params.userid)) {
    res.json('user id is not a valid id');
  }
  db.User.findOne({
    where: {
      id: req.params.userid
    },
    attributes: ['id', 'username', 'email', 'latitude', 'longitude', 'createdAt', 'isverify']
  }).then(function (user) {
    if (!user) {
      res.json('There is no user for this userid');
    }
    res.json(user)
  });
});

function sendEmail(obj) {
  return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
  console.log(templateName);
  let template = new EmailTemplate(path.join(__dirname, '../templates', templateName));
  return Promise.all(contexts.map((context) => {
    return new Promise((resolve, reject) => {
      template.render(context, (err, result) => {
        if (err) reject(err);
        else resolve({
          email: result,
          context,
        });
      });
    });
  }));
}
/* -----sample test-------------
let users = [{
  name: 'User',
  email: 'monu_kanyal@esferasoft.com'
}];

sendmailtoUser(users);

-----------------------------*/
function sendmailtoUser(foldername, users) {
  loadTemplate(foldername, users).then((results) => {
    return Promise.all(results.map((result) => {
      sendEmail({
        to: result.context.email,
        from: 'admin@brewpub.com',
        subject: result.email.subject,
        html: result.email.html,
        text: result.email.text,
      });
    }));
  }).then(() => {
    console.log('Yay!');

    return true;
  }).catch((err) => {
    console.log('mail send errr' + err);
    return false;
  });

}

module.exports = router;








