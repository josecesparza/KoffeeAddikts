var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
    name: String,
    kind: String,
    content: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    location: {
        lat: String,
        lng:String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    created: {
        type: Date,
        default: Date.now()
    },
    price: String,
    public: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("Note", noteSchema);