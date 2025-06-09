const Auth = require('../models/auth');
const Otps = require('../models/otpModel');

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
