// assets/js/courses.js
const API_BASE = "http://localhost:5000/api";

async function fetchCourses() {
  const token = localStorage.getItem("ndr_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/courses`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });

    if (!res.ok) {
      if (res.status === 401) window.location.href = "login.html";
      throw new Error("Failed to load courses");
    }

    const data = await res.json();
    renderCourses(data);
  } catch (err) {
    console.error(err);
    document.getElementById("coursesList").innerHTML =
      "<p>Error loading courses. Ask admin to add them.</p>";
  }
}

function mapCourseToPage(courseName) {
  const name = courseName.toLowerCase();
  if (name.includes("snowflake")) return "courses/snowflake.html";
  if (name.includes("sap")) return "courses/sap.html";
  if (name.includes("abap")) return "courses/abap.html";
  if (name.includes("tableau")) return "courses/tableau.html";
  return "courses.html";
}

function renderCourses(courses) {
  const container = document.getElementById("coursesList");
  if (!courses || courses.length === 0) {
    container.innerHTML = `
      <p>No courses found. Ask admin to add courses in admin panel.</p>
      <div class="course-grid">
        <div class="course-card">
          <span class="tag">Sample</span>
          <h3>Snowflake</h3>
          <p>Introductory course on Snowflake data warehousing.</p>
          <a href="courses/snowflake.html" class="btn">Open Course</a>
        </div>
        <div class="course-card">
          <span class="tag">Sample</span>
          <h3>SAP</h3>
          <p>Basics of SAP ERP modules and workflows.</p>
          <a href="courses/sap.html" class="btn">Open Course</a>
        </div>
        <div class="course-card">
          <span class="tag">Sample</span>
          <h3>ABAP</h3>
          <p>Programming with ABAP in SAP environment.</p>
          <a href="courses/abap.html" class="btn">Open Course</a>
        </div>
        <div class="course-card">
          <span class="tag">Sample</span>
          <h3>Tableau</h3>
          <p>Data visualization and dashboards using Tableau.</p>
          <a href="courses/tableau.html" class="btn">Open Course</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  courses.forEach((c) => {
    const card = document.createElement("div");
    card.className = "course-card";

    const page = mapCourseToPage(c.name || c.category || "");
    card.innerHTML = `
      <span class="tag">${c.category || "Course"}</span>
      <h3>${c.name}</h3>
      <p>${c.description || "No description provided."}</p>
      <a href="${page}" class="btn">Open Course</a>
    `;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", fetchCourses);
