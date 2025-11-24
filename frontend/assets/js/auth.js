// frontend/assets/js/auth.js
const API_BASE = "http://localhost:5000/api";

async function postJSON(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

// ========== REGISTER ==========
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const msgEl = document.getElementById("registerMessage");

    msgEl.style.color = "";
    msgEl.textContent = "Registering...";

    try {
      const res = await postJSON(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
      });
      msgEl.style.color = "green";
      msgEl.textContent =
        res.message || "Registered successfully. Wait for admin approval.";
    } catch (err) {
      msgEl.style.color = "red";
      msgEl.textContent = err.message || "Registration failed";
    }
  });
}

// ========== CLIENT LOGIN ==========
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const msgEl = document.getElementById("loginMessage");

    msgEl.style.color = "";
    msgEl.textContent = "Logging in...";

    console.log("CLIENT LOGIN:", email, password);

    try {
      const res = await postJSON(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("ndr_token", res.token);
      localStorage.setItem("ndr_user_name", res.user.name);
      localStorage.setItem("ndr_user_role", res.user.role);

      msgEl.style.color = "green";
      msgEl.textContent = "Login successful. Redirecting...";
      setTimeout(() => {
        window.location.href = "home.html";
      }, 800);
    } catch (err) {
      console.error("CLIENT LOGIN ERROR:", err);
      msgEl.style.color = "red";
      msgEl.textContent = err.message || "Login failed";
    }
  });
}
