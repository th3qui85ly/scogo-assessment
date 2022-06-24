const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jwt.verify(req.headers.authorization.split(' ')[1], 'SeCrEt', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
}

// here this is the auth middleware which validates whether the user is logged in or not,
// one must signup and login their account and get the accesToken as response body on successful login...

// once the token is received, it must be utilized in "HEADERS" to get the access of 'secured' endpoints of the API
/*
   The Header must be of this format {JWT <<yourToken>>}
   And appropriate json bosy should be sent for accessing the endpoints as desired.
*/