const Auth = require('../models/auth');
const Otps = require('../models/otpModel');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const randomstring = require('randomstring');
const sendEmail = require('../Services/emailService');
require('dotenv').config();

function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: 'numeric',
  });
}

async function register(req, res) {
  const { email, username, password, confirmPassword, accountType } = req.body;

  // Validate input
  if (!email || !username || !password || !confirmPassword || !accountType) {
    return res.status(400).json({ status: 'error', message: 'Please provide all the required information.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ status: 'error', message: 'Passwords do not match.' });
  }

  try {
    // Check if user exists
    const existingUser = await Auth.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User with this email or username already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (initially unverified)
    const newUser = await Auth.create({
      email: email.trim().toLowerCase(),
      username,
      accountType,
      password: hashedPassword,
      isVerified: false, // assuming you have this field
    });

    console.log('New user created:', newUser);

    // Generate OTP and save
    const otp = generateOTP();
    await Otps.create({ email, otp });

    // Send verification email with OTP
    await sendEmail({
      to: email,
      subject: 'Verify Your Email',
      message: `
        <h3>Welcome, ${username}!</h3>
        <p>Your OTP for email verification is:</p>
        <h2 style="color:#6366F1;">${otp}</h2>
        <p>This OTP is valid for a short time.</p>
        <br/>
        <p>Thanks,<br/>The FintechApp Team</p>
      `,
    });

    // Generate JWT token
    const token = JWT.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Set cookie with token
    res.cookie('token', token, { secure: false, httpOnly: true });

    return res.status(200).json({
      status: 'success',
      message: 'User registered successfully. An OTP has been sent to your email for verification.',
      data: {
        token,
        user: {
          email: newUser.email,
          username: newUser.username,
          accountType: newUser.accountType,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ status: 'error', message: 'Registration failed.' });
  }
}


// Login function
 async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Clean the email
    const cleanedEmail = email.trim().toLowerCase();

    // Check if the user exists
    const user = await Auth.findOne({ email: cleanedEmail });
    console.log("User found:", user);

    // If user not found or password doesn't match
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Create a JWT token
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Send token as a cookie
    res.cookie('token', token, { secure: false, httpOnly: true });

    return res.status(200).json({
      status: 200,
      message: 'Login successful',
      data: {
        token: token,
        user: {
          email: user.email,
          username: user.username,
        },
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
}

    async function forgotPassword (req, res)  {
        const { email } = req.body;
    
        
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user found with that email' });
        }
    
     //Generating a reset token
        const resetToken = user.createPasswordResetToken();
    
        await user.save({ validateBeforeSave: false });
    
        //  Sending the reset token to the user's email (URL should be front-end based)
        const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    
        try {
            
            const transporter = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
    
            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL_USERNAME,
                subject: 'Password Reset',
                html: `<p>You requested a password reset. Click this <a href="${resetURL}">link</a> to reset your password.</p>`
            };
    
            await transporter.sendMail(mailOptions);
    
            res.status(200).json({ message: 'Password reset link sent to your email' });
        } catch (error) {
            // Reset token if email sending fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
    
            return res.status(500).json({ message: 'Error sending the email. Try again later.' });
        }
    };


    // POST: Reset password
    async function resetPassword (req, res)  {
        const { tokens } = req.params;
        const { password, confirmPassword } = req.body;
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
    
        //  Finding the user by token and ensure the token is still valid
        const hashedToken = crypto.createHash('sha256').update(tokens).digest('hex');
    
        const user = await Auth.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }  // Token must not be expired
        });

// console.log('Token from URL:', tokens);
// console.log('Hashed token from URL:', hashedToken);
    
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }
    
        //  updating the password,if the token hasnt expired
        user.password = await argon2.hash(password);  // Hashing the new password
        user.resetPasswordToken = undefined;  // Clearing the reset token and expiration
        user.resetPasswordExpires = undefined;
    
      
        await user.save();
    
      
        const jwtToken = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
    
        res.status(200).json({
            status: 200,
            message: 'Password reset successfully',
            data: {
                token: jwtToken,
                user: {
                    email: user.email,
                    name: user.username,
                }
            }

        });
    };

    async function logOut(req, res) {
        // Clear the token cookie by setting it to expire in the past
        res.cookie('token', '', {
            expires: new Date(Date.now() - 1000), //  cookie expires immediately
            httpOnly: true, // Prevents JavaScript access to the cookie
            // secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        });
        
        res.status(200).json({ status: 200,message: 'Logout successful' });
    }
    

    
module.exports = { register,login,forgotPassword,resetPassword,logOut };