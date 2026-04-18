// models/expenseModel.js – All DB queries related to expenses
const db = require("../config/db");

const ExpenseModel = {
  // Get all expenses for a specific user (newest first)
  async findAllByUser(userId) {
    const [rows] = await db.query(
      `SELECT id, amount, category, date, description, created_at
         FROM expenses
        WHERE user_id = ?
        ORDER BY date DESC, created_at DESC`,
      [userId]
    );
    return rows;
  },

  // Get one expense – also checks ownership
  async findById(id, userId) {
    const [rows] = await db.query(
      "SELECT * FROM expenses WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return rows[0] || null;
  },

  // Insert a new expense
  async create({ userId, amount, category, date, description }) {
    const [result] = await db.query(
      `INSERT INTO expenses (user_id, amount, category, date, description)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, amount, category, date, description || null]
    );
    return result.insertId;
  },

  // Update an expense (only if it belongs to the user)
  async update(id, userId, { amount, category, date, description }) {
    const [result] = await db.query(
      `UPDATE expenses
          SET amount = ?, category = ?, date = ?, description = ?
        WHERE id = ? AND user_id = ?`,
      [amount, category, date, description || null, id, userId]
    );
    return result.affectedRows; // 0 = not found / not owner
  },

  // Delete an expense (only if it belongs to the user)
  async remove(id, userId) {
    const [result] = await db.query(
      "DELETE FROM expenses WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows; // 0 = not found / not owner
  },

  // Aggregate data for the dashboard
  async getDashboardStats(userId) {
    // Total spent
    const [[{ total }]] = await db.query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ?",
      [userId]
    );

    // Per-category totals
    const [categories] = await db.query(
      `SELECT category, COALESCE(SUM(amount), 0) AS total
         FROM expenses
        WHERE user_id = ?
        GROUP BY category
        ORDER BY total DESC`,
      [userId]
    );

    // 5 most recent transactions
    const [recent] = await db.query(
      `SELECT id, amount, category, date, description
         FROM expenses
        WHERE user_id = ?
        ORDER BY date DESC, created_at DESC
        LIMIT 5`,
      [userId]
    );

    return { total, categories, recent };
  },
};

module.exports = ExpenseModel;
