const nodemailer = require("nodemailer");

async function send_email(to , msg){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAIL_PASSWORD, 
        },
      });

      let info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Alarm Alert!!",
        text: msg,
      });

      console.log("Message sent: %s", info.messageId);
}


module.exports = send_email;