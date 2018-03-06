const mongoose = require("mongoose")
const bCrypt = require("bcrypt-nodejs")

const userSchema = mongoose.Schema({
	google: {
		id: String,
		token: String,
		email: String,
		name: String
    }
})

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);