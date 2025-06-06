import Register from '../models/registerModel.js';
import Event from '../models/eventModel.js';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import User from '../models/userModel.js';

export const generateQrCode = async (ticketID) => {
  try {
    const qrCode = await QRCode.toDataURL(ticketID); // สร้าง QR Code จาก ticketID
    return qrCode;
  } catch (error) {
    console.error("Error generating QR Code:", error);
  }
};

export const register = async (req, res) => {
  try {
    const { username, eventId, answers } = req.body;

    if (!username || !eventId || !answers) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้ รหัสกิจกรรม และคำตอบให้ครบถ้วน' });
    }

    let parsedAnswers;
    try {
      parsedAnswers = typeof answers === 'string' ? JSON.parse(answers) : answers;
    } catch (err) {
      return res.status(400).json({ error: 'รูปแบบคำตอบไม่ถูกต้อง (JSON ไม่สมบูรณ์)' });
    }

    if (!Array.isArray(parsedAnswers)) {
      return res.status(400).json({ error: 'คำตอบต้องอยู่ในรูปแบบของ Array' });
    }

    const formattedAnswers = parsedAnswers.map(ans => ({
      questionId: new mongoose.Types.ObjectId(ans.questionId),
      answer: ans.answer,
    }));

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'ไม่พบกิจกรรมที่เลือก' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้งาน' });
    }

    const userFaculty = user.faculty;
    const userOrganization = user.organization;
    const isOrganization = event.facultyAccepted.includes(userOrganization);
    const isFacultyAccepted = event.facultyAccepted.includes(userFaculty);

    if (!isFacultyAccepted & !isOrganization) {
      return res.status(403).json({ error: 'คณะของคุณไม่ได้รับอนุญาตให้เข้าร่วมกิจกรรมนี้' });
    }

    if (event.maxRegistrants <= 0) {
      return res.status(400).json({ error: 'จำนวนผู้เข้าร่วมกิจกรรมครบแล้ว' });
    }

    const existingRegistration = await Register.findOne({ eventId, username });
    if (existingRegistration) {
      return res.status(400).json({ error: 'คุณได้ลงทะเบียนกิจกรรมนี้แล้ว' });
    }

    const newRegister = new Register({
      eventId,
      username,
      answers: formattedAnswers,
    });

    await newRegister.save();

    event.maxRegistrants -= 1;
    await event.save();

    return res.status(201).json({ message: 'ลงทะเบียนสำเร็จ', register: newRegister });

  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการลงทะเบียนกิจกรรม:', error);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง' });
  }
};




