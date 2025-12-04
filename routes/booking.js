const { Router } = require("express");
const router = Router();
const {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    deleteBooking,
} = require("../controllers/booking");
const { isAuth, isAdmin } = require("../middlewares/auth");

// User create booking
router.post("/book", isAuth, createBooking);

// Admin routes - list & manage
router.get("/", isAuth, isAdmin, getBookings);
router.get("/:id", isAuth, isAdmin, getBooking);
router.put("/:id", isAuth, isAdmin, updateBooking);
router.delete("/:id", isAuth, isAdmin, deleteBooking);

// Optional admin create (accepts userId/roomId)
router.post("/admin-create", isAuth, isAdmin, createBooking);

module.exports = router;