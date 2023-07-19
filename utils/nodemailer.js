const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "wilburn.hayes13@ethereal.email",
    pass: "6wyhMA1zj5yt7RpDCz",
  },
});

const mailOptions = {
  from: "kkccsocialmedia@gmail.com",
  to: process.env.EMAIL_TO,
};
module.exports = { transporter, mailOptions };
