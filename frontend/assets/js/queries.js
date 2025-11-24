// assets/js/queries.js
const API_BASE = "http://localhost:5000/api";

let activeQueryId = null;

async function loadQueries() {
  const token = localStorage.getItem("ndr_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/queries/mine`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });

    if (!res.ok) throw new Error("Failed to load queries");

    const queries = await res.json();
    if (queries.length === 0) {
      // No previous queries, create one on first send
      document.getElementById("chatMessages").innerHTML =
        "<p>No previous queries. Send your first question below.</p>";
      return;
    }

    // Use latest query
    const latest = queries[0];
    activeQueryId = latest._id;
    renderMessages(latest.messages);
  } catch (err) {
    console.error(err);
  }
}

function renderMessages(messages) {
  const container = document.getElementById("chatMessages");
  container.innerHTML = "";
  messages.forEach((m) => {
    const div = document.createElement("div");
    div.className = `msg ${m.sender}`;
    div.textContent = m.text;
    container.appendChild(div);
  });
  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("chatText");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  const token = localStorage.getItem("ndr_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    let query;
    if (!activeQueryId) {
      // Create new query
      const res = await fetch(`${API_BASE}/queries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          subject: "Client Query",
          message: text
        })
      });
      query = await res.json();
      activeQueryId = query._id;
    } else {
      // Reply on existing query
      const res = await fetch(`${API_BASE}/queries/reply/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          queryId: activeQueryId,
          text
        })
      });
      query = await res.json();
    }

    renderMessages(query.messages);
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("chatText").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

document.addEventListener("DOMContentLoaded", loadQueries);
