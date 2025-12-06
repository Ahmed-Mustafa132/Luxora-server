const { Router } = require("express");
const router = Router();
const {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    deleteBooking,
    cancelBooking,
    getBookingsByRoom,
    getBookingsByUser,
    getMyBookings,
} = require("../controllers/booking");
const { isAuth, isAdmin } = require("../middlewares/auth");

router.post("/book", isAuth, createBooking);
router.get("/my", isAuth, getMyBookings);
router.get("/:id", isAuth, getBooking);
router.get("/", isAuth, isAdmin, getBookings);
router.put("/:id", isAuth, isAdmin, updateBooking);
router.delete("/:id", isAuth, isAdmin, deleteBooking);
router.put("/:id/cancel", isAuth, cancelBooking);
router.get("/room/:roomId", isAuth, isAdmin, getBookingsByRoom);
router.get("/user/:userId", isAuth, isAdmin, getBookingsByUser);

module.exports = router;