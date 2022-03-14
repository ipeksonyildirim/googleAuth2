var GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user.model')
GOOGLE_CLIENT_ID='275030795765-f97ci8qa16ntjjf5lkk4onbrpjfe3uii.apps.googleusercontent.com';
GOOGLE_CLIENT_SECRET='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';
module.exports = function (passport){
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/google/callback",
        passReqToCallback: true
      },
      async (req, token, refreshToken, profile, done)  => {
        let admin = false;
        if(profile.displayName === "Bi Ara")
          admin = true;
          const newUser = {
              googleId: profile.id,
              displayName: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              image: profile.photos[0].value,
              isAdmin: admin,
              privileges: {
                read: admin,
                create: admin,
                update: admin,
                delete: admin
              },
              request: true
          }
          try {
              let user = await User.findOne( { googleId: profile.id} )

              if( user)
              return done(null, user);
              else{
                  user = await User.create(newUser)
                  return done(null, user);
              }
          }catch(err){
            console.error(err)
            return 
        }
      }
    )
    );

    
// used to serialize the user for the session
passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        User.findById(id, (err, user) => done(err, user))
        return
      }
      return done(null, id)
  })

}

