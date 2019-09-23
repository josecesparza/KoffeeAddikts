var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ]
});

module.exports = mongoose.model("Note", noteSchema);