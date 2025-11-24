// assets/js/sidebar.js
// Highlight active link based on current page
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".sidebar-menu a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
});
