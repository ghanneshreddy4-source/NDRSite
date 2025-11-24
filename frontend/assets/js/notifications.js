// assets/js/notifications.js
const API_BASE = "http://localhost:5000/api";

async function loadNotifications() {
  const token = localStorage.getItem("ndr_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/user/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });

    if (!res.ok) throw new Error("Failed to load notifications");

    const data = await res.json();
    renderNotifications(data);
  } catch (err) {
    console.error(err);
    document.getElementById("notifList").innerHTML =
      "<p>Error loading notifications.</p>";
  }
}

function renderNotifications(list) {
  const container = document.getElementById("notifList");
  if (!list || list.length === 0) {
    container.innerHTML = "<p>No notifications yet.</p>";
    return;
  }

  container.innerHTML = "";
  list
    .slice()
    .reverse()
    .forEach((n) => {
      const div = document.createElement("div");
      div.className = "notif-item" + (n.read ? "" : " unread");
      const date = new Date(n.createdAt);
      div.innerHTML = `
        <div>${n.message}</div>
        <div class="notif-meta">${n.type || "info"} • ${date.toLocaleString()}</div>
      `;
      container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", loadNotifications);
