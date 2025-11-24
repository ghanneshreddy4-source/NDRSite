// frontend/admin/js/admin-auth.js
const API_BASE = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const msgEl = document.getElementById("adminLoginMsg");

    msgEl.style.color = "";
    msgEl.textContent = "Logging in...";

    console.log("ADMIN LOGIN ATTEMPT:", email, password);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("ADMIN LOGIN RESPONSE:", res.status, data);

      if (!res.ok) {
        throw data;
      }

      if (!data.user || data.user.role !== "admin") {
        throw { message: "Not an admin account." };
      }

      localStorage.setItem("ndr_token", data.token);
      localStorage.setItem("ndr_user_role", data.user.role);
      localStorage.setItem("ndr_user_name", data.user.name);

      msgEl.style.color = "green";
      msgEl.textContent = "Login successful";

      setTimeout(() => {
        window.location.href = "admin-dashboard.html";
      }, 800);
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);
      msgEl.style.color = "red";
      msgEl.textContent = err.message || "Login failed";
    }
  });
});
