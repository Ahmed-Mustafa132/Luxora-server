const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    maxOccupancy: {
        type: Number,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["booked", "checked-in", "checked-out", "cancelled"],
        default: "booked"
    }
}, { timestamps: true })
module.exports = mongoose.model("Book", bookSchema)
