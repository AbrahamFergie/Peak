const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Gmail = require("node-gmail-api")
const {google} = require("googleapis")
const googleAuth = require('google-auth-library');
const gmail = google.gmail("v1")

const User = require("../models/user")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  (accessToken, refreshToken, profile, done) => {
  	process.nextTick(function() {
        // try to find the user based on their google id
        User.findOne({ 'google.id' : profile.id }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                // if a user is found, log them in
                return done(null, user);
            } else {
                // if the user isnt in our database, create a new user
                const newUser = new User();
                // set all of the relevant information
                newUser.google.id    = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name  = profile.displayName;
                newUser.google.email = profile.emails[0].value; // pull the first email

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    });
 //  	const auth = new googleAuth() 
	// const oauth2Client = new auth.OAuth2(
	// 	process.env.GOOGLE_CLIENT_ID,
	//     process.env.GOOGLE_CLIENT_SECRET,
	//     process.env.GOOGLE_REDIRECT_URI
	// )
	// oauth2Client.credentials = {
	//   access_token: accessToken,
	//   refresh_token: refreshToken,
	//   token_type: "Bearer"	  
	// };
	// // console.log("gmail",gmail.users.messages.get)
	// gmail.users.messages.list(
	// 	{
	// 		auth: oauth2Client,
	// 		userId: 'me'
	// 	}, function(err, response){
	// 		if(err) throw err
	// 		console.log("MESSAGES", response)
	// 	}
	// )
	return done(null, {profile})
  }
));

passport.serializeUser(function(user, done) {
        done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id)
});

module.exports = passport;