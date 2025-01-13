require('dotenv').config();
const express = require('express');
const path = require('path');
const eventRoutes = require('./events/eventRoutes');
const userRoutes = require('./users/userRoutes');
const reservationRoutes = require('./reservations/reservationRoutes');
const authRoutes = require('./auth/authRoutes');
const cookieParser =  require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(express.json({ limit: "1.3mb" }));
app.use(cors({origin : process.env.CLIENT_URL, method: ['GET', 'POST', 'PUT', 'DELETE'], credentials : true}));
app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/api', eventRoutes);
app.use('/api', userRoutes);
app.use('/api', reservationRoutes);
app.use('/auth', authRoutes);
app.use(cookieParser());
console.log(process.env.CLIENT_URL)
// const authenticate = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

//     if (!token) {
//         return res.status(401).send('Access denied. No token provided.');
//     }

//     try {
//         const decoded = verifyToken(token); // Verify the token
//         req.user = decoded; // Attach the user info to the request object
//         next(); // Proceed to the next middleware/route handler
//     } catch (error) {
//         return res.status(401).send(error.message);
//     }
// };

// // Protect a route with the authenticate middleware
// app.get('/protected', authenticate, (req, res) => {
//     res.send(`Hello ${req.user.username}, you are authenticated!`);
// });


const PORT = process.env.PORT || 5000;

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
