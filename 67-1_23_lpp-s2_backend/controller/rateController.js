import Rate from '../models/rateModel.js';
import Event from '../models/eventModel.js';
//rate controller
// เพิ่มรีวิวและคะแนน
export const addRating = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { username, rating, comment } = req.body;

        // 🐛 DEBUG
        console.log("🎯 Incoming rating request:");
        console.log("eventId:", eventId);
        console.log("username:", username);
        console.log("rating:", rating);
        console.log("comment:", comment);

        if (!username || !rating) {
            return res.status(400).json({ message: 'Missing required fields: username or rating' });
        }

        // ตรวจสอบว่า Event มีอยู่หรือไม่
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const existingRating = await Rate.findOne({ eventId, username });
        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this event' });
        }

        const newRating = new Rate({
            eventId,
            username,
            rating,
            comment,
        });

        await newRating.save();
        res.status(201).json({ message: 'Rating added successfully', rating: newRating });

    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงรีวิวทั้งหมดของ Event
export const getRatingsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const ratings = await Rate.find({ eventId });
        res.status(200).json({ ratings });

    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงรีวิวของผู้ใช้คนเดียวสำหรับ Event
export const getUserRatingForEvent = async (req, res) => {
    try {
      const { eventId, username } = req.params;
  
      const rating = await Rate.findOne({ eventId, username });
      if (!rating) {
        return res.status(404).json({ message: 'No rating found for this event by this user' });
      }
  
      res.status(200).json({ rating });
  
    } catch (error) {
      console.error('Error fetching user rating:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// ลบรีวิว
export const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;

        const deletedRating = await Rate.findByIdAndDelete(ratingId);
        if (!deletedRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        res.status(200).json({ message: 'Rating deleted successfully' });

    } catch (error) {
        console.error('Error deleting rating:', error);
        res.status(500).json({ message: 'Server error' });
    }
};