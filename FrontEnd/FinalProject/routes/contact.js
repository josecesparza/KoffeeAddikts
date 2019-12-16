//Require the needed packages
var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

//Create the transport host for the SMTP server
let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '2ee7f48be3bcf0',
        pass: 'b94c27bea7a12b'
    }
});

//Get the contact us template
router.get("/", middlewareObj.isLoggedIn,function (req, res) {
    res.render("contact");
});

//Post route for contact us
router.post("/", middlewareObj.isLoggedIn,function (req, res) {
    //Creating message for the email
    const message = {
        from: req.body.email, // Sender address
        to: 'companykoffee@gmail.com', // List of recipients
        subject: req.body.subject, // Subject line got in the contact us template
        text: req.body.content // Plain text body got in the contact us template
    };

    //Send mail via the transport we have created before
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            req.flash("success", "Mail send it correctly");
            res.redirect("/notes");
        }
    });
})
//We export the router, it contains all our routes
module.exports = router;