const passport       = require("passport"),
      GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
      Gmail          = require("node-gmail-api"),
      Gcalendar      = require("google-calendar"),
      User           = require("../models/user"),
      utils          = require("../utilities/index")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  (accessToken, refreshToken, profile, done) => {
  	process.nextTick(function() {
        let mail = utils.gmail(accessToken, refreshToken)
        mail.then(mailData => {            
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err) return done(err);

                if (user) {
                    return done(null, {user, mailData});
                } else {
                    const newUser = new User();
                    newUser.google.id    = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, {user: newUser, mailData});
                    });
                }
            });
        })
        // try to find the user based on their google id
        // const google_mail     = new Gmail(accessToken),
              // google_calendar = new Gcalendar(accessToken),
              // messages        = google_mail.messages('label:inbox', {max: 10})
        
        // messages.on('data', function (d) {
        //   console.log(d.snippet)
        // })
        // google_calendar.calendarList.list(function(err, calendarList) {
        //     // console.log("calendarList",calendarList)
            
        //     google_calendar.events.list(calendarList.items[0].id, function(err, calendarList1) {
        //         console.log("calendarList1", calendarList1)
        //     });
        // });
    });
  }
));

passport.serializeUser(function(user, done) {
        done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id)
});

module.exports = passport;