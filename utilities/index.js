// const fs = require("fs")

 

// const photos = fs.readdirSync("./views/images")
// console.log("page",page)
// page = photos[Math.floor(Math.random() * photos.length)

const randomImage = Math.floor(Math.random() * 48) + 1
document.getElementsByTagName("html")[0].style.backgroundImage = "url(../images/image"+ randomImage +".jpg)"