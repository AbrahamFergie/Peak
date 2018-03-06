const express = require("express")
const request = require("request")
const fs = require("fs")

const router = express.Router() 
const passportGoogle = require("../auth/google");
const {gmail, loadMail} = require("../utilities/index")

router.get("/", (req, res) => {
	console.log("req.user",req.user)
	const userName = req.user ? req.user.user.google.name : "Hello There"
	const googleMail = req.user ? req.user.mailData : "Login To View Mail"
	
	res.render("../views/pages/home", {userName, googleMail})
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

		// console.log("thiangeohskgtsenak", req.user)
		res.redirect('/')}
)

// router.get("/google/load-mail", function(req, res){
// 	Object.keys(req.sessionStore.sessions).forEach(function(obj){
// 		if(JSON.parse(req.sessionStore.sessions[obj])["passport"]){
// 			const accessToken = JSON.parse(req.sessionStore.sessions[obj])["passport"]["user"]["google"]["token"]
// 			console.log("=================in route===============", accessToken, req.sessionStore.sessions[obj])
// 			gmail(accessToken, res)
// 		}
// 	})
// })

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router