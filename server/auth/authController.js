const authService = require('./authService');

const login = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        if (!username || !email) {
            return res.status(400).json({ error: 'Username or Email is required' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        validateStringParameters({username, email, password}, res);
        await authService.login({ username, email, password });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to login' });
    }
};

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

module.exports = {
    login,
    authenticateJWT
};