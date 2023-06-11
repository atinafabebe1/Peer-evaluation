const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, obmessage) => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    },
    debug: true // Enable verbose logging
  });

  const message = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: subject,
    html: obmessage
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
