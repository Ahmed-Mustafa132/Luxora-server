const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const  app = express();
dotenv.config();
app.use(cors());

app.use(express.json());


// import routes
const userRoutes = require('./routes/user');

app.use('/api/users', userRoutes);

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.listen(process.env.PORT || 3000, () => { 
    console.log(`Server is running on port ${process.env.PORT}`);
})