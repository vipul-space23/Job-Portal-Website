// src/index.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/authRoute.js';
import companyRoute from './routes/compRoute.js';
import jobRoute from './routes/jobRoute.js';
import applicationRoute from './routes/appRoute.js';
import emailRoute from './routes/emailRoute.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/email", emailRoute); // Use your email route

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
