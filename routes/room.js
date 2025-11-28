const { Router } = require("express");
const router = Router();
const { createRoom, getRoom } = require("../controllers/room");
const { isAuth, isAdmin } = require("../middlewares/auth");

router.post("/creatRoom", isAdmin, createRoom);
router.get("/room/:roomNumber", getRoom);
module.exports = router;