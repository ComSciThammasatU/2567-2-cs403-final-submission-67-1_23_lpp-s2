import mongoose from 'mongoose';
//questionModel
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        enum: ['text', 'multipleChoice', 'checkbox', 'dropdown'], // ประเภทของคำถาม
        required: true,
    },
    options: {
        type: [String], // ตัวเลือกสำหรับคำถาม (เฉพาะสำหรับ multipleChoice, checkbox, dropdown)
        default: [],
    },
    required: {
        type: Boolean,
        default: false, // ระบุว่าคำถามนี้จำเป็นต้องตอบหรือไม่
    },
});

export default questionSchema;