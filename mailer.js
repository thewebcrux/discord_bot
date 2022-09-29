const nodemailer = require('nodemailer');
const { username,password } = require('./.config.json');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: username,
    pass: password
  }
});

module.exports = transporter;