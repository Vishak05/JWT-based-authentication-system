const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL, // Frontend URL (like http://localhost:3000)
    credentials: true, // Allow cookies to be sent with requests
}));

app.use('/api/auth', authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
