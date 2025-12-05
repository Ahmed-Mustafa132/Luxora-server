const { Router } = require("express");
const router = Router();
const { createRoom, getRoom, getRooms, updateRoom, getRoomById, restoreRoom } = require("../controllers/room");
const { isAuth, isAdmin } = require("../middlewares/auth");

// Use clearer standard routes
router.post("/create", isAdmin, createRoom);      // POST /api/room/create
router.get("/", isAdmin, getRooms);               // GET  /api/room?page=1&limit=10
router.get("/:roomNumber", getRoom);              // GET  /api/room/:roomNumber
router.put("/:id", isAdmin, updateRoom);          // PUT  /api/room/:id

// Admin: fetch room by id
router.get("/id/:id", isAdmin, getRoomById);

// Admin: restore deleted/removed room
router.post("/:id/restore", isAdmin, restoreRoom);

module.exports = router;