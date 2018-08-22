var jwt = require('jsonwebtoken');
var fs = require('fs');
const path = require('path');
const RSA_PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, "../secure/public.key"));

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(200).send({ auth: false, message: 'Token is required.' });
  jwt.verify(token,RSA_PUBLIC_KEY, function(err, decoded) {
    if (err)
    return res.status(200).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
   // req.userId = decoded.id;
   //console.log(decoded.id);
    next();
  });
}
module.exports = verifyToken;