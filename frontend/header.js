/* ================= HEADER CORE ================= */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const menuOverlay = document.getElementById("menuOverlay");
const userBtn = document.getElementById("userBtn");
const modal = document.getElementById("modal");
const header = document.getElementById("header");

/* MOBILE MENU */
menuBtn?.addEventListener("click", () => {
  menu.classList.toggle("open");
  menuOverlay.classList.toggle("show");
});

/* OVERLAY CLOSE */
menuOverlay?.addEventListener("click", () => {
  menu.classList.remove("open");
  menuOverlay.classList.remove("show");
});

/* USER MODAL */
userBtn?.addEventListener("click", () => {
  modal.style.display = "flex";
});

modal?.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

/* HEADER SHRINK */
window.addEventListener("scroll", () => {
  header?.classList.toggle("shrink", window.scrollY > 80);
});

/* ================= DROPDOWNS (DESKTOP + MOBILE) ================= */

document.querySelectorAll(".dropdown > a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    const parent = link.parentElement;

    document.querySelectorAll(".dropdown").forEach(d => {
      if (d !== parent) d.classList.remove("open");
    });

    parent.classList.toggle("open");
  });
});

/* CLOSE DROPDOWN OUTSIDE (DESKTOP) */
document.addEventListener("click", e => {
  if (window.innerWidth > 900 && !e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("open"));
  }
});

/* MOBILE: CLOSE MENU AFTER CLICK */
document.querySelectorAll(".dropdown-menu a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      menu.classList.remove("open");
      menuOverlay.classList.remove("show");
    }
  });
});

document.querySelectorAll(".menu > li:not(.dropdown) > a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      menu.classList.remove("open");
      menuOverlay.classList.remove("show");
    }
  });
});


