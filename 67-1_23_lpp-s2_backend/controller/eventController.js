import Event from '../models/eventModel.js';
import mongoose from 'mongoose';
//event controller
export const addEvent = async (req, res) => {
    try {
        const {
            eventName,
            category,
            eventDescription,
            eventDate,
            location,
            organizer,
            maxRegistrants,
            facultyAccepted,
            creatorUsername,
            status // เพิ่ม status
        } = req.body;

        // แปลง formQuestions จาก JSON String เป็น Object
        const formQuestions = JSON.parse(req.body.formQuestions || '[]');
        const image = req.file?.filename;
        const maxParticipants = Number(req.body.maxRegistrants) || 100;

        if (!eventName || !eventDate || !location || !organizer || !creatorUsername) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const newEvent = new Event({
            eventName,
            category,
            eventDescription,
            eventDate,
            location,
            organizer,
            maxParticipants: maxParticipants,
            facultyAccepted: JSON.parse(facultyAccepted || '[]'),
            creatorUsername,
            formQuestions,
            image,
            status: status || 'pending' // ค่าเริ่มต้นเป็น "pending"
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



// Function to get all events
export const getAllEvent = async (req, res) => {
    try {
        const events = await Event.find();
        if (events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        // ตรวจสอบว่า Event มีอยู่หรือไม่
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // ลบ Event
        await Event.findByIdAndDelete(eventId);

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        // รับค่าจาก body
        const {
            eventName,
            category,
            eventDescription,
            eventDate,
            location,
            organizer,
            maxRegistrants,
            facultyAccepted,
            evaluationFormUrl,
            status // เพิ่ม status
        } = req.body;

        // แปลง formQuestions จาก JSON String เป็น Object
        const formQuestions = req.body.formQuestions ? JSON.parse(req.body.formQuestions) : undefined;

        // อัปเดตรูปภาพหากมีการอัปโหลดใหม่
        const image = req.file?.filename;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }

        // ตรวจสอบว่าสถานะที่ส่งมาอยู่ใน enum หรือไม่
        const validStatuses = ['pending', 'active', 'completed', 'canceled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // เตรียมค่าที่จะอัปเดต
        const updates = {};
        if (eventName) updates.eventName = eventName;
        if (category) updates.category = category;
        if (eventDescription) updates.eventDescription = eventDescription;
        if (eventDate) updates.eventDate = eventDate;
        if (location) updates.location = location;
        if (organizer) updates.organizer = organizer;
        if (evaluationFormUrl) updates.evaluationFormUrl = evaluationFormUrl;
        if (maxRegistrants) updates.maxParticipants = maxRegistrants;
        if (facultyAccepted) updates.facultyAccepted = JSON.parse(facultyAccepted);
        if (formQuestions) updates.formQuestions = formQuestions;
        if (image) updates.image = image;
        if (status) updates.status = status; // เพิ่มการอัปเดต status

        // อัปเดตข้อมูลใน MongoDB
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getEventById = async (req, res) => {
    try {
      const { eventId } = req.params;
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  

export const getEventByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const events = await Event.find({ creatorUsername: username });

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found for this user' });
        }

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};