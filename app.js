const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
dotenv.config();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}

));

app.use(express.json());


// import routes
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book')
const roomRoutes = require('./routes/room')


app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes)
app.use('/api/room', roomRoutes)

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT || 3000}`);
})