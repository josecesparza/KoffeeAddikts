var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    name: String,
    notes: Array
});

module.exports = mongoose.model("Tag", tagSchema);