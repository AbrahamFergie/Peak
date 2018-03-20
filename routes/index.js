const express = require("express")
const request = require("request")
const fs = require("fs")

const router = express.Router() 
const passportGoogle = require("../auth/google");
const utils = require("../utilities/index")

router.get("/", (req, res) => {

	// console.log(req.user)
	const userName = req.user ? req.user.user.google.name : "Hello There" 
	const googleMail = req.user ? req.user.mailData : "Login In To See Mail"
	res.render("../views/pages/home", {userName, googleMail})
})

router.get("/profile", (req, res) => {

	const userName = req.user ? req.user.displayName : "There" 

	res.render("../views/pages/profile", userName )
})

router.get("/google", passportGoogle.authenticate(
		'google', 
		{ scope: [
			"https://www.googleapis.com/auth/plus.login",
			"https://www.googleapis.com/auth/gmail.readonly",
			"https://www.googleapis.com/auth/plus.profile.emails.read",
			"https://www.googleapis.com/auth/calendar"
			] 
		}
	)
)

router.get("/google/callback", passportGoogle.authenticate('google', { failureRedirect: '/' }),
	function(req, res){
		res.redirect('/')}
)
router.get("/google/email-load", function(req, res){
	
})

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router