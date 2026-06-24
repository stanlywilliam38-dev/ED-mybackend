const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = {
  requireAuth
};
