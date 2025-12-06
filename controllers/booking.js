const Book = require("../models/booking");
const Room = require("../models/room");
const User = require("../models/user");
const mongoose = require("mongoose");

const createBooking = async (req, res) => {
    try {
        const user = req.user;
        const { checkIn, checkOut, guests } = req.body;
        if (!checkIn || !checkOut || !guests) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (guests <= 0 || guests > 3) {
            return res.status(400).json({ message: "Guests must be at least 1" });
        }
        if (new Date(checkIn) >= new Date(checkOut)) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }
        if (new Date(checkIn) <= new Date()) {
            return res.status(400).json({ message: "Check-in date must be in the future" });
        }

        const roomType = guests <= 1 ? "single" : guests == 2 ? "double" : guests == 3 ? "suite" : "deluxe";

        // If admin provides roomId or userId (admin route may use different fields)
        let roomQuery = { roomType: roomType, status: "available" };
        if (req.body.roomId) roomQuery = { _id: mongoose.Types.ObjectId(req.body.roomId) };

        const availableRoom = await Room.findOne(roomQuery);
        if (!availableRoom) {
            return res.status(404).json({ message: "No available rooms of the selected type" });
        }

        const bookingUserId = req.body.userId ? req.body.userId : user?._id;
        const newBooking = new Book({
            user: bookingUserId,
            room: availableRoom._id,
            checkIn,
            checkOut,
            maxOccupancy: guests,
            status: req.body.status || "booked"
        });
        await newBooking.save();

        // Update room status to booked
        availableRoom.status = "booked";
        await availableRoom.save();

        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.log("error in book controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.userId) filter.user = req.query.userId;
        if (req.query.q) {
            const q = req.query.q;
            // search by room number or user email fallback
            const rooms = await Room.find({ roomNumber: { $regex: q, $options: "i" } }).select("_id");
            filter.$or = [{ room: { $in: rooms.map(r => r._id) } }];
        }

        const [total, docs] = await Promise.all([
            Book.countDocuments(filter),
            Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "name email").populate("room", "roomNumber roomType price status")
        ]);
        res.status(200).json({ total, data: docs, page, limit });
    } catch (error) {
        console.error("getBookings error", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getBooking = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "id is required" });
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const booking = await Book.findById(id)
            .populate("user", "name email role")
            .populate("room", "roomNumber roomType price status amenities");

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // If your logic should allow users to fetch only their bookings:
        // const requester = req.user;
        // if (requester?.role !== "admin" && String(booking.user._id) !== String(requester._id)) {
        //   return res.status(403).json({ message: "Forbidden" });
        // }

        return res.status(200).json({ data: booking });
    } catch (error) {
        console.error("getBooking error", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        const booking = await Book.findById(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // if room change, update old room status and new room status
        if (payload.roomId && String(payload.roomId) !== String(booking.room)) {
            const newRoom = await Room.findById(payload.roomId);
            if (!newRoom || newRoom.status !== "available") {
                return res.status(400).json({ message: "Target room not available" });
            }
            const oldRoom = await Room.findById(booking.room);
            if (oldRoom) { oldRoom.status = "available"; await oldRoom.save(); }
            newRoom.status = "booked"; await newRoom.save();
            booking.room = newRoom._id;
        }

        if (payload.status) booking.status = payload.status;
        if (payload.checkIn) booking.checkIn = payload.checkIn;
        if (payload.checkOut) booking.checkOut = payload.checkOut;
        if (payload.maxOccupancy) booking.maxOccupancy = payload.maxOccupancy;

        await booking.save();
        res.status(200).json({ message: "Booking updated", booking });
    } catch (error) {
        console.error("updateBooking error", error);
        res.status(500).json({ message: "Server error" });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const requester = req.user;
        if (!id) return res.status(400).json({ message: "id is required" });

        const booking = await Book.findById(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // allow owner or admin to cancel
        if (!(requester && (requester.role === "admin" || String(requester._id) === String(booking.user)))) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (booking.status === "cancelled") {
            return res.status(200).json({ message: "Booking already cancelled", booking });
        }

        booking.status = "cancelled";
        await booking.save();

        // free up room if exists
        if (booking.room) {
            const room = await Room.findById(booking.room);
            if (room) {
                room.status = "available";
                await room.save();
            }
        }

        return res.status(200).json({ message: "Booking cancelled", booking });
    } catch (error) {
        console.error("cancelBooking error", error);
        res.status(500).json({ message: "Server error" });
    }
};

// keep admin delete (hard delete)
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Book.findById(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const room = await Room.findById(booking.room);
        if (room) { room.status = "available"; await room.save(); }
        await booking.remove();

        res.status(200).json({ message: "Booking deleted" });
    } catch (error) {
        console.error("deleteBooking error", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getBookingsByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!roomId) return res.status(400).json({ message: "roomId is required" });

        // validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ message: "Invalid roomId" });
        }

        // optional query params
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const filter = { room: roomId };
        if (req.query.status) filter.status = req.query.status;

        const [total, docs] = await Promise.all([
            Book.countDocuments(filter),
            Book.find(filter,)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("room", "roomNumber roomType price status")
                .populate("user", "name email")
        ]);
        console.log(docs)

        return res.status(200).json({ total, page, limit, data: docs });
    } catch (error) {
        console.error("getBookingsByRoom error", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "userId is required" });
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;

        const filter = { user: userId };
        if (req.query.status) filter.status = req.query.status;

        const [total, docs] = await Promise.all([
            Book.countDocuments(filter),
            Book.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("user", "name email")
                .populate("room", "roomNumber roomType price status")
        ]);

        return res.status(200).json({ total, page, limit, data: docs });
    } catch (error) {
        console.error("getBookingsByUser error", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(400).json({ message: "User not found" });

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;

        const [total, docs] = await Promise.all([
            Book.countDocuments({ user: userId }),
            Book.find({ user: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("room", "roomNumber roomType price status")
        ]);

        return res.status(200).json({ total, page, limit, data: docs });
    } catch (error) {
        console.error("getMyBookings error", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
    getBookingsByRoom,
    getBookingsByUser,
    getMyBookings
};