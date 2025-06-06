// server.js
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter  from './routes/userRoutes.js'; 
import eventRouter from './routes/eventRoute.js';
import regisRouter from './routes/registerRoute.js';
import rateRoutes from './routes/rateRoutes.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database Connection
connectDB();

// เส้นทางทดสอบ
app.get('/', (req, res) => {
    res.send('API WORKING!');
});

// ใช้ Router
app.use('/api/users', userRouter); // User
app.use('/api/events', eventRouter); // Event
app.use('/api/registers', regisRouter); // Regis
app.use('/api/rates', rateRoutes);// Rate
app.use('/images',express.static('uploads')) // Images

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
