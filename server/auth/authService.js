require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const {AppError} = require('../helpers/AppError')
const prisma = new PrismaClient();

const login = async(userData, res) => {
    const {username, email, password} = userData;
    
    if (!username || !email) {
        throw new AppError('Username or Email is required', 400);
    }
    if (!password) {
        throw new AppError('Password is required', 400);
    }
    if(password.length < 8)
    {
        throw new AppError('Password must be at least 8 characters', 400);
    }
    if(password.length > 20)
    {
        throw new AppError('Password must be at most 20 characters' , 400);
    }

    const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email }
          ]
        }
    });
    
    if (!existingUser) {
        throw new AppError('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
     // Password is correct
    if (isMatch) {
        // if(!existingUser.isAccountVerified)
        // {
        //     // Tell User to check for a confirmation email
        //     throw new AppError('Please Check Your Email For Confirmation Email');
        // }
    } else {
        throw new AppError('Invalid Credentials');
        // Password is incorrect
    }

    const token = jwt.sign({ id: existingUser.id, username: existingUser.username, email: existingUser.email }, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token expiration time
    });
    // Step 5: Respond with User Info and Token
    res.cookie('token', token);
    
    return {
        user: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email
        },
        token: token
    };
}

const register = async(userData) => {
    const {username, email, password} = userData;
    
    if (!username || !email) {
        throw new AppError('Username or Email is required', 400);
    }
    if(username.length < 8)
    {
        throw new AppError('Username must be at least 8 characters' , 400);
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new AppError('Invalid email format' , 400);
    }
    if (!password) {
        throw new AppError('Password is required' , 400);
    }
    if(password.length < 8)
    {
        throw new AppError('Password must be at least 8 characters' , 400);
    }
    if(password.length > 20)
    {
        throw new AppError('Password must be at most 20 characters' , 400);
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });
        
        if (existingUser) {
            throw new AppError('Email or Username is already registered' , 400);
        }

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword, 
                isAccountVerified : false,
            }
        });

        // Send email to the new user to verify

    } catch (error) {
        throw new AppError('Server error, please try again later' , 500)
    }
}

const logout = async(userData) => {

}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // Return the decoded payload if verification is successful
    } catch (error) {
        throw new AppError('Invalid or expired token', 401); // Handle error for invalid or expired token
    }
};



module.exports = { login, verifyToken, register, logout }; 