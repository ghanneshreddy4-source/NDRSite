// assets/js/profile.js
const API_BASE = "http://localhost:5000/api";

(async () => {
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
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    if (user.profilePicUrl) {
      document.getElementById("profilePic").src = user.profilePicUrl;
    }
    document.getElementById("attendance").textContent = user.attendance || 0;
    document.getElementById("streak").textContent = user.streak || 0;
    document.getElementById("performance").textContent = user.performanceScore || 0;
  } catch (err) {
    console.error(err);
  }
})();
