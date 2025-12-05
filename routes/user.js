const { Router } = require("express");
const {
  register,
  login,
  getAllUsers,
  getCorrentUser,
  deleteUserById,
  updateCorrentUser,
  getUserById,
  updateUserRole
} = require("../controllers/user");
const { isAuth, isAdmin } = require("../middlewares/auth");
const router = Router();

// user routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuth, getCorrentUser);
router.put("/me", isAuth, updateCorrentUser);

router.get("/:id", isAdmin, getUserById);
router.put("/:id/role", isAdmin, updateUserRole);
router.delete("/:id", isAdmin, deleteUserById);

router.get("/", isAdmin, getAllUsers);
module.exports = router;
