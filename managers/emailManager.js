const nodemailer = require("nodemailer");

const emailManager = async (to, text, html, subject) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "56180d71d1393c",
      pass: "314dcf1c872602",
    },
  });

  await transport.sendMail({
    to: to,
    from: "test@expensetracker.com",
    text: text,
    html: html,
    subject: subject,
  });
};

module.exports = emailManager;
