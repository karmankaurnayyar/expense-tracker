// js/api.js – Shared helpers used by all pages

// Where your backend lives. Change this if you deploy.
const API_BASE = "http://localhost:5000/api";

/* ── Token helpers ───────────────────────────────────────── */
function getToken()        { return localStorage.getItem("token"); }
function setToken(t)       { localStorage.setItem("token", t); }
function setUser(u)        { localStorage.setItem("user", JSON.stringify(u)); }
function getUser()         {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
}
function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/* ── Redirect helpers ────────────────────────────────────── */
function requireAuth() {
  if (!getToken()) window.location.href = "/index.html";
}
function redirectIfLoggedIn() {
  if (getToken()) window.location.href = "/pages/dashboard.html";
}

/* ── Generic fetch wrapper ───────────────────────────────── */
async function apiFetch(endpoint, options = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

/* ── Category emoji map ──────────────────────────────────── */
const CAT_EMOJI = {
  Food: "🍔", Travel: "✈️", Shopping: "🛍️",
  Entertainment: "🎬", Health: "💊", Education: "📚",
  Bills: "🧾", Other: "📌",
};

function catEmoji(cat) { return CAT_EMOJI[cat] || "📌"; }

/* ── Format helpers ──────────────────────────────────────── */
function formatCurrency(n) {
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ── Show/hide alert ─────────────────────────────────────── */
function showAlert(el, msg, type = "error") {
  el.textContent = msg;
  el.className = `alert ${type === "success" ? "alert-success" : "alert-error"} show`;
  setTimeout(() => el.classList.remove("show"), 4000);
}
