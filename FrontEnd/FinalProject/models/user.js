//Require mongoose package
var mongoose = require('mongoose');
//Require passport-local-mongoose package
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    //The isBusiness parameter can be just true or false because we have 2 types of accounts
    //With the Business account the user will have more privileges than with the Personal account
    //All the users by default will have a personal account
    isBusiness: {
        type: Boolean,
        default: false
    },
    following: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        }
    ],
    followers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        }
    ],
    //Automatically gets the date of creation of the user
    created: {
        type: Date,
        default: Date.now()
    }
});

//Calling the package passport-local-mongoose
//It will add a username, hash and salt field to store the username, the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose);

//Exports our UserSchema with User as a reference, this reference will be used in other models
module.exports = mongoose.model("User", UserSchema); 