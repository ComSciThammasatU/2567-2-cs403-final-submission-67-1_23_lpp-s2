import mongoose from 'mongoose';
import questionSchema from './questionModel.js';
//eventModel
// Schema สำหรับ Event
const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
     //รูปภาพ
     image : { 
        type: String, 
        default: null
    },
    // ประเภทของEvent (concert, seminar, exhibition, sport, party, charity, workshop)
    category: {
        type: String,
        Enum : ['Concert', 'Seminar', 'Exhibition', 'Sport', 'Party', 'Charity', 'Workshop'],
        default: '',
    },
    // รายละเอียดของEvent
    eventDescription: {
        type: String,
        default: '',
    },
    // วันที่เริ่มEvent
    eventDate: {
        type: Date,
        required: true,
    },
    // สถานที่จัดEvent
    location: {
        type: String,
        required: true,
    },
    //ผู้จัด
    organizer: {
        type: String,
        required: true,
    },
    // เก็บฟอร์มคำถามที่ผู้จัดอีเวนต์สร้าง
    formQuestions: [questionSchema], 
    // จำนวนสูงสุดของผู้ลงทะเบียน
    maxParticipants: {
        type: Number,
        default: 100, 
    },
    // คณะที่เปิดรับผู้ลงทะเบียน
    facultyAccepted: {
        type: [String], 
        default: [], 
    },
    // ผู้สร้าง event
    creatorUsername: {
        type: String,
        required: true, 
    },
    // สถานะของ Event
    status: { 
        type: String, 
        enum: ['active', 'completed', 'canceled'], 
        default: 'active'  
    },evaluationFormUrl: {
        type: String,
        default: '',
      },
    // วันที่สร้างEvent
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;