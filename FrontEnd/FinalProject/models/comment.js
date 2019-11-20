//Require mongoose package
var mongoose = require('mongoose');

//Define the schema for our comments
var commentSchema = new mongoose.Schema({
    text: String,
    //The author parameter is linked with the user collection, getting his id and username
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    //Automatically gets the date of creation of the comment
    created: {
        type: Date,
        default: Date.now()
    }
});

//Exports our commentSchema with Comment as a reference, this reference will be used in the note model
module.exports = mongoose.model("Comment", commentSchema);