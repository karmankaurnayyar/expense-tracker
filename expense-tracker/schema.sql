-- ============================================================
--  Expense Tracker – MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- ------------------------------------------------------------
-- Users table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,             -- bcrypt hash
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Expenses table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
  id          INT            AUTO_INCREMENT PRIMARY KEY,
  user_id     INT            NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL,
  category    VARCHAR(50)    NOT NULL,           -- e.g. Food, Travel, etc.
  date        DATE           NOT NULL,
  description VARCHAR(255),
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_expenses_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index to speed up per-user queries
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
