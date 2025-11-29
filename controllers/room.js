const { default: mongoose } = require("mongoose");
const Room = require("../models/room");

const createRoom = async (req, res) => {
  try {
    const { roomNumber, price, amenities, roomType } = req.body;
    if (!roomNumber || !price || !roomType) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newRoom = new Room({ roomNumber, price, amenities, roomType });
    await newRoom.save();
    return res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    return res.status(500).json({ message: "Error creating room", error: error.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    if (!roomNumber) return res.status(400).json({ message: "room number is required" });
    const room = await Room.findOne({ roomNumber }, [
      "roomNumber",
      "price",
      "amenities",
      "roomType",
      "status",
      "rating",
    ]);
    if (!room) return res.status(404).json({ message: "Room not found" });
    return res.status(200).json({ room });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching room", error: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const rooms = await Room.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalRooms = await Room.countDocuments();

    return res.status(200).json({
      message: "Rooms fetched successfully",
      totalRooms,
      data: rooms,
      page,
      limit,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await Room.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: "Room not found" });
    return res.status(200).json({ message: "Room updated", room: updated });
  } catch (error) {
    return res.status(500).json({ message: "Error updating room", error: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
};
