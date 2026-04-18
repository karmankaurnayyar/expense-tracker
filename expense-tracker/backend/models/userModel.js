// models/userModel.js – All DB queries related to users
const db = require("../config/db");

const UserModel = {
  // Find a user by email (used for login & duplicate check)
  async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  },

  // Find a user by primary key
  async findById(id) {
    const [rows] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Insert a new user; returns the new user's id
  async create({ name, email, hashedPassword }) {
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    return result.insertId;
  },
};

module.exports = UserModel;
