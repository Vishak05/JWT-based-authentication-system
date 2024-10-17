const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        const token = generateToken(user);
        await sendEmail(user.email, 'Verify your email', `Verify here: /verify/${token}`);
        res.status(201).json({ message: 'Signup successful, please verify your email' });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email' });
        }
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true }).json({ token });
    } catch (error) {
        next(error);
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token is not valid' });
        req.user = decoded;
        next();
    });
};

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();
        await sendEmail(user.email, 'Reset Password', `Reset link: /reset/${resetToken}`);
        res.status(200).json({ message: 'Reset email sent' });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id, resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};
