// TOP BAR
document.getElementById("topBar").innerHTML = `
<div class="top-bar-inner">

  <div class="logo">
    <a href="index.html">
      <img src="images/mediabuzz365.png" alt="Media Buzz 365">
    </a>
  </div>

  <!-- RIGHT BUTTONS -->
  <div style="display:flex; gap:10px; align-items:center;">

    <!-- ADMIN BUTTON -->
    <a
      href="/admin/login.html"
      class="epaper-btn"
      style="background:#2563eb;"
    >
      🔐 Admin
    </a>

    <!-- EPAPER BUTTON -->
    <a href="#" class="epaper-btn">
      📰 తెలంగాణ E-Paper
    </a>

  </div>

</div>
`;


// MAIN NAV
document.getElementById("mainNav").innerHTML = `
<div class="nav-inner">
  <a href="index.html" class="home active">🏠</a>
  <a href="category.html?category=breaking">లేటెస్ట్</a>
  <a href="#" class="dropdown-trigger" data-dropdown="telangana">తెలంగాణ</a>
  <a href="#" class="dropdown-trigger" data-dropdown="andhra">ఆంధ్రప్రదేశ్</a>
  <a href="category.html?category=national">జాతీయ</a>
  <a href="category.html?category=politics">పాలిటిక్స్</a>
  <a href="category.html?category=crime">క్రైం</a>
  <a href="category.html?category=sports">క్రీడలు</a>
  <a href="category.html?category=cinema">సినిమా & TV</a>
  <a href="category.html?category=lifestyle">నవరసి</a>
  <a href="category.html?category=technology">టెక్నాలజీ</a>
  <a href="index.html#live">LIVE TV</a>
  <a href="#" class="dropdown-trigger" data-dropdown="more">MORE</a>
</div>

<!-- TELANGANA DROPDOWN -->
<div class="nav-dropdown" id="dropdown-telangana">
  <div class="dropdown-grid">
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
</div>

<!-- ANDHRA DROPDOWN -->
<div class="nav-dropdown" id="dropdown-andhra">
  <div class="dropdown-grid">
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
</div>

<!-- MORE DROPDOWN -->
<div class="nav-dropdown" id="dropdown-more">
  <div class="dropdown-grid">
    <a href="category.html?category=business">బిజినెస్</a>
    <a href="category.html?category=international">ఇంటర్నేషనల్</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
    <a href="advertise.html">Advertise</a>
  </div>
</div>
`;

/* ================= DROPDOWN FUNCTIONALITY ================= */
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
const navDropdowns = document.querySelectorAll('.nav-dropdown');

dropdownTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdownId = trigger.getAttribute('data-dropdown');
    const dropdown = document.getElementById(`dropdown-${dropdownId}`);
    
    // Close other dropdowns
    navDropdowns.forEach(d => {
      if (d !== dropdown) d.classList.remove('show');
    });
    
    // Toggle current dropdown
    dropdown.classList.toggle('show');
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown-trigger') && !e.target.closest('.nav-dropdown')) {
    navDropdowns.forEach(d => d.classList.remove('show'));
  }
});

/* ================= ACTIVE PAGE HIGHLIGHT ================= */
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav-inner a');

navLinks.forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});