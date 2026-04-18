# 💰 ExpenseIQ – Full-Stack Expense Tracker

A complete expense tracking web application with user authentication, CRUD operations, and a dashboard with category analytics.

---

## 📁 Folder Structure

```
expense-tracker/
├── schema.sql                  ← Run this in MySQL first
│
├── backend/
│   ├── server.js               ← Entry point
│   ├── package.json
│   ├── .env.example            ← Copy to .env and fill in values
│   ├── config/
│   │   └── db.js               ← MySQL connection pool
│   ├── middleware/
│   │   └── auth.js             ← JWT verification middleware
│   ├── models/
│   │   ├── userModel.js        ← User DB queries
│   │   └── expenseModel.js     ← Expense DB queries
│   ├── controllers/
│   │   ├── authController.js   ← Signup / Login logic
│   │   └── expenseController.js← CRUD + dashboard stats
│   └── routes/
│       ├── authRoutes.js       ← POST /api/auth/*
│       └── expenseRoutes.js    ← GET/POST/PUT/DELETE /api/expenses/*
│
└── frontend/
    ├── index.html              ← Redirects to login
    ├── css/
    │   └── style.css           ← All styles (dark theme)
    ├── js/
    │   └── api.js              ← Shared fetch helpers + utils
    └── pages/
        ├── login.html
        ├── signup.html
        └── dashboard.html      ← Main app (stats, table, modals)
```

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,        -- bcrypt hash
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses
CREATE TABLE expenses (
  id          INT            AUTO_INCREMENT PRIMARY KEY,
  user_id     INT            NOT NULL,
  amount      DECIMAL(10,2)  NOT NULL,
  category    VARCHAR(50)    NOT NULL,
  date        DATE           NOT NULL,
  description VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🚀 Step-by-Step Setup

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | https://nodejs.org |
| MySQL | ≥ 8.0 | https://dev.mysql.com/downloads/ |
| npm | ≥ 9 | Bundled with Node.js |

---

### Step 1 – Set up the Database

Open your MySQL client (MySQL Workbench, DBeaver, or terminal):

```sql
-- Option A: MySQL terminal
mysql -u root -p

-- Then run:
source /path/to/expense-tracker/schema.sql;
```

Or paste the contents of `schema.sql` directly into MySQL Workbench and execute.

---

### Step 2 – Configure the Backend

```bash
# Navigate to the backend folder
cd expense-tracker/backend

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env
```

Now open `.env` in any text editor and fill in your values:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=expense_tracker
JWT_SECRET=any_long_random_string_here_e.g._abc123xyz789
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

---

### Step 3 – Start the Backend

```bash
# Production start
npm start

# OR development mode (auto-restarts on file changes)
npm run dev
```

You should see:
```
✅  MySQL connected
🚀  Server running on http://localhost:5000
```

Test the API is running:
```
http://localhost:5000/health  →  { "status": "ok" }
```

---

### Step 4 – Open the Frontend

The frontend is plain HTML — no build step needed.

**Option A – Open directly in browser:**
```
Double-click:  expense-tracker/frontend/index.html
```
> ⚠️ Note: When opening as a `file://` URL the redirect in `index.html` may behave differently across browsers. Open `frontend/pages/login.html` directly if needed.

**Option B – Serve with VS Code Live Server (recommended):**
1. Install the "Live Server" extension in VS Code
2. Right-click `frontend/index.html` → "Open with Live Server"
3. Visit `http://127.0.0.1:5500`

**Option C – Serve with Node http-server:**
```bash
npx http-server frontend -p 3000
# Visit http://localhost:3000
```

---

### Step 5 – Use the App

1. Go to `http://localhost:3000/pages/signup.html`
2. Create an account
3. You'll be redirected to the dashboard
4. Add expenses, view category breakdown, edit and delete entries

---

## 🌐 API Reference

### Auth Endpoints

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | `{name, email, password}` | Register new user |
| POST | `/api/auth/login` | `{email, password}` | Login, get JWT token |

### Expense Endpoints (require `Authorization: Bearer <token>`)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/expenses` | — | Get all expenses for logged-in user |
| GET | `/api/expenses/dashboard` | — | Totals, categories, recent 5 |
| POST | `/api/expenses` | `{amount, category, date, description?}` | Create expense |
| PUT | `/api/expenses/:id` | `{amount, category, date, description?}` | Update expense |
| DELETE | `/api/expenses/:id` | — | Delete expense |

**Valid categories:** `Food`, `Travel`, `Shopping`, `Entertainment`, `Health`, `Education`, `Bills`, `Other`

---

## ☁️ Deployment Guide (Bonus)

### Backend → Railway (free tier available)

1. Push your project to a GitHub repository
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Select your repo and set the **root directory** to `backend`
4. Add environment variables in Railway's dashboard (same as your `.env`)
5. Railway auto-detects Node.js and runs `npm start`
6. Copy the generated URL (e.g. `https://your-app.railway.app`)

### Backend → Render (alternative)

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo, set root to `backend`
3. Build command: `npm install`  |  Start command: `npm start`
4. Add all env variables under "Environment"
5. Copy the public URL

### Frontend → Netlify

1. Update `API_BASE` in `frontend/js/api.js` to your deployed backend URL:
   ```js
   const API_BASE = "https://your-app.railway.app/api";
   ```
2. Go to https://netlify.com → Add new site → Deploy manually
3. Drag and drop the entire `frontend/` folder onto Netlify
4. Done — your frontend is live with a `*.netlify.app` URL

> 💡 For a custom domain, configure it in the Netlify or Railway dashboard settings.

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (12 salt rounds) — never stored in plain text
- JWTs are signed with your `JWT_SECRET` and expire after 7 days
- All expense endpoints verify the JWT and scope queries to `user_id` — users can only see/edit their own data
- Input validation runs on both frontend and backend

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| `MySQL connection failed` | Check `.env` credentials; ensure MySQL service is running |
| `Route not found` on `/api/*` | Make sure the backend server is running on port 5000 |
| `Invalid token` after page refresh | Token is stored in `localStorage` — check browser console |
| CORS error in browser | Set `CORS_ORIGIN=*` in `.env` during development |
| `Cannot find module` | Run `npm install` inside the `backend/` folder |
