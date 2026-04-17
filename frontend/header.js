// ============================================================
// MEDIABUZZ365 — HEADER (shared across all pages)
// ============================================================

/* ---- BREAKING NEWS TICKER ---- */
const tickerBarEl = document.getElementById("tickerBar");
if (tickerBarEl) {
  tickerBarEl.innerHTML = `
    <div class="ticker-label">
      <span class="ticker-dot"></span>
      బ్రేకింగ్
    </div>
    <div class="ticker-track">
      <div class="ticker-items" id="tickerItems">
        <span>వార్తలు లోడ్ అవుతున్నాయి…</span>
      </div>
    </div>
  `;

  // Fetch latest headlines to populate the ticker
  fetch("/api/news?limit=10")
    .then(r => r.ok ? r.json() : Promise.resolve([]))
    .then(items => {
      if (!items || !items.length) return;
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      // Duplicate items so the scroll feels continuous
      const headlines = [...items, ...items];
      const ticker = document.getElementById("tickerItems");
      if (!ticker) return;
      ticker.innerHTML = headlines.map(n =>
        `<span onclick="location.href='news-detail.html?id=${n._id}'">${escHtml(n.title)}</span>`
      ).join("");
    })
    .catch(() => {});
}

function escHtml(s) {
  if (!s) return "";
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

/* ---- TOP BAR ---- */
const topBarEl = document.getElementById("topBar");
if (topBarEl) {
  topBarEl.innerHTML = `
    <div class="top-bar-inner">
      <div class="logo">
        <a href="/index.html">
          <img src="/images/mediabuzz365.png" alt="Media Buzz 365">
        </a>
      </div>

      <!-- SEARCH -->
      <form class="search-form" onsubmit="doSearch(event)">
        <input type="text" id="searchInput" placeholder="వార్తలు వెతకండి…" autocomplete="off">
        <button type="submit">🔍</button>
      </form>

      <!-- E-PAPER -->
      <a href="#" class="epaper-btn">📰 E-Paper</a>
    </div>
  `;
}

function doSearch(e) {
  e.preventDefault();
  const q = document.getElementById("searchInput").value.trim();
  if (q) window.location.href = `/category.html?search=${encodeURIComponent(q)}`;
}

/* ---- MAIN NAV ---- */
const mainNavEl = document.getElementById("mainNav");
if (mainNavEl) {
  mainNavEl.innerHTML = `
    <div class="nav-inner">
      <a href="/index.html" class="home active">🏠</a>
      <a href="/category.html?category=breaking">లేటెస్ట్</a>
      <a href="#" class="dropdown-trigger" data-dropdown="telangana">తెలంగాణ</a>
      <a href="#" class="dropdown-trigger" data-dropdown="andhra">ఆంధ్రప్రదేశ్</a>
      <a href="/category.html?category=national">జాతీయ</a>
      <a href="/category.html?category=politics">పాలిటిక్స్</a>
      <a href="/category.html?category=crime">క్రైం</a>
      <a href="/category.html?category=sports">క్రీడలు</a>
      <a href="/category.html?category=cinema">సినిమా &amp; TV</a>
      <a href="/category.html?category=lifestyle">లైఫ్ స్టైల్</a>
      <a href="/category.html?category=technology">టెక్నాలజీ</a>
      <a href="/index.html#live">LIVE TV</a>
      <a href="#" class="dropdown-trigger" data-dropdown="more">MORE ▾</a>
    </div>

    <!-- TELANGANA DROPDOWN -->
    <div class="nav-dropdown" id="dropdown-telangana">
      <div class="dropdown-grid">
        <a href="/city.html?state=telangana&city=adilabad">ఆదిలాబాద్</a>
        <a href="/city.html?state=telangana&city=bhadradri_kothagudem">భద్రాద్రి కొత్తగూడెం</a>
        <a href="/city.html?state=telangana&city=hanumakonda">హనుమకొండ</a>
        <a href="/city.html?state=telangana&city=hyderabad">హైదరాబాద్</a>
        <a href="/city.html?state=telangana&city=jagtial">జగిత్యాల</a>
        <a href="/city.html?state=telangana&city=jangaon">జనగాం</a>
        <a href="/city.html?state=telangana&city=jayashankar_bhupalapally">జయశంకర్ భూపాలపల్లి</a>
        <a href="/city.html?state=telangana&city=jogulamba_gadwal">జోగులాంబ గద్వాల్</a>
        <a href="/city.html?state=telangana&city=kamareddy">కామారెడ్డి</a>
        <a href="/city.html?state=telangana&city=karimnagar">కరీంనగర్</a>
        <a href="/city.html?state=telangana&city=khammam">ఖమ్మం</a>
        <a href="/city.html?state=telangana&city=kumuram_bheem_asifabad">కుమురం భీమ్ ఆసిఫాబాద్</a>
        <a href="/city.html?state=telangana&city=mahbubabad">మహబూబాబాద్</a>
        <a href="/city.html?state=telangana&city=mahbubnagar">మహబూబ్‌నగర్</a>
        <a href="/city.html?state=telangana&city=mancherial">మంచిర్యాల</a>
        <a href="/city.html?state=telangana&city=medak">మెదక్</a>
        <a href="/city.html?state=telangana&city=medchal_malkajgiri">మెద్చల్ మల్కాజ్‌గిరి</a>
        <a href="/city.html?state=telangana&city=mulugu">ములుగు</a>
        <a href="/city.html?state=telangana&city=nagarkurnool">నాగర్‌కర్నూల్</a>
        <a href="/city.html?state=telangana&city=nalgonda">నల్గొండ</a>
        <a href="/city.html?state=telangana&city=narayanpet">నారాయణపేట</a>
        <a href="/city.html?state=telangana&city=nirmal">నిర్మల్</a>
        <a href="/city.html?state=telangana&city=nizamabad">నిజామాబాద్</a>
        <a href="/city.html?state=telangana&city=peddapalli">పెద్దపల్లి</a>
        <a href="/city.html?state=telangana&city=rajanna_sircilla">రాజన్న సిరిసిల్ల</a>
        <a href="/city.html?state=telangana&city=ranga_reddy">రంగారెడ్డి</a>
        <a href="/city.html?state=telangana&city=sangareddy">సంగారెడ్డి</a>
        <a href="/city.html?state=telangana&city=siddipet">సిద్దిపేట</a>
        <a href="/city.html?state=telangana&city=suryapet">సూర్యాపేట</a>
        <a href="/city.html?state=telangana&city=vikarabad">వికారాబాద్</a>
        <a href="/city.html?state=telangana&city=wanaparthy">వనపర్తి</a>
        <a href="/city.html?state=telangana&city=warangal">వరంగల్</a>
        <a href="/city.html?state=telangana&city=yadadri_bhuvanagiri">యాదాద్రి భువనగిరి</a>
      </div>
    </div>

    <!-- ANDHRA DROPDOWN -->
    <div class="nav-dropdown" id="dropdown-andhra">
      <div class="dropdown-grid">
        <a href="/city.html?state=andhra&city=alluri_sitarama_rau">అల్లూరి సీతారామ రాజు</a>
        <a href="/city.html?state=andhra&city=anantapur">అనంతపురం</a>
        <a href="/city.html?state=andhra&city=bapatla">బపట్ల</a>
        <a href="/city.html?state=andhra&city=chittoor">చిత్తూరు</a>
        <a href="/city.html?state=andhra&city=eluru">ఏలూరు</a>
        <a href="/city.html?state=andhra&city=guntur">గుంటూరు</a>
        <a href="/city.html?state=andhra&city=kadapa">కడప (వైఎస్సార్)</a>
        <a href="/city.html?state=andhra&city=kakinada">కాకినాడ</a>
        <a href="/city.html?state=andhra&city=konaseema">కోనసీమ</a>
        <a href="/city.html?state=andhra&city=kurnool">కర్నూలు</a>
        <a href="/city.html?state=andhra&city=nandyal">నంద్యాల</a>
        <a href="/city.html?state=andhra&city=ntr">ఎన్‌టిఆర్ జిల్లా</a>
        <a href="/city.html?state=andhra&city=nellore">నెల్లూరు</a>
        <a href="/city.html?state=andhra&city=parvathipuram_manyam">పార్వతీపురం మణ్యం</a>
        <a href="/city.html?state=andhra&city=prakasam">ప్రకాశం</a>
        <a href="/city.html?state=andhra&city=srikakulam">శ్రీకాకుళం</a>
        <a href="/city.html?state=andhra&city=sri_sathya_sai">శ్రీ సత్య సాయి</a>
        <a href="/city.html?state=andhra&city=tirupati">తిరుపతి జిల్లా</a>
        <a href="/city.html?state=andhra&city=visakhapatnam">విశాఖపట్నం</a>
        <a href="/city.html?state=andhra&city=vizianagaram">విజయనగరం</a>
        <a href="/city.html?state=andhra&city=west_godavari">పశ్చిమ గోదావరి</a>
      </div>
    </div>

    <!-- MORE DROPDOWN -->
    <div class="nav-dropdown" id="dropdown-more">
      <div class="dropdown-grid">
        <a href="/category.html?category=business">బిజినెస్</a>
        <a href="/category.html?category=international">ఇంటర్నేషనల్</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <a href="/advertise.html">Advertise</a>
      </div>
    </div>
  `;

  /* ---- DROPDOWN TOGGLE ---- */
  document.querySelectorAll(".dropdown-trigger").forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.preventDefault();
      const id = trigger.getAttribute("data-dropdown");
      const target = document.getElementById(`dropdown-${id}`);
      document.querySelectorAll(".nav-dropdown").forEach(d => {
        if (d !== target) d.classList.remove("show");
      });
      target.classList.toggle("show");
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".dropdown-trigger") && !e.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown").forEach(d => d.classList.remove("show"));
    }
  });

  /* ---- ACTIVE LINK ---- */
  const page = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-inner a").forEach(link => {
    const href = (link.getAttribute("href") || "").replace(/^\//, "");
    if (href === page || (page === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
