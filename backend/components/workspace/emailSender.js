const nodemailer = require('nodemailer');
const Service_Response = require("./service_response.js")
require("dotenv").config();

let myEmail = process.env.EMAIL_SENDER
let myPass = process.env.EMAIL_PASSWORD

exports.sendEmail = (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: myEmail,
          pass: myPass
        }
      });
      
      let mailOptions = {
        from: myEmail,
        to: to,
        subject: subject,
        text: text
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return new Service_Response(undefined, 500, true, error)
        } else {
          return new Service_Response(undefined)
        }
      }); 
}   
