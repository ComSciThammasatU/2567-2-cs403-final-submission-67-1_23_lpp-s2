import mongoose from "mongoose";
//rate Model
const rateSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Rate = mongoose.model('Rate', rateSchema);
export default Rate;