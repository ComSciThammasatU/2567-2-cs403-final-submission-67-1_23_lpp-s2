import mongoose from 'mongoose';
//answermodel
const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId, // อ้างอิงไปยัง questionSchema ใน eventSchema
        required: true,
    },
    answer: {
        type: mongoose.Schema.Types.Mixed, // เก็บคำตอบที่อาจเป็น string, array (เช่น multiple choice)
        required: true,
    },
});

export default answerSchema;