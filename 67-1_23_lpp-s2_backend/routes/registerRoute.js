import express from 'express';
import { register } from '../controller/registerController.js';
import { getAllRegister } from '../controller/registerController.js';
import { scanTicket } from '../controller/registerController.js';
import { checkRegisterStatus } from '../controller/registerController.js';
import { auth } from '../middleware/auth.js';
import { markTicketAsUsed } from '../controller/registerController.js';
import { getRegisteredEvents } from '../controller/registerController.js';
import { verifyTicket } from '../controller/registerController.js';
import { getTicketIdForEvent } from '../controller/registerController.js';
import { activateTicket, deactivateTicket } from '../controller/registerController.js';
import { getRegistrationsByEventId } from '../controller/registerController.js';


//regis route
const regisRouter = express.Router();  // Use regisRouter, not router

// Route for regis an event (protected by the auth middleware)
regisRouter.post('/register', auth, register);  // Use regisRouter here

// Route for getting all register (protected by the auth middleware)
regisRouter.get('/registrations', auth, getAllRegister);  // Use regisRouter here

// Endpoint สำหรับสแกน QR เพื่อตรวจ ticket
regisRouter.post('/scan-ticket', auth, scanTicket);

regisRouter.get('/check', auth, checkRegisterStatus);

// Add the route for marking ticket as used
regisRouter.put('/mark-ticket-used', markTicketAsUsed);  // Use regisRouter here

regisRouter.get('/registered-events/:username', auth, getRegisteredEvents);

// เพิ่ม route สำหรับตรวจสอบ ticket
regisRouter.post('/verify-ticket', verifyTicket);  // ใช้ post request เพื่อตรวจสอบ ticket

// เพิ่ม route สำหรับดึง ticketId ของกิจกรรมที่เลือก
regisRouter.get('/get-ticket-id/:username/:eventId', getTicketIdForEvent);

regisRouter.put('/activate-ticket', activateTicket);

regisRouter.put('/deactivate-ticket', deactivateTicket);


regisRouter.get('/by-event/:eventId', auth, getRegistrationsByEventId);


export default regisRouter;  // Export regisRouter