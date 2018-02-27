const express = require("express")
const request = require("request")
const fs = require("fs")

const router = express.Router() 
const passportGoogle = require("../auth/google");
const displayInbox = require("../utilities/googleLogin.js")

router.get("/", (req, res) => {
	// console.log("initial get route",JSON.stringify(req.user, null, 4))
	const userName = req.user ? req.user.profile.displayName : "There"
	const messages = req.user ? req.user.messages : "Login In To See Messages" 

	res.render("../views/pages/home", {userName, messages})

})
router.get("/profile", (req, res) => {
	// console.log("initial get route",JSON.stringify(req.user, null, 4))
	const userName = req.user ? req.user.displayName : "There" 

	res.render("../views/pages/profile", userName )
})
//,'https://www.google.com/m8/feeds'
//, 'https://www.googleapis.com/auth/plus.profile.emails.read'
router.get("/google", passportGoogle.authenticate(
		'google', 
		{ scope: ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/plus.profile.emails.read"] }
	)
)

router.get("/google/callback", passportGoogle.authenticate('google', { failureRedirect: '/' }),
	function(req, res){

		// console.log("thiangeohskgtsenak", req.user)
		res.redirect('/')}
)

module.exports = router