const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Check if user already exists
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );
    res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
// ger all Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, ["name", "email", "role"]);
    res.status(200).json({ message: "Get all users success", users });
  } catch (error) {
    console.log("errer get all users", error);
    res.status(500).json({ message: "Server error" });
  }
};
// get user by  id
const getUserById = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user.id, ["name", "email", "role"]);
    data = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
    }
    res.status(200).json({ massage: "get user scuccess", data });
  } catch (error) {
    console.log("errer get user by id", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// update user by id
const updateUserById = async (req, res) => {
  try {
    const user = req.user
    const { name, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const update = await User.findByIdAndUpdate(user.id, { name, password: passwordHash }, {new: true}, );
    data =  {
      name: update.name,
      email: update.email,
      role: update.role
    }
    
    res.status(200).json({ message: "User updated successfully", data });
  } catch (error) {
    console.log("errer update user by id", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.user;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("errer delete user by id", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
