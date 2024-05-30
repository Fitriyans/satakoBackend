const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user.model.js"); // Adjust the path as needed

const { generateAccessToken, getUserId } = require("../helpers/utility");

// Configure nodemailer (update with your SMTP settings)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "your-email@gmail.com", 
    pass: "your-email-password",
  },
});

// Function to send email
const sendResetEmail = (email, token) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Please use the following link to reset your password: 
    http://your-domain.com/reset-password?token=${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// Route to sign up a new user
const signup = async (req, res) => {
  try {
    const { name, email, password, age, gender, role } = req.body;
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        message: "User already exists",
        error_code: 400,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const lowerCaseGender = gender.toLowerCase();
    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender: lowerCaseGender,
      role,
    });

    await user.save();

    const { password: _, ...userNoPassword } = user.toObject();

    return res.status(201).json({
      message: "User created successfully",
      data: userNoPassword,
      error_code: 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error_code: 500,
    });
  }
};

// Route to log in a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = generateAccessToken(user); // Implement token generation
        const { password, ...customUser } = user.toObject();
        return res.status(200).json({
          message: "Login success",
          data: { customUser, token },
          error_code: 0,
        });
      } else {
        return res.status(401).json({
          message: "Invalid credentials",
          error_code: 401,
        });
      }
    } else {
      return res.status(404).json({
        message: "User not found",
        error_code: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error_code: 500,
    });
  }
};

// Route to request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error_code: 404,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1); // 1 hour expiration

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expireDate;
    await user.save();

    sendResetEmail(email, token);

    return res.status(200).json({
      message: "Password reset email sent",
      error_code: 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error_code: 500,
    });
  }
};

// Route to reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired",
        error_code: 400,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Password has been reset",
      error_code: 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error_code: 500,
    });
  }
};

module.exports = { signup, login, requestPasswordReset, resetPassword };
