const API_BASE = "http://localhost:5000/api";

async function getMe() {
  const token = localStorage.getItem("ndr_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: "include"
  });
  if (!res.ok) {
    window.location.href = "login.html";
    return;
  }
  return await res.json();
}

(async () => {
  try {
    const me = await getMe();
    document.getElementById("userName").textContent = me.name;
    if (me.profilePicUrl) {
      document.getElementById("profilePic").src = me.profilePicUrl;
    }
  } catch (err) {
    console.error(err);
  }
})();
