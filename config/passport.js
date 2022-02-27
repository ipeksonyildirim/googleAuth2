var GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User')
GOOGLE_CLIENT_ID='275030795765-0nq6l468u7vho51icflops2o1vk74un1.apps.googleusercontent.com';
GOOGLE_CLIENT_SECRET='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';
module.exports = function (passport){
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/google/callback",
        passReqToCallback: true
      },
      async (req, token, refreshToken, profile, done)  => {
          const newUser = {
              googleId: profile.id,
              displayName: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              image: profile.photos[0].value
          }
          try {
              let user = await User.findOne( { googleId: profile.id} )

              if( user)
              done(null, user);
              else{
                  user = await User.create(newUser)
                  done(null, user);
              }
          }catch(err){
            console.error(err)
        }
      }
    )
    );

    
// used to serialize the user for the session
passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        User.findById(id, (err, user) => done(err, user))
      }
      done(null, id)
  })

}

