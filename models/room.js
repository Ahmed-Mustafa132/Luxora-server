const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "breakfast",
          "airConditioning",
          "tv",
          "minibar",
          "balcony",
        ],
        default: ["wifi", "airConditioning"],
      },
    ],
    roomType: {
      type: String,
      enum: ["single", "double", "suite", "deluxe"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
