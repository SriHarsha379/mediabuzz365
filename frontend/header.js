document.getElementById("header").innerHTML = `
<div class="header-inner">

<!-- LOGO -->
<div class="logo">
  <a href="index.html" aria-label="Media Buzz 365 Home">
    <img src="images/mediabuzz365.png" alt="Media Buzz 365 Logo">
  </a>
</div>

<!-- NAV -->
<nav>
<div class="menu-btn" id="menuBtn">☰</div>

<ul class="menu" id="menu">

<li>
<a href="index.html" class="live-link">
<span class="live-dot"></span> LIVE TV
</a>
</li>

<li><a href="category.html?category=breaking">తాజావార్తలు</a></li>

<!-- TELANGANA -->
<li class="dropdown">
<a href="javascript:void(0)">తెలంగాణ</a>
<div class="dropdown-menu">
<a href="city.html?state=telangana&city=adilabad">ఆదిలాబాద్</a>
<a href="city.html?state=telangana&city=bhadradri_kothagudem">భద్రాద్రి కొత్తగూడెం</a>
<a href="city.html?state=telangana&city=hanumakonda">హనుమకొండ</a>
<a href="city.html?state=telangana&city=hyderabad">హైదరాబాద్</a>
<a href="city.html?state=telangana&city=jagtial">జగిత్యాల</a>
<a href="city.html?state=telangana&city=jangaon">జనగాం</a>
<a href="city.html?state=telangana&city=jayashankar_bhupalapally">జయశంకర్ భూపాలపల్లి</a>
<a href="city.html?state=telangana&city=jogulamba_gadwal">జోగులాంబ గద్వాల్</a>
<a href="city.html?state=telangana&city=kamareddy">కామారెడ్డి</a>
<a href="city.html?state=telangana&city=karimnagar">కరీంనగర్</a>
<a href="city.html?state=telangana&city=khammam">ఖమ్మం</a>
<a href="city.html?state=telangana&city=kumuram_bheem_asifabad">కుమురం భీమ్ ఆసిఫాబాద్</a>
<a href="city.html?state=telangana&city=mahbubabad">మహబూబాబాద్</a>
<a href="city.html?state=telangana&city=mahbubnagar">మహబూబ్‌నగర్</a>
<a href="city.html?state=telangana&city=mancherial">మంచిర్యాల</a>
<a href="city.html?state=telangana&city=medak">మెదక్</a>
<a href="city.html?state=telangana&city=medchal_malkajgiri">మెద్చల్ మల్కాజ్‌గిరి</a>
<a href="city.html?state=telangana&city=mulugu">ములుగు</a>
<a href="city.html?state=telangana&city=nagarkurnool">నాగర్‌కర్నూల్</a>
<a href="city.html?state=telangana&city=nalgonda">నల్గొండ</a>
<a href="city.html?state=telangana&city=narayanpet">నారాయణపేట</a>
<a href="city.html?state=telangana&city=nirmal">నిర్మల్</a>
<a href="city.html?state=telangana&city=nizamabad">నిజామాబాద్</a>
<a href="city.html?state=telangana&city=peddapalli">పెద్దపల్లి</a>
<a href="city.html?state=telangana&city=rajanna_sircilla">రాజన్న సిరిసిల్ల</a>
<a href="city.html?state=telangana&city=ranga_reddy">రంగారెడ్డి</a>
<a href="city.html?state=telangana&city=sangareddy">సంగారెడ్డి</a>
<a href="city.html?state=telangana&city=siddipet">సిద్దిపేట</a>
<a href="city.html?state=telangana&city=suryapet">సూర్యాపేట</a>
<a href="city.html?state=telangana&city=vikarabad">వికారాబాద్</a>
<a href="city.html?state=telangana&city=wanaparthy">వనపర్తి</a>
<a href="city.html?state=telangana&city=warangal">వరంగల్</a>
<a href="city.html?state=telangana&city=yadadri_bhuvanagiri">యాదాద్రి భువనగిరి</a>
</div>
</li>

<!-- ANDHRA -->
<li class="dropdown">
<a href="javascript:void(0)">ఆంధ్రప్రదేశ్</a>
<div class="dropdown-menu">
<a href="city.html?state=andhra&city=alluri_sitarama_rau">అల్లూరి సీతారామ రాజు</a>
<a href="city.html?state=andhra&city=anantapur">అనంతపురం</a>
<a href="city.html?state=andhra&city=bapatla">బపట్ల</a>
<a href="city.html?state=andhra&city=chittoor">చిత్తూరు</a>
<a href="city.html?state=andhra&city=eluru">ఏలూరు</a>
<a href="city.html?state=andhra&city=guntur">గుంటూరు</a>
<a href="city.html?state=andhra&city=kadapa">కడప (వైఎస్సార్)</a>
<a href="city.html?state=andhra&city=kakinada">కాకినాడ</a>
<a href="city.html?state=andhra&city=konaseema">కోనసీమ</a>
<a href="city.html?state=andhra&city=kurnool">కర్నూలు</a>
<a href="city.html?state=andhra&city=nandyal">నంద్యాల</a>
<a href="city.html?state=andhra&city=ntr">ఎన్‌టిఆర్ జిల్లా</a>
<a href="city.html?state=andhra&city=nellore">నెల్లూరు</a>
<a href="city.html?state=andhra&city=parvathipuram_manyam">పార్వతీపురం మణ్యం</a>
<a href="city.html?state=andhra&city=prakasam">ప్రకాశం</a>
<a href="city.html?state=andhra&city=srikakulam">శ్రీకాకుళం</a>
<a href="city.html?state=andhra&city=sri_sathya_sai">శ్రీ సత్య సాయి</a>
<a href="city.html?state=andhra&city=tirupati">తిరుపతి జిల్లా</a>
<a href="city.html?state=andhra&city=visakhapatnam">విశాఖపట్నం</a>
<a href="city.html?state=andhra&city=vizianagaram">విజయనగరం</a>
<a href="city.html?state=andhra&city=west_godavari">పశ్చిమ గోదావరి</a>
</div>
</li>

<li><a href="category.html?category=national">నేషనల్</a></li>
<li><a href="category.html?category=international">ఇంటర్నేషనల్</a></li>
<li><a href="category.html?category=politics">రాజకీయాలు</a></li>
<li><a href="category.html?category=crime">క్రైం</a></li>
<li><a href="category.html?category=lifestyle">లైఫ్ స్టైల్</a></li>
<li><a href="category.html?category=technology">టెక్నాలజీ</a></li>

<!-- MORE -->
<li class="dropdown">
<a href="javascript:void(0)">మరిన్ని</a>
<div class="dropdown-menu">
<a href="category.html?category=sports">క్రీడలు</a>
<a href="category.html?category=cinema">సినిమా</a>
<a href="category.html?category=business">బిజినెస్</a>
</div>
</li>

</ul>
</nav>

<!-- RIGHT -->
<div class="header-right">

<div class="desktop-social">
<a href="https://www.facebook.com/mediabuzz365" target="_blank">
<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg">
</a>
<a href="https://www.instagram.com/mediabuzz365" target="_blank">
<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg">
</a>
<a href="https://www.youtube.com/@mediabuzz365" target="_blank">
<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg">
</a>
<a href="https://wa.me/919XXXXXXXXX" target="_blank">
<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg">
</a>
</div>

<div class="user" id="userBtn">
<img src="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/user-circle.svg">
</div>

</div>

<div class="modal-overlay" id="modal">
<div class="modal">
<h2>Join Media Buzz 365</h2>
<p style="margin:10px 0;opacity:.8">
లైవ్ టీవీ & ప్రత్యేక కంటెంట్ కోసం సభ్యత్వం పొందండి
</p>
<div class="auth google">Sign in with Google</div>
<div class="auth fb">Sign in with Facebook</div>
</div>
</div>

</div>

<div id="menuOverlay"></div>
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
userBtn.addEventListener("click", () => {
modal.style.display = "flex";
});

modal.addEventListener("click", e => {
if (e.target === modal) modal.style.display = "none";
});

/* HEADER SHRINK */
window.addEventListener("scroll", () => {
header.classList.toggle("shrink", window.scrollY > 80);
});

/* DROPDOWNS */
document.querySelectorAll(".dropdown > a").forEach(link => {
link.addEventListener("click", e => {
//e.preventDefault();
e.stopPropagation();

const parent = link.parentElement;

document.querySelectorAll(".dropdown").forEach(d => {
if (d !== parent) d.classList.remove("open");
});

parent.classList.toggle("open");
});
});

/* CLOSE OUTSIDE */
document.addEventListener("click", e => {
if (!e.target.closest(".dropdown")) {
document.querySelectorAll(".dropdown")
.forEach(d => d.classList.remove("open"));
}
});

/* MOBILE CLOSE */
document.querySelectorAll(".dropdown-menu a").forEach(link => {
link.addEventListener("click", () => {
if (window.innerWidth <= 900) {
menu.classList.remove("open");
menuOverlay.classList.remove("show");
}
});
});
