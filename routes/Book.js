const { Router } = require("express");
const router = Router();
const { createBooking } = require("../controllers/book");
const { isAuth, isAdmin } = require("../middlewares/auth");
router.post("/book", isAuth, createBooking);
module.exports = router;