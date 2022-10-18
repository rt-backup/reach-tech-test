const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

require('dotenv').config()

const admin = require("firebase-admin") 
admin.initializeApp(functions.config().firebase);
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
/**  * using gmail with nodemailer  */

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: functions.config().someservice.id,
    pass: functions.config().someservice.key,
  },
});

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // getting dest email by query string
    const email = req.query.email;
    const name = req.query.name;
    const message = req.query.message;
    const mailOptions = {
      from: "holagraph <holagraphcorporate@gmail.com>",
      to: "info@reach-tech.com",
      subject: "Message from Reach-tech", // email subject
      html:
        `           
<div>             
From:` +
        name +
        `<br /><br />              
Email: ` +
        email +
        `<br /><br />             
Message:` +
        message +
        `<br /><br />           
</div>           
`, // email content in HTML
    };
    // returning result
    return transporter.sendMail(mailOptions, (erro, info) => {
      if (erro) {
        return res.send(erro.toString());
      }
      return res.send();
    });
  });
});