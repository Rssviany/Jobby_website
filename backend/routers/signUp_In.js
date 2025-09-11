import express from 'express'
import { Register } from '../model/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
import { signUpValidation, signInValidation } from '../validation/SignUpAndSignInValidation.js';
dotenv.config();



const Jwt_secret = process.env.JWTKEY;
const router = express.Router();

router.post('/register', signUpValidation, async (req, res) => {
    const { name, email, password, phoneNumber } = req.body
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User Already Existing" })
    }



    const newUser = new Register({
        name,
        email,
        password,
        phoneNumber
    })
    await newUser.save()
        .then(() => {
            res.status(201).json({ message: "User Registration is Successfull" });

        })
        .catch((e) => {
            if (error.code === 11000 && error.keyPattern.email) {
                return res.status(400).json({ message: 'Email already Existed' })
            }
            res.status(500).json({ message: 'server error', e })
        })
});

router.get('/register', async (req, res) => {
    try {
        const users = await Register.find();
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: "Error fetching Users" }, e);
    }
});

router.post('/login', signInValidation, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Register.findOne({ email });
        
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid Credentilas" });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            Jwt_secret,
            { expiresIn: "2h" }
        );
        res.status(200).json({
            message: "Login successfull", token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (e) {
        res.status(500).json({ message: "Login is Failed" });
    }
});

router.get('/login', async (req, res) => {
    try {
        const user = await Register.find({});
        res.status(200).json({ user })

    } catch (e) {
        res.status(500).json({ message: "Error fetching User" }, e);
    }
});
router.post('/forget-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Register.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User NotFound' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresOtp = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        user.resetOtp = otp;
        user.otpExpires = expiresOtp;

        await user.save();

        // Send OTP by email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rssvinaykumar3801@gmail.com',
                pass: process.env.NODEMAILER_PASS
            }
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Reset Password OTP',
            text: `Your OTP is ${otp}`
        });

        res.json({ message: 'OTP sent to Email' });

    } catch (error) {
        console.log('Error Sending Email:', error);
        res.status(500).json({ message: 'Error sending an OTP' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, resetOtp, newPassword } = req.body;
        const user = await Register.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User NotFound' });
        console.log("Stored OTP:", user.resetOtp);
        console.log("Received OTP:", resetOtp);
        console.log("Now:", new Date());
        console.log("OTP Expires At:", user.otpExpires);

        if (user.resetOtp !== resetOtp || new Date() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or OTP Expires' });
        }

        user.password = newPassword;
        user.resetOtp = null;
        user.otpExpires = null;
        console.log("BCRYPT:", bcrypt);

        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.log('Error While Resetting Password', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});






export default router;