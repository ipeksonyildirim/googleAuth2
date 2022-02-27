const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

GOOGLE_CLIENT_ID='275030795765-f97ci8qa16ntjjf5lkk4onbrpjfe3uii.apps.googleusercontent.com';
GOOGLE_CLIENT_SECRET='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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/google/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
));

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user); 
    
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
    done(null, user); 
});