const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const message = {
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
