const {google}  = require("googleapis"),
	  OAuth2 	= google.auth.OAuth2, 
      Gcalendar = require("google-calendar")

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
						    // console.log("========================", secondResponse.data.labelIds)
							resolve(secondResponse.data.snippet)
						})	
					})
				});		
				Promise.all(promises).then(data => {
					return res(data)
				})
			});	
  		})
	}	
}