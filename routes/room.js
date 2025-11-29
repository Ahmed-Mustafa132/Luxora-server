const { Router } = require("express");
const router = Router();
const { createRoom, getRoom, getRooms, updateRoom } = require("../controllers/room");
const { isAuth, isAdmin } = require("../middlewares/auth");

// Use clearer standard routes
router.post("/create", isAdmin, createRoom);      // POST /api/room/create
router.get("/", isAdmin, getRooms);               // GET  /api/room?page=1&limit=10
router.get("/:roomNumber", getRoom);              // GET  /api/room/:roomNumber
router.put("/:id", isAdmin, updateRoom);          // PUT  /api/room/:id
module.exports = router;