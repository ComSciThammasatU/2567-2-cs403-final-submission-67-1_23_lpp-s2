import express from 'express';
import multer from 'multer';
import { addEvent, getAllEvent , deleteEvent, updateEvent} from '../controller/eventController.js';
import { getEventById , getEventByUsername } from '../controller/eventController.js';
import { auth } from '../middleware/auth.js'; // This should work now

//event route
const eventRouter = express.Router();  // Use the correct router object

// Set up image upload storage configuration
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        // Make sure to fix the filename format to avoid errors
        return cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Route for adding an event (protected by the auth middleware)
eventRouter.post('/add', auth, upload.single('image'), addEvent);

// Route for getting all events 
eventRouter.get('/events', getAllEvent)

// Route for delete event (protected by the auth middleware)
eventRouter.delete('/delete/:eventId', auth, deleteEvent)

// Route for update event (protected by the auth middleware)
eventRouter.put('/update/:eventId', auth, upload.single('image'), updateEvent);

eventRouter.get('/event/:eventId', getEventById);

eventRouter.get('/user/:username', auth, getEventByUsername);


export default eventRouter;
