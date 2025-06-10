const Auth = require('../models/auth');
const Otps = require('../models/otpModel');
const nodeMailer = require( "nodemailer")

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.query;
    const existingOTP = await Otps.findOneAndDelete({ email, otp });
    if (!existingOTP) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

        const user = await Auth.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Your account is now active.',
      user: {
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    // Check if user exists
    const user = await Otps.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);  // 6 digit random number

    // Set expiry time (10 minutes from now)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with new OTP and expiry
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();


 const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: false,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_APP_PASS,
    },
  });


    // Send email with new OTP
    const mailOptions = {
      from: 'noibisjunior22@gmail.com',
      to: email,
      subject: 'Your new OTP code',
      text: `Your new OTP code is ${otp}. It expires in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP has been resent to your email' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
};
