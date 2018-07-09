const express = require("express"),
	  request = require("request"),
	  fs = require("fs"),
	  router = express.Router(), 
	  passportGoogle = require("../auth/google"),
	  utils = require("../utilities/index")

router.get("/", (req, res) => {
	const userName = req.user ? req.user.user.google.name : "Hello There", 
	googleMail = req.user ? req.user.mailData : "Login To Begin"
	res.render("../views/pages/home", {userName, googleMail})
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

router.get(
	"/google/callback",
	passportGoogle.authenticate('google', { failureRedirect: '/' }),
	function(req, res){
		res.redirect('/')
	}
)
router.post("/github-jobs", function(req, res){
	const { description, location } = req.body,
		  formattedDescription = utils.removeSpaces(description),
		  formattedLocation = utils.removeSpaces(location),
		  url = "https://jobs.github.com/positions.json?description="+ formattedDescription + "&location=" + formattedLocation
	request(url, (err, response, body) => {
		if(err) console.log(err)
		console.log("========================", JSON.parse(body))
		res.json(JSON.parse(body))
	})
})

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router