const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const ResearchInfo = require('../models/researcherInfoModel')
const nodemailer = require('nodemailer')

const service = process.env.EMAIL_SERVICE
const email = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
    service: service,
    secure: true,
      auth: {
        user: email,
        pass: pass,   
      },
    });


async function sendVerificationEmail(id, user, email) {
    const verificationToken = Math.random().toString(36).substr(2) + Date.now();
    const verificationLink = `${process.env.APP_CLIENT}/verify-account/${id}/${verificationToken}`;

    const mailOptions = {
        from: transporter.options.auth.user,
        to: email,
        subject: 'NURD Account Verification',
        html: `<p>Hello, ${user}!</p><p>Click on the following link to verify your account:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    const updated = await User.findOneAndUpdate({ _id: id }, { verifiedEmail: verificationToken }, { new: true });

    if (updated) {
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent:', mailOptions.to);
            return true;
        } catch (error) {
            console.log('Error sending email:', error);
            return false;
        }
    }

    return false;
}

// @desc Register new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password} = req.body

    if(!firstName ||!lastName || !email || !password){
        res.status(400)
        throw new Error('Please fill in all fields')
    }
    if(email.endsWith('@students.national-u.edu.ph') == false){
        res.status(400)
        throw new Error('Invalid email, please use your NU provided email')
    }

    //check user if exist
    const userExists = await User.findOne({email: email})

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }    

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user to db
    const user = await User.create({
        firstName, lastName, email, password: hashedPassword
    })

    if (user) {
        const emailSent = await sendVerificationEmail(user._id, user.firstName, user.email);
        if (emailSent) {
            res.status(201).json({ message: 'Registration Successful', id: user.id, email: user.email });
        } else {
            res.status(400);
            throw new Error('Something went wrong');
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})


// @desc Authenticate user & get token
//@route POST /api/users/login
//@access Public

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    //check for email
    const user = await User.findOne({email: email})

    if(user && (await bcrypt.compare(password, user.password))){
        if(user.verifiedEmail == 'true'){
            res.status(200).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: generateToken(user._id)
            })
        }else{
            res.status(400)
            throw new Error('Please verify your email')
        }
    }else{
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const generateToken = (id) => {
    return jwt.sign({
        user: { id }
    }, process.env.JWT_SECRET, { 
        expiresIn: '30d',
    })
}

const verifyUser = asyncHandler(async (req, res) => {
    const {id, token} = req.body

    const usertoken = await User.findById(id).select('verifiedEmail')

    if(usertoken?._id){
        if(usertoken.verifiedEmail == 'true'){
            res.status(201).json({message: 'Account already verified'})
        }else if(usertoken.verifiedEmail == token){
            await User.findByIdAndUpdate(id, {verifiedEmail: 'true'})
            res.status(201).json({message: "Email verified"})
        }else{
            res.status(400)
            throw new Error('Invalid token')
        }
    }else{
        res.status(400)
        throw new Error('Link Tampered, Invalid User')
    }
})

const resendVerification = asyncHandler(async (req, res) => {
    const {id} = req.body

    const user = await User.findById(id).select('firstName email verifiedEmail')
    
    if(!user?._id){
        res.status(400)
        throw new Error('Invalid User')
    }else if(user.verifiedEmail == 'true'){
        res.status(201).json({message: 'Account already verified'})
    }else{
        const email = await sendVerificationEmail(user._id ,user.firstName, user.email)

        if(email){
            res.status(201).json({message:'Verification Resend Successful'})
        }else{
            res.status(400)
            throw new Error('Something went wrong')
        }
    }

})


module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    resendVerification
}