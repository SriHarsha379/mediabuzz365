/* ================= LOAD HEADER ================= */

document.getElementById("header").innerHTML = `
<div class="header-inner">

  <div class="logo">
    <a href="index.html">
      <img src="images/IMG_2280.JPG" alt="Media Buzz 365">
    </a>
  </div>

  <nav>
    <div class="menu-btn" id="menuBtn">☰</div>

    <ul class="menu" id="menu">

      <li>
        <a href="index.html" class="live-link">
          <span class="live-dot"></span>
          LIVE TV
        </a>
      </li>

      <li><a href="category.html?category=breaking">తాజావార్తలు</a></li>

      <li class="dropdown">
        <a href="#">తెలంగాణ</a>
        <div class="dropdown-menu">
          <a href="city.html?city=hyderabad">హైదరాబాద్</a>
          <a href="city.html?state=telangana&city=karimnagar">కరీంనగర్</a>
          <a href="city.html?state=telangana&city=khammam">ఖమ్మం</a>
          <a href="city.html?state=telangana&city=mahbubnagar">మహబూబ్‌నగర్</a>
          <a href="city.html?state=telangana&city=medak">మెదక్</a>
          <a href="city.html?state=telangana&city=adilabad">అదిలాబాద్</a>
          <a href="city.html?state=telangana&city=nalgonda">నల్గొండ</a>
          <a href="city.html?state=telangana&city=nizamabad">నిజామాబాద్</a>
          <a href="city.html?state=telangana&city=warangal">వరంగల్</a>
        </div>
      </li>

      <li class="dropdown">
        <a href="#">ఆంధ్రప్రదేశ్</a>
        <div class="dropdown-menu">
          <a href="city.html?state=andhra&city=guntur">గుంటూరు</a>
          <a href="city.html?state=andhra&city=vijayawada">విజయవాడ</a>
          <a href="city.html?state=andhra&city=anantapur">అనంతపురం</a>
          <a href="city.html?state=andhra&city=kadapa">కడప</a>
          <a href="city.html?state=andhra&city=kurnool">కర్నూలు</a>
          <a href="city.html?state=andhra&city=nellore">నెల్లూరు</a>
          <a href="city.html?state=andhra&city=thirupati">తిరుపతి</a>
          <a href="city.html?state=andhra&city=visakhapatnam">విశాఖపట్నం</a>
          <a href="city.html?state=andhra&city=vijayanagaram">విజయనగరం</a>
          <a href="city.html?state=andhra&city=westgodavari">పశ్చిమ గోదావరి</a>
          <a href="city.html?state=andhra&city=eastgodavari">తూర్పు గోదావరి</a>
        </div>
      </li>

      <li><a href="category.html?category=national">నేషనల్</a></li>
      <li><a href="category.html?category=international">ఇంటర్నేషనల్</a></li>
      <li><a href="category.html?category=politics">రాజకీయాలు</a></li>
      <li><a href="category.html?category=crime">క్రైం</a></li>
      <li><a href="category.html?category=lifestyle">లైఫ్ స్టైల్</a></li>
      <li><a href="category.html?category=technology">టెక్నాలజీ</a></li>

      <li class="dropdown">
        <a href="#">మరిన్ని</a>
        <div class="dropdown-menu">
          <a href="category.html?category=sports">క్రీడలు</a>
          <a href="category.html?category=cinema">సినిమా</a>
          <a href="category.html?category=business">బిజినెస్</a>
        </div>
      </li>

    </ul>
  </nav>

  <div class="header-right">
    <div class="user" id="userBtn">
      <img src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/user-circle.svg">
    </div>
  </div>

</div>

<div id="menuOverlay" class="menu-overlay"></div>
`;

/* ================= HEADER CORE ================= */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const menuOverlay = document.getElementById("menuOverlay");
const userBtn = document.getElementById("userBtn");
const modal = document.getElementById("modal");
const header = document.getElementById("header");

/* MOBILE MENU */
menuBtn.addEventListener("click", () => {
  menu.classList.toggle("open");
  menuOverlay.classList.toggle("show");
});

/* OVERLAY CLOSE */
menuOverlay.addEventListener("click", () => {
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
  header.classList.toggle("shrink", window.scrollY > 80);
});

/* ================= DROPDOWNS ================= */

document.querySelectorAll(".dropdown > a").forEach(link => {
  link.addEventListener("click", e => {
    if(window.innerWidth <= 900){
      e.preventDefault();

      const parent = link.parentElement;

      document.querySelectorAll(".dropdown").forEach(d => {
        if (d !== parent) d.classList.remove("open");
      });

      parent.classList.toggle("open");
    }
  });
});

/* DESKTOP OUTSIDE CLICK */
document.addEventListener("click", e => {
  if (window.innerWidth > 900 && !e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("open"));
  }
});

/* CLOSE MENU AFTER CLICK */
document.querySelectorAll(".menu a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      menu.classList.remove("open");
      menuOverlay.classList.remove("show");
    }
  });
});
