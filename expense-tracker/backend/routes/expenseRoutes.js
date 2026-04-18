// routes/expenseRoutes.js
const express            = require("express");
const router             = express.Router();
const expenseController  = require("../controllers/expenseController");
const authMiddleware     = require("../middleware/auth");

// All expense routes are protected – user must send a valid JWT
router.use(authMiddleware);

// GET  /api/expenses/dashboard  (must come before /:id)
router.get("/dashboard", expenseController.dashboard);

// GET    /api/expenses
router.get("/",    expenseController.getAll);

// POST   /api/expenses
router.post("/",   expenseController.create);

// PUT    /api/expenses/:id
router.put("/:id", expenseController.update);

// DELETE /api/expenses/:id
router.delete("/:id", expenseController.remove);

module.exports = router;
