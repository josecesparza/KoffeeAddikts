//Require mongoose package
var mongoose = require('mongoose');

//Define the note schema
var noteSchema = new mongoose.Schema({
    name: String,
    kind: String,
    content: String,
    //The author parameter is linked with the user collection, getting his id and username
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    //To get the location we are saving the latitude and longitud
    location: {
        lat: String,
        lng:String
    },
    //The comments parameter is linked with the comment collection, getting the comment id
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    //Automatically gets the date of creation of the note
    created: {
        type: Date,
        default: Date.now()
    },
    price: String,
    //The public parameter can be just true or false because the note can be private or public
    //All the notes by default will be private
    public: {
        type: Boolean,
        default: false
    },
});

//Exports our noteSchema with Note as a reference
module.exports = mongoose.model("Note", noteSchema);