export const getAllRegister = async (req, res) => {
    try {
        const { eventId } = req.body; // Event ID should be passed as a query parameter

        // Check if eventId is provided
        if (!eventId) {
            return res.status(400).json({ error: 'Event ID is required' });
        }

        // Get all registrations for the event
        const registrations = await Register.find({ eventId })
            .populate('eventId', 'eventName') // Populate event details (optional)
            .populate('username', 'displayname_th displayname_en') // Populate user details (optional)
            .exec();
        // Check if registration
        if (registrations.length === 0) {
            return res.status(404).json({ message: 'No registrations found for this event' });
        }

        return res.status(200).json(registrations);
    } catch (err) {
        console.error('Error fetching registrations:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const scanTicket = async (req, res) => {
    try {
        const { ticketID } = req.body;

        if (!ticketID) {
            return res.status(400).json({ error: 'ticketID is required' });
        }

        const ticket = await Register.findOne({ ticketID });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (ticket.ticketStatus === 'used') {
          return res.status(400).json({ error: '[บัตรนี้ถูกใช้งานแล้ว]' });
        }

        ticket.ticketStatus = 'used';
        await ticket.save();

        return res.status(200).json({ message: 'Ticket verified successfully', ticket });
    } catch (error) {
        console.error('Error scanning ticket:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
export const checkRegisterStatus = async (req, res) => {
    try {
      const { eventId, username } = req.query;
  
      if (!eventId || !username) {
        return res.status(400).json({ error: "Missing eventId or username" });
      }
  
      const registration = await Register.findOne({ eventId, username });
  
      res.status(200).json({ registered: !!registration });
    } catch (error) {
      console.error("Error checking registration status:", error);
      res.status(500).json({ error: "Server error" });
    }
  };


export const markTicketAsUsed = async (req, res) => {
    try {
      const { ticketID } = req.body;
  
      if (!ticketID) {
        return res.status(400).json({ error: 'ticketID is required' });
      }
  
      const ticket = await Register.findOne({ ticketID });
  
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
  
      if (ticket.ticketStatus === 'used') {
        return res.status(400).json({ error: '[บัตรนี้ถูกใช้งานแล้ว]' });
      }
  
      // เปลี่ยนสถานะบัตรเป็น used
      ticket.ticketStatus = 'used';
      await ticket.save();
  
      res.status(200).json({ message: 'Ticket status updated to used' });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  // Function to get events that a user has registered for
export const getRegisteredEvents = async (req, res) => {
    try {
        const { username } = req.params;

        // ค้นหาผู้ลงทะเบียนจากฐานข้อมูล โดยเชื่อมโยงกับ eventId
        const registrations = await Register.find({ username })
            .populate('eventId') // populate ข้อมูล event ที่เกี่ยวข้อง
            .exec();

        if (!registrations.length) {
            return res.status(404).json({ message: 'ไม่พบกิจกรรมที่ลงทะเบียน' });
        }

        // ส่งข้อมูลกิจกรรมที่ผู้ใช้ลงทะเบียน
        res.status(200).json(registrations);
    } catch (error) {
        console.error('Error fetching registered events:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
};


// ฟังก์ชันสำหรับตรวจสอบ ticket
export const verifyTicket = async (req, res) => {
  try {
    const { ticketID } = req.body;  // รับ ticketId จาก body

    if (!ticketID) {
      return res.status(400).json({ error: 'Ticket ID is required' });
    }

    // ค้นหา ticket ในฐานข้อมูล
    const ticket = await Register.findOne({ ticketID });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // ตรวจสอบสถานะของ ticket
    if (ticket.ticketStatus === 'used') {
      return res.status(400).json({ error: 'บัตรนี้ถูกใช้งานแล้ว' });
    }

    // ส่งผลลัพธ์เมื่อบัตรถูกต้อง
    res.status(200).json({ message: 'Ticket is valid', ticket });
  } catch (error) {
    console.error('Error verifying ticket:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ฟังก์ชันที่ใช้ดึง ticketId จาก backend
export const getTicketIdForEvent = async (req, res) => {
    try {
      const { username, eventId } = req.params;  // รับค่าจาก URL
      console.log("Received username:", username);  // แสดงค่าใน console
      console.log("Received eventId:", eventId);    // แสดงค่าใน console
  
      const registration = await Register.findOne({
        username,
        eventId,
      });
  
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found for this event' });
      }
  
      res.status(200).json({ ticketId: registration.ticketID });  // ส่ง ticketId กลับ
    } catch (error) {
      console.error('Error fetching ticketId:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // เปลี่ยนสถานะบัตรเป็น active
export const activateTicket = async (req, res) => {
    try {
      const { ticketID } = req.body;
  
      if (!ticketID) {
        return res.status(400).json({ error: 'ticketID is required' });
      }
  
      const ticket = await Register.findOne({ ticketID });
  
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
  
      ticket.ticketStatus = 'active';
      await ticket.save();
  
      res.status(200).json({ message: 'Ticket activated', ticketStatus: ticket.ticketStatus });
    } catch (error) {
      console.error('Error activating ticket:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // เปลี่ยนสถานะบัตรเป็น inactive
  export const deactivateTicket = async (req, res) => { 
    try {
      const { ticketID } = req.body;
  
      if (!ticketID) {
        return res.status(400).json({ error: 'ticketID is required' });
      }
  
      const ticket = await Register.findOne({ ticketID });
  
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
  
      if (ticket.ticketStatus === 'used') {
        return res.status(400).json({ error: 'Cannot deactivate a used ticket' });
      }
  
      ticket.ticketStatus = 'inactive';
      await ticket.save();
  
      res.status(200).json({ message: 'Ticket deactivated', ticketStatus: ticket.ticketStatus });
    } catch (error) {
      console.error('Error deactivating ticket:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

  
  // เพิ่มฟังก์ชัน getRegistrationsByEventId
  export const getRegistrationsByEventId = async (req, res) => {
    try {
      const { eventId } = req.params;
  
      if (!eventId) {
        return res.status(400).json({ error: 'Missing eventId' });
      }
  
      const registrations = await Register.aggregate([
        {
          $match: { eventId: eventId }
        },
        {
          $lookup: {
            from: 'users',              // 👈 collection name ต้องเป็น "users"
            localField: 'username',     // field ใน Register
            foreignField: 'username',   // field ใน User
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true  // เพื่อให้แสดงผลแม้ไม่มีข้อมูล user
          }
        }
      ]);
  
      res.status(200).json(registrations);
    } catch (error) {
      console.error('Error fetching registrations by eventId:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  