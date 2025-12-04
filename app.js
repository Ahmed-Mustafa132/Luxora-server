const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/room", require("./routes/room"));
app.use("/api/user", require("./routes/user"));
app.use("/api/book", require("./routes/book"));

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;