const { Router } = require("express");
const router = Router();
const {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    deleteBooking,
    getBookingsByRoom,
    getBookingsByUser
} = require("../controllers/booking");
const { isAuth, isAdmin } = require("../middlewares/auth");

router.post("/booking", isAuth, createBooking);
router.get("/", isAuth, isAdmin, getBookings);
router.get("/:id", isAuth, isAdmin, getBooking);
router.put("/:id", isAuth, isAdmin, updateBooking);
router.delete("/:id", isAuth, isAdmin, deleteBooking);
router.get("/room/:roomId", isAuth, isAdmin, getBookingsByRoom);
router.get("/user/:userId", isAuth, isAdmin, getBookingsByUser);

module.exports = router;