const nodemailer = require("nodemailer");
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tomas.alves08@gmail.com",
    pass: process.env.NODE_MAILER,
  },
});

async function sendEmail(to: string, subject: string, text: string) {
  let mailOptions = {
    from: "tomas.alves08@gmail.com",
    to,
    subject,
    text,
  };

  return await transporter.sendMail(
    mailOptions,
    function (error: any, info: any) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
}

export default sendEmail;
