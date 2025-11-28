const Room = require("../models/room");
const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      price,
      amenities,
      roomType,


    } = req.body;
    if (
      !roomNumber ||
      !price ||
      !roomType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newRoom = new Room({
      roomNumber,
      price,
      amenities,
      roomType,
    });

    await newRoom.save();
    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating room", error: error.message });
  }
};
const getRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    if (!roomNumber) res.status(400).json({ message: "room id is required" });
    const room = await Room.find({ roomNumber: roomNumber }, [
      "roomNumber",
      "price",
      "amenities",
      "roomType",
      "status",
      "rating",
    ]);
    if (!room) res.status(404).json({ message: "Room not found" });
    res.status(200).json({ room });
  } catch (error) {
    console.log("error fetching rooms", error);
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: error.message });
  }
};
// update room details
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      roomNumber,
      description,
      images,
      price,
      amenities,
      roomType,
      roomSize,
      maxOccupancy,
      status,
    } = req.body;
    if (
      !roomNumber ||
      !description ||
      !images ||
      !price ||
      !roomType ||
      !roomSize ||
      !maxOccupancy ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const room = await Room.findByIdAndUpdate(
      { id },
      {
        roomNumber,
        description,
        images,
        price,
        amenities,
        roomType,
        roomSize,
        maxOccupancy,
        status,
      }
    );
  } catch (error) {
    console.log("error updating room", error);
    res
      .status(500)
      .json({ message: "Error updating room", error: error.message });
  }
};

module.exports = {
  createRoom,
  getRoom,
};
