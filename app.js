require('dotenv').config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")

const app = express()
const port = process.env.PORT || "3000"
const indexRoutes = require("./routes/index")
const dbConfig = require("./config/database.js")


mongoose.connect(process.env.NODE_ENV === "development" ? 
	"mongodb://localhost:27017/Peak" : dbConfig.url
).catch(err => console.log(err))

app.set("view engine", "ejs")

app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/", indexRoutes)

app.listen(port, function () {
	console.log("Starting server on port: ", port)
})