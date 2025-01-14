const authService = require('./authService');
const {
    validateIntegerParameters,
    validateStringParameters,
  } = require("../helpers/validateParameters");
const login = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        validateStringParameters({username, email, password}, res);
        const user = await authService.login({ username, email, password }, res);
        res.json(user);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await authService.register({ username, email, password})
        res.json({message: 'Registration successful. Please check your email for a verification message.'});
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

const logout = async (req, res) => {
    const cookies = req.cookies;
    try {
        await authService.logout(cookies, res);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const user = await authService.verifyToken(token); // Verify token using the service
        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).send(error.message); // Handle invalid or expired token
    }
};

// for access
const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    try {
        await authService.verifyJWT(req, authHeader);
        next();
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log('Refresh token');
    try {
        await authService.handleRefreshToken(cookies, res);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}



module.exports = {
    login,
    register,
    logout,
    authenticateJWT,
    verifyJWT,
    handleRefreshToken,
};