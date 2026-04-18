// controllers/authController.js – Signup & Login logic
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const UserModel = require("../models/userModel");

// Helper: generate a signed JWT
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ── POST /api/auth/signup ────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // --- Input validation ---
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // --- Duplicate check ---
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    // --- Hash password ---
    const hashedPassword = await bcrypt.hash(password, 12);

    // --- Create user ---
    const newId = await UserModel.create({ name, email, hashedPassword });
    const user  = { id: newId, name, email };

    const token = signToken(user);
    return res.status(201).json({ message: "Account created!", token, user });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    return res.status(200).json({
      message: "Logged in!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
