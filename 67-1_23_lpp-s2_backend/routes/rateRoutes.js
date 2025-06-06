import express from 'express';
import {
  addRating,
  getRatingsByEvent,
  getUserRatingForEvent,
  deleteRating
} from '../controller/rateController.js';
import { auth } from '../middleware/auth.js';

const rateRoutes = express.Router();

rateRoutes.get('/test', (req, res) => {
    res.send('✅ rateRoutes working');
  });

// เพิ่มคะแนนและความคิดเห็น
rateRoutes.post('/:eventId/rate', auth, addRating);

// ดึงรีวิวทั้งหมดของ Event
rateRoutes.get('/:eventId/ratings', auth, getRatingsByEvent);

// ✅ แก้จาก :userId ➜ username และปรับ path เพื่อชัดเจน
rateRoutes.get('/:eventId/rating/username/:username', auth, getUserRatingForEvent);

// ลบรีวิว
rateRoutes.delete('/rating/:ratingId', auth, deleteRating);

export default rateRoutes;