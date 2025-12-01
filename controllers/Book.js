const book = require("../models/book")
const Room = require("../models/room")

const createBooking = async (req, res) => {
    try {
        const user = req.user
        const { checkIn, checkOut, guests } = req.body
        // validator check for required fields
        if (!checkIn || !checkOut || !guests) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (guests <= 0 || guests > 3) {
            return res.status(400).json({ message: "Guests must be at least 1" })
        }
        if (new Date(checkIn) >= new Date(checkOut)) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" })
        }
        if (new Date(checkIn) <= new Date()) {
            return res.status(400).json({ message: "Check-in date must be in the future" })
        }
        // Check room availability
        const roomType = guests <= 1 ? "single" : guests == 2 ? "double" : guests == 3 ? "suite" : "deluxe";
        console.log("roomType:", roomType)
        const availableRoom = await Room.findOne({
            roomType: roomType,
            status: "available"
        })
        if (!availableRoom) {
            return res.status(404).json({ message: "No available rooms of the selected type" })
        }
        // Create a new booking
        const newBooking = new book({
            user: user._id,
            room: availableRoom._id,
            maxOccupancy: guests
        })
        await newBooking.save()
        // Update room status to booked
        availableRoom.status = "booked"
        await availableRoom.save()

        res.status(201).json({ message: "Booking created successfully", booking: newBooking })
    } catch (error) {
        console.log("error in book controller:", error)
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = {
    createBooking
}