const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to authenticate user
const isAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
const isReceptionist = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'receptionist') {
            return res.status(403).json({ message: "access dentine" });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(decoded.id);
        console.log(user);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "access dentine" });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }

}
module.exports = { isAuth, isAdmin };