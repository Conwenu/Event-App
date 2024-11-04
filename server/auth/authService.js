require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const {AppError} = require('../helpers/AppError')
const prisma = new PrismaClient();

const login = async(userData) => {
    const {username, email, password} = userData;
    const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email }
          ]
        }
    });
    
    if (!existingUser) {
        throw new AppError('Invalid Username or Password');
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (isMatch) {
        // Password is correct, log the user in
    } else {
        throw new AppError('Invalid Username or Password');
        // Password is incorrect
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token expiration time
    });

    // Step 5: Respond with User Info and Token
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        },
        token: token
    };
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // Return the decoded payload if verification is successful
    } catch (error) {
        throw new AppError('Invalid or expired token', 401); // Handle error for invalid or expired token
    }
};



module.exports = { login, verifyToken }