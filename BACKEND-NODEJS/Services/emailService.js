const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "8f15e4001@smtp-brevo.com",
    pass: "bFtJ7UvqZSzTOm3E",
  },
});

async function sendVerificationEmail(toEmail, verificationCode) {
  try {
    const info = await transporter.sendMail({
      from: '"FintechApp" <no-reply@fintechapp.test>', // use consistent dummy sender
      to: toEmail,
      subject: "Verify Your Email Address",
      html: `
        <h3>Hello!</h3>
        <p>Your verification code is:</p>
        <h2 style="color:#6366F1;">${verificationCode}</h2>
        <p>Enter this code on the website-app to verify your email.</p>
        <br />
        <p>Thanks,<br>The FintechApp Team</p>
      `,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

module.exports = sendVerificationEmail;
