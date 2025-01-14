require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../helpers/AppError')
const prisma = new PrismaClient();

const login = async (userData, res) => {
    const { username, email, password } = userData;

    if (!username || !email) {
        throw new AppError('Username or Email is required', 400);
    }
    if (!password) {
        throw new AppError('Password is required', 400);
    }
    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400);
    }
    if (password.length > 20) {
        throw new AppError('Password must be at most 20 characters', 400);
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

    // const token = jwt.sign({ id: existingUser.id, username: existingUser.username, email: existingUser.email }, process.env.JWT_SECRET, {
    //     expiresIn: '1d'
    // });

    const accessToken = jwt.sign({user: { id: existingUser.id, username: existingUser.username, email: existingUser.email }}, process.env.JWT_SECRET, {
        expiresIn: '15m'
    });

    const refreshToken = jwt.sign({user: { id: existingUser.id, username: existingUser.username, email: existingUser.email }}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });

    await prisma.user.update({
        where: { id: parseInt(existingUser.id) },
        data: {
            refreshToken : refreshToken
        },
    });

    // WHEN I DEPLOY SET THE COOKIE SECURE OPTION TO TRUE!
    // Step 5: Respond with User Info and Token
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return {
        user: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email
        },
        accessToken: accessToken,
    };
}

const register = async (userData) => {
    const { username, email, password } = userData;

    if (!username || !email) {
        throw new AppError('Username or Email is required', 400);
    }
    if (username.length < 8) {
        throw new AppError('Username must be at least 8 characters', 400);
    }
    if (username.length > 20) {
        throw new AppError('Username must be at most 20 characters', 400);
    }
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        throw new AppError('Username must only contain letters and numbers', 400);
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new AppError('Invalid email format', 400);
    }
    if (!password) {
        throw new AppError('Password is required', 400);
    }
    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400);
    }
    if (password.length > 20) {
        throw new AppError('Password must be at most 20 characters', 400);
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
            throw new AppError('Email or Username is already registered', 400);
        }

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                isAccountVerified: false,
            }
        });

        // Send email to the new user to verify

    } catch (error) {
        throw new AppError('Server error, please try again later', 500)
    }
}

const logout = async (cookies, res) => {
    
    if(!cookies?.refreshToken)
    {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.refreshToken;
    const foundUser = await prisma.user.findFirst({ where: { refreshToken: refreshToken } });
    if(!foundUser)
    {
        await res.clearCookie('refreshToken', {httpOnly : true});
        
        await res.clearCookie('accessToken');
        return res.sendStatus(204);
    }

    await prisma.user.update({
        where: { id: foundUser.id },
        data: { refreshToken: null },
    });
    await res.clearCookie('refreshToken', {httpOnly : true});
        
    await res.clearCookie('accessToken');

    res.sendStatus(204);
    
}

// for access
const verifyJWT = (req, authHeader) => {
    if (!authHeader) {
        throw new AppError('Access denied. No token provided.', 401)
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            throw new AppError('Invalid or expired token', 403); //invalid token
        }
        req.user = decoded.user
    });
}

const handleRefreshToken = async (cookies, res) => {
        if (!cookies?.refreshToken) {
            throw new AppError('No Refresh Token', 401);
        }
        const refreshToken = cookies.refreshToken;
        const foundUser = await prisma.user.findFirst({ where: { refreshToken: refreshToken } });
        if (!foundUser) {
            throw new AppError('Invalid or Expired Refresh Token', 403);
        }
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err || foundUser.username !== decoded.user.username) {
                throw new AppError('Invalid or Expired Refresh Token', 403);
            }
            const accessToken = jwt.sign({
                user: {
                    id: foundUser.id,
                    username: foundUser.username,
                    email: foundUser.email
                },

            }, process.env.JWT_SECRET, { expiresIn: '30s' });
            res.json({ accessToken })
        })
}


module.exports = { login, register, logout, verifyJWT, handleRefreshToken }; 