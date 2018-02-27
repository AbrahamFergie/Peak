const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Gmail = require("node-gmail-api")
const {google} = require("googleapis")
const googleAuth = require('google-auth-library');
const gmail = google.gmail("v1")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  (accessToken, refreshToken, profile, done) => {
 //  	const auth = new googleAuth() 
	// const oauth2Client = new auth.OAuth2(
	// 	process.env.GOOGLE_CLIENT_ID,
	//     process.env.GOOGLE_CLIENT_SECRET,
	//     process.env.GOOGLE_REDIRECT_URI
	// )
	// oauth2Client.credentials = {
	//   access_token: accessToken,
	//   refresh_token: refreshToken	  
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