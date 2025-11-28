const { Router } = require("express");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} = require("../controllers/user");
const { isAuth, isAdmin } = require("../middlewares/auth");
const router = Router();

// user routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuth, getUserById);
router.put("/me", isAuth, updateUserById);
router.get("/", isAdmin, getAllUsers);
router.delete("/:id", isAdmin, deleteUserById);
module.exports = router;
