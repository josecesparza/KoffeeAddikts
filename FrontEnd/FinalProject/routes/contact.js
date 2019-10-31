var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '2ee7f48be3bcf0',
        pass: 'b94c27bea7a12b'
    }
});

router.get("/", middlewareObj.isLoggedIn,function (req, res) {
    res.render("contact");
});

router.post("/", middlewareObj.isLoggedIn,function (req, res) {
    const message = {
        from: req.body.email, // Sender address
        to: 'companykoffee@gmail.com',         // List of recipients
        subject: req.body.subject, // Subject line
        text: req.body.content // Plain text body
    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            req.flash("success", "Mail send it correctly");
            res.redirect("/notes");
        }
    });
})

module.exports = router;