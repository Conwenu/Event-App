// server/users/userController.js
const userService = require('./userService');
const {validateIntegerParameters, validateStringParameters} = require("../helpers/validateParameters")

const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    validateStringParameters({username, email, password}, res);
    try {
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const user = await userService.createUser({ username, email, password });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create user' });
    }
};

const getUser = async (req, res) => {
    const { id } = req.params;
    validateIntegerParameters({id}, res);
    try {
        const user = await userService.getUser(id);
        res.json(user);
    }
    catch(error)
    {
        res.status(400).json({ error: 'Failed to fetch user' });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json({users}); 
    } 
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch users' });
    }
}

const editUser = async (req, res) => {
    const { id } = req.params;
    const {username, email, password} = req.body;
    validateIntegerParameters({id}, res);
    validateStringParameters({username, email, password}, res);
    try {
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const user = await userService.editUser(id, {username, email, password})
        res.json(user)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    validateIntegerParameters({id}, res)
    try {
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        await userService.deleteUser(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete user' });
    }
};

module.exports = {
    createUser,
    getUser,
    getUsers,
    editUser,
    deleteUser
};
