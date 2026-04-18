// controllers/expenseController.js – CRUD + dashboard
const ExpenseModel = require("../models/expenseModel");

// Valid expense categories
const VALID_CATEGORIES = [
  "Food", "Travel", "Shopping", "Entertainment",
  "Health", "Education", "Bills", "Other",
];

// ── GET /api/expenses ─────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const expenses = await ExpenseModel.findAllByUser(req.user.id);
    return res.status(200).json({ expenses });
  } catch (err) {
    console.error("getAll error:", err);
    return res.status(500).json({ message: "Could not fetch expenses." });
  }
};

// ── POST /api/expenses ────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    // --- Validation ---
    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Amount, category and date are required." });
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number." });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}` });
    }
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const newId = await ExpenseModel.create({
      userId:      req.user.id,
      amount:      parseFloat(amount),
      category,
      date,
      description: description || "",
    });

    const expense = await ExpenseModel.findById(newId, req.user.id);
    return res.status(201).json({ message: "Expense added!", expense });
  } catch (err) {
    console.error("create error:", err);
    return res.status(500).json({ message: "Could not create expense." });
  }
};

// ── PUT /api/expenses/:id ─────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Amount, category and date are required." });
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number." });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}` });
    }

    const affected = await ExpenseModel.update(id, req.user.id, {
      amount: parseFloat(amount),
      category,
      date,
      description: description || "",
    });

    if (affected === 0) {
      return res.status(404).json({ message: "Expense not found or access denied." });
    }

    const expense = await ExpenseModel.findById(id, req.user.id);
    return res.status(200).json({ message: "Expense updated!", expense });
  } catch (err) {
    console.error("update error:", err);
    return res.status(500).json({ message: "Could not update expense." });
  }
};

// ── DELETE /api/expenses/:id ──────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await ExpenseModel.remove(id, req.user.id);

    if (affected === 0) {
      return res.status(404).json({ message: "Expense not found or access denied." });
    }
    return res.status(200).json({ message: "Expense deleted." });
  } catch (err) {
    console.error("remove error:", err);
    return res.status(500).json({ message: "Could not delete expense." });
  }
};

// ── GET /api/expenses/dashboard ───────────────────────────────
exports.dashboard = async (req, res) => {
  try {
    const stats = await ExpenseModel.getDashboardStats(req.user.id);
    return res.status(200).json(stats);
  } catch (err) {
    console.error("dashboard error:", err);
    return res.status(500).json({ message: "Could not load dashboard." });
  }
};
