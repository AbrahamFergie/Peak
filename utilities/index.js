const {google}  = require("googleapis"),
	  OAuth2 	= google.auth.OAuth2, 
      Gcalendar = require("google-calendar"),
      moment	= require("moment"),
      atob		= require("atob")

module.exports = {
	removeSpaces: (str) => str.replace(" ", "+"),
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
			    maxResults: 5
			  }, (err, firstResponse) => {
			    if (err) {
			      console.log('The API returned an error: ' + err);
			      return;
			    }
			    console.log("messages!", firstResponse.data.messages)
			    let messages = firstResponse.data.messages,
					promises = messages.map((message) => {
					return new Promise((resolve, reject) => {
						client.users.messages.get({
						'userId': "me",
						'id': message.id
						}, (err, secondResponse) => {
							if(err) reject(err)
							let emailMessage= "things", count = 0
							console.log("secondResponse.data", Object.keys(secondResponse.data))
							if(secondResponse.data.payload.body.size === 0){
								console.log(
									"========from if ================="
								)   
									emailMessage = atob(secondResponse.data.payload.parts[0].body.data)
								// emailMessage = atob(secondResponse.data.payload.parts[0].body.data)
								// console.log(secondResponse.data.payload.parts[0].body.data)
						        // let encodedBody = secondResponse.data.payload.parts[0].body.data.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
						        // console.log(decodeURIComponent(escape(window.atob(encodedBody))));								
							}else {
								console.log(
									"===========from else============="
								)
									emailMessage = atob(secondResponse.data.payload.body.data)
								// emailMessage = atob(secondResponse.data.payload.body.data)					
							}
							if(!secondResponse.data){
								console.log("didn't make it")
								count++
							}else {
								console.log("===========made",secondResponse.data.internalDate,"it=============")
								count++
							}
							resolve({
								fullText: 	emailMessage,
								snippet:    _fixText(secondResponse.data.snippet),
								date: 		_formatTime(secondResponse.data.internalDate) || "no time stamp"
							})
						})	
					}).catch(err => console.log)
				});		
				Promise.all(promises)
					.then(data => res(data))
					.catch(err => console.log)
			});	
  		}).catch(err => console.log)
	}	
}
function _fixText(str) {
	return str
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
}
function _formatTime(time) {
	console.log("==================timessaioheygaithgy",time)
	return moment(parseInt(time)).format("Do of MMM YYYY HH:mm:ss")
}