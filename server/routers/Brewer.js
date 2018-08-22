var router = require('express').Router();
var validator = require('validator');
var db = require('../models/index');

router.route('/')
    // Gets all inventories
    .get(function (req, res) {
        db.Brewer.findAll().then(function (brewers) {
            if (brewers.length === 0) {
                res.json('There are no brewers in the database');
            }
            res.json(brewers);
        });
    });

router.route('/create').post(function (req, res) {
    console.log(req.body);

    db.Brewer.create(req.body).then(brewer => {
        if (brewer.id != '') {
            let hours = [];
            for (let i = 0; i < 7; i++) {
                hours.push({ Order: i, BrewerId: brewer.id });
            }

            db.Brewer_hours.bulkCreate(hours).then(() => {
                res.json({ error: false, result: brewer });
            }).catch((err) => {
                res.json({ error: true, result: err });
            });

        }

        // you can now access the newly created task via the variable task
    }).catch((err) => {
        res.json({ error: true, result: err.errors[0].message });
    })
});


router.route('/id/:brewerid').get(function (req, res) {
    if (!validator.isInt(req.params.brewerid)) {
        res.json('brewerid is not a valid id');
    }
    db.Brewer.find({
        where: { id: req.params.brewerid },
        include: [{
            model: db.Brewer_hours,
            where: {
                BrewerId: req.params.brewerid
            }
        }]
    }).then(function (brewer) {
        if (!brewer) {
            res.json('There is no brewer for this userid');
        }
        else {
            db.Brewer_reviews.findAll({
                where: { BrewerId: req.params.brewerid }
            }).then((reviews) => {
                //console.log(reviews.length);  
                //var arr=[];  
                //console.log(reviews);
                //console.log(brewer);
                //arr.push(brewer);
                //arr.push({brewer_reviews:reviews});
                var result = brewer.toJSON();
                result.reviews = reviews;
                res.json(result);
            }).catch((err) => {
                res.json('err:' + err);
            });
        }
    });
});


router.route('/mk').get(function (req, res) {
    db.Brewer.find({
        where: { id: 5 },
        include: [{
            model: db.Brewer_hours
        },
        {
            model: db.Brewer_reviews
        }]
    }).then(function (brewer) {
        if (!brewer) {
            res.json('There is no brewer for this userid');
        }
        res.json(brewer);

    }).catch((err) => res.json(err));
});


/* multiple include ? only one include */

module.exports = router;








