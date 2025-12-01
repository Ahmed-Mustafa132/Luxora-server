const { Router } = require("express");
const {
  register,
  login,
  getAllUsers,
  getCorrentUser,
  deleteUserById,
  updateCorrentUser, getUserById
} = require("../controllers/user");
const { isAuth, isAdmin } = require("../middlewares/auth");
const router = Router();

// user routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuth, getCorrentUser);
router.put("/me", isAuth, updateCorrentUser);
router.get("/user/:id", isAdmin, getUserById)
router.get("/", isAdmin, getAllUsers);
router.delete("/:id", isAdmin, deleteUserById);
module.exports = router;
