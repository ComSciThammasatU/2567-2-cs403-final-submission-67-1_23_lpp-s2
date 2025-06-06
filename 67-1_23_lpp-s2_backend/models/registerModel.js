import mongoose from 'mongoose';
import answerSchema from './answerModel.js';
//regismodel

const registerSchema = new mongoose.Schema({
    // EventId ที่ต้องการลงทะเบียน
    eventId: {
        type: String,
        required: true,
    },
    // ชื่อผู้ใช้งานที่ลงทะเบียน
    username: {
        type: String,
        required: true,
    },
    // ตั๋วเข้างาน (ตัวนี้นำไปทำคิวอา)
    ticketID: {
        type: String,
        required: true,
        unique: true,  // กำหนดให้เป็น unique เพื่อป้องกันการซ้ำ
    },
    // สถานะของตั๋วเข้างาน เช่น 'inactive', 'active', 'used'
    ticketStatus: {
        type: String,
        enum: ['inactive', 'active', 'used'], // สถานะของตั๋ว
        default: 'inactive',
    },
    // เก็บคำตอบที่ผู้ลงทะเบียนตอบคำถาม
    answers: [answerSchema], 
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook เพื่อสร้าง ticketID ก่อนบันทึก
registerSchema.pre('validate', function(next) {
    if (this.eventId && this.username) {
        this.ticketID = `${this.eventId.toString()}-${this.username}`;
    }
    next();
});


const Register = mongoose.model('Register', registerSchema);

export default Register;
