const {google}  = require("googleapis"),
	  OAuth2 	= google.auth.OAuth2, 
      Gcalendar = require("google-calendar"),
      moment	= require("moment")

module.exports = {
	gmail: (accessToken, refreshToken) => {
		const oauth2Client = new OAuth2(
			process.env.GOOGLE_CLIENT_ID,
		    process.env.GOOGLE_CLIENT_SECRET,
		    process.env.GOOGLE_REDIRECT_URI
    	)
    	oauth2Client.setCredentials({
    		access_token: accessToken,
    		refresh_token: refreshToken
    	})
		const client = google.gmail({
			version: "v1",
			auth: oauth2Client
		}) 


  		return new Promise((res, rej) => {
  			client.users.messages.list({
			    auth: oauth2Client,
			    userId: 'me',
			  }, function(err, firstResponse) {
			    if (err) {
			      console.log('The API returned an error: ' + err);
			      return;
			    }
			    let messages = firstResponse.data.messages,
					promises = messages.map((message) => {
					return new Promise((resolve, reject)=>{
						client.users.messages.get({
						'userId': "me",
						'id': message.id
						}, function(err, secondResponse){
							if(err) reject(err)
							resolve({
								snippet: fixText(secondResponse.data.snippet),
								date: formatTime(secondResponse.data.internalDate)
							})
						})	
					})
				});		
				Promise.all(promises)
					.then(data => {
						return res(data)
					})
					.catch(err => console.log(err))
			});	
  		})
	}	
}
function fixText (str) {
	return str
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
}
function formatTime (time) {
	return moment(parseInt(time)).format("Do of MMM YYYY HH:mm:ss")
}