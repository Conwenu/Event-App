require('dotenv').config();
const express = require('express');
const path = require('path');
const eventRoutes = require('./events/eventRoutes');
const userRoutes = require('./users/userRoutes');
const reservationRoutes = require('./reservations/reservationRoutes');
const authRoutes = require('./auth/authRoutes');
const { verifyJWT, credentials } = require('./auth/authController');
const cookieParser =  require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(express.json({ limit: "1.3mb" }));
app.use(credentials);
app.use(cors({origin : process.env.CLIENT_URL, method: ['GET', 'POST', 'PUT', 'DELETE'], credentials : true}));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cookieParser());
app.use('/api', eventRoutes);
app.use('/api', userRoutes);
app.use('/auth', authRoutes);
app.use(verifyJWT);
app.use('/api', reservationRoutes);


console.log(process.env.CLIENT_URL)

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
