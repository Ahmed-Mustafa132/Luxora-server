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
} = require("../controllers/booking");
const { isAuth, isAdmin } = require("../middlewares/auth");

// public (authenticated) create booking
router.post("/book", isAuth, createBooking);

// get single booking (auth required)
// Admins can view any booking; you can allow owner access in controller
router.get("/:id", isAuth, getBooking);

// admin list/manage
router.get("/", isAuth, isAdmin, getBookings);
router.put("/:id", isAuth, isAdmin, updateBooking);
router.delete("/:id", isAuth, isAdmin, deleteBooking);

// cancel by owner or admin (controller should check)
router.put("/:id/cancel", isAuth, cancelBooking);

// room & user history
router.get("/room/:roomId", isAuth, isAdmin, getBookingsByRoom);
router.get("/user/:userId", isAuth, isAdmin, getBookingsByUser);

module.exports = router;