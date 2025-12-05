const { default: mongoose } = require("mongoose");
const Room = require("../models/room");

const createRoom = async (req, res) => {
  try {
    let { roomNumber, price, amenities, roomType } = req.body;

    if (!price || !roomType) {
      return res.status(400).json({ message: "price and roomType are required" });
    }

    if (!roomNumber) {

      const agg = await Room.aggregate([
        {
          $addFields: {
            _rn: {
              $convert: {
                input: "$roomNumber",
                to: "int",
                onError: null,
                onNull: null,
              },
            },
          },
        },
        { $match: { _rn: { $ne: null } } },
        { $sort: { _rn: -1 } },
        { $limit: 1 },
      ]);

      if (agg && agg.length > 0 && typeof agg[0]._rn === "number") {
        roomNumber = String(agg[0]._rn + 1);
      } else {
        // fallback: استخدم جزء من الطابع الزمني لضمان فريدية مبدئية
        roomNumber = String(Date.now()).slice(-6);
      }

      // تأكد من التفريد — حاول زيادات صغيرة إذا كان في تعارض
      let attempts = 0;
      while (await Room.findOne({ roomNumber }) && attempts < 50) {
        // إذا صار تعارض زوّد بالرقم
        roomNumber = String(Number(roomNumber) + 1);
        attempts++;
      }
      if (attempts >= 50) {
        return res.status(500).json({ message: "Failed to generate unique roomNumber" });
      }
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

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id is required" });
    const room = await Room.findById(id, [
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

const restoreRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // set status to available (adjust if your app uses a different "deleted" flag)
    room.status = "available";
    await room.save();
    return res.status(200).json({ message: "Room restored", room });
  } catch (error) {
    return res.status(500).json({ message: "Error restoring room", error: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  getRoomById,
  updateRoom,
  restoreRoom,
};
