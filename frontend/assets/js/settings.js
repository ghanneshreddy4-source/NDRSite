// assets/js/settings.js
const API_BASE = "http://localhost:5000/api";

async function loadCurrentProfile() {
  const token = localStorage.getItem("ndr_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "login.html";
      return;
    }

    const user = await res.json();
    document.getElementById("setName").value = user.name || "";
    document.getElementById("setEmail").value = user.email || "";
    document.getElementById("setPic").value = user.profilePicUrl || "";
  } catch (err) {
    console.error(err);
  }
}

async function saveSettings() {
  const token = localStorage.getItem("ndr_token");
  const name = document.getElementById("setName").value;
  const email = document.getElementById("setEmail").value;
  const profilePicUrl = document.getElementById("setPic").value;
  const msgEl = document.getElementById("settingsMsg");

  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({ name, email, profilePicUrl })
    });

    const json = await res.json();
    if (!res.ok) throw json;

    msgEl.style.color = "green";
    msgEl.textContent = "Profile updated successfully.";
    localStorage.setItem("ndr_user_name", json.name);
  } catch (err) {
    msgEl.style.color = "red";
    msgEl.textContent = err.message || "Failed to update profile.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCurrentProfile();
  document
    .getElementById("saveSettingsBtn")
    .addEventListener("click", saveSettings);
});
