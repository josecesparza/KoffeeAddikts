var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

module.exports = mongoose.model("Note", noteSchema);