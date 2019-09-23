var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model("Tag", tagSchema);