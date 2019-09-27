var Note = require('./models/note');
var Tag = require('./models/tag');

function seedDB() {
    console.log("Seeds function ON!")

    var tags = [
        {
            name: "todos"
        }, {
            name: "done"
        }, {
            name: "stopped"
        }
    ];

    Tag.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            tags.forEach(function (tag) {
                Tag.create(tag, function (err, newTag) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("New Tag: " + newTag + " created");

                        var newNote = {
                            title: "NoteSeed",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec felis rhoncus, blandit lectus in, viverra nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce varius elit ipsum, eget congue turpis tristique in. Sed ornare ante et neque posuere, at tristique odio elementum.",
                            tags: newTag
                        };

                        Note.remove({}, function (err) {
                            for (var i = 0; i < 2; i++) {
                                Note.create(newNote, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Note created");
                                    }
                                })
                            }
                        });
                    }
                });
            });
        }
    });
};

module.exports = seedDB;