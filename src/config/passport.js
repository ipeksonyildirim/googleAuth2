const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

module.exports = function (passport) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, token, refreshToken, profile, done) => {
      let admin = false;
      if (profile.displayName === 'Bi Ara') admin = true;
      const newUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
        createdAt: Date.now(),
        isAdmin: admin,
        privileges: {
          read: admin,
          create: admin,
          update: admin,
          delete: admin,
        },
        request: true,
      };
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        user = await User.create(newUser);
        return done(null, user);
      } catch (err) {
        console.error(err);
      }
    },
  ));

  // used to serialize the user for the session
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Yes, it's a valid ObjectId, proceed with `findById` call.
      User.findById(id, (err, user) => done(err, user));
      return;
    }
    return done(null, id);
  });
};
