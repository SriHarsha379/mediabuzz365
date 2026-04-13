// API Configuration
const API = location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://mediabuzz365.in";

// Simple in-memory cache for news data
const _newsCache = { data: null, ts: 0 };
const NEWS_CACHE_TTL = 5000; // 5 seconds

// Pagination state
let _currentPage = 1;
let _totalPages = 1;
let _accumulatedNews = [];

// Debounce helper
function debounce(fn, delay) {
  let timer = null;
  return function () {
    const self = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(self, args); }, delay);
  };
}

// Debounced public refresh — called by Socket.IO events
const performRefresh = debounce(function () {
  _newsCache.ts = 0; // invalidate cache so next call fetches fresh data
  loadAllNews();
}, 400);

// Pick safe image
function getImage(news) {
  if (news.images && news.images.length > 0) {
    return API + news.images[0];
  }
  if (news.image) {
    return API + news.image;
  }
  return "https://via.placeholder.com/800x400?text=No+Image";
}

// Show a subtle loading indicator on all sections
function _showLoadingState() {
  ["topNewsContent", "trendingGrid", "breakingNews", "moreNews"].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.loading) {
      el.dataset.loading = "1";
      el.style.opacity = "0.5";
    }
  });
}

// Clear loading indicator
function _clearLoadingState() {
  ["topNewsContent", "trendingGrid", "breakingNews", "moreNews"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      delete el.dataset.loading;
      el.style.opacity = "";
    }
  });
}

// Load all news when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadAllNews();
});

async function loadAllNews() {
  const now = Date.now();
  // Return cached data if still fresh
  if (_newsCache.data && now - _newsCache.ts < NEWS_CACHE_TTL) {
    _renderNews(_newsCache.data);
    return;
  }

  _showLoadingState();
  try {
    const response = await fetch(`${API}/api/news?page=1&limit=10`);
    if (!response.ok) throw new Error("Failed");

    const result = await response.json();
    const allNews = result.data;

    if (!allNews || !allNews.length) {
      _clearLoadingState();
      showNoNewsMessage();
      return;
    }

    // Update pagination state
    _currentPage = result.page;
    _totalPages = result.pages;
    _accumulatedNews = allNews;

    // Update cache
    _newsCache.data = _accumulatedNews;
    _newsCache.ts = Date.now();

    _renderNews(_accumulatedNews);
    _updateLoadMoreButton();
  } catch (e) {
    console.error(e);
    _clearLoadingState();
    showErrorMessage();
  }
}

function _renderNews(allNews) {
  const breaking = allNews.filter(n => n.category === "breaking");
  populateTopNews(allNews);
  populateTrendingNews(allNews);
  populateBreakingNews(breaking.length ? breaking : allNews);
  populateMoreNews(allNews);
  _clearLoadingState();
}

function _updateLoadMoreButton() {
  const btn = document.getElementById("loadMoreBtn");
  if (!btn) return;
  if (_currentPage < _totalPages) {
    btn.style.display = "block";
    btn.disabled = false;
    btn.textContent = "మరిన్ని వార్తలు";
  } else {
    btn.style.display = "none";
  }
}

async function loadMoreNews() {
  if (_currentPage >= _totalPages) return;

  const btn = document.getElementById("loadMoreBtn");
  if (btn) { btn.disabled = true; btn.textContent = "లోడ్ అవుతోంది..."; }

  try {
    const nextPage = _currentPage + 1;
    const response = await fetch(`${API}/api/news?page=${nextPage}&limit=10`);
    if (!response.ok) throw new Error("Failed");

    const result = await response.json();

    _currentPage = result.page;
    _totalPages = result.pages;
    _accumulatedNews.push(...result.data);

    // Update cache
    _newsCache.data = _accumulatedNews;
    _newsCache.ts = Date.now();

    _appendMoreNews(result.data);
    _updateLoadMoreButton();
  } catch (e) {
    console.error(e);
    if (btn) { btn.disabled = false; btn.textContent = "మరిన్ని వార్తలు"; }
  }
}

function _appendMoreNews(articles) {
  const el = document.getElementById("moreNews");
  if (!el) return;
  articles.forEach(n => {
    const item = document.createElement("div");
    item.className = "sidebar-item";
    item.onclick = () => openNews(n._id);
    item.innerHTML = `
      <div class="img-wrap">
        <img src="${getImage(n)}" alt="">
      </div>
      <h4>${n.title}</h4>
    `;
    el.appendChild(item);
  });
}

/* ================= TOP NEWS ================= */
function populateTopNews(newsData) {
  const el = document.getElementById("topNewsContent");
  if (!el) return;

  const items = newsData.slice(0, 5);
  if (!items.length) {
    el.innerHTML = "<p>వార్తలు లేవు</p>";
    return;
  }

  let html = "";

  // Main
  const main = items[0];
  html += `
    <div class="news-main" onclick="openNews('${main._id}')">
      <div class="img-wrap">
        <img src="${getImage(main)}" alt="">
      </div>
      <h3>${main.title}</h3>
    </div>
  `;

  // Side
  items.slice(1).forEach(n => {
    html += `
      <div class="news-side" onclick="openNews('${n._id}')">
        <div class="img-wrap">
          <img src="${getImage(n)}" alt="">
        </div>
        <h4>${n.title}</h4>
      </div>
    `;
  });

  el.innerHTML = html;
}

/* ================= TRENDING ================= */
function populateTrendingNews(newsData) {
  const el = document.getElementById("trendingGrid");
  if (!el) return;

  let html = "";
  newsData.slice(5, 11).forEach(n => {
    html += `
      <div class="trending-item" onclick="openNews('${n._id}')">
        <div class="img-wrap">
          <img src="${getImage(n)}" alt="">
        </div>
        <h4>${n.title}</h4>
      </div>
    `;
  });

  el.innerHTML = html;
}

/* ================= BREAKING ================= */
function populateBreakingNews(newsData) {
  const el = document.getElementById("breakingNews");
  if (!el) return;

  let html = "";
  newsData.slice(0, 5).forEach(n => {
    html += `
      <div class="sidebar-item" onclick="openNews('${n._id}')">
        <div class="img-wrap">
          <img src="${getImage(n)}" alt="">
        </div>
        <h4>${n.title}</h4>
      </div>
    `;
  });

  el.innerHTML = html;
}

/* ================= MORE ================= */
function populateMoreNews(newsData) {
  const el = document.getElementById("moreNews");
  if (!el) return;

  let html = "";
  newsData.slice(11).forEach(n => {
    html += `
      <div class="sidebar-item" onclick="openNews('${n._id}')">
        <div class="img-wrap">
          <img src="${getImage(n)}" alt="">
        </div>
        <h4>${n.title}</h4>
      </div>
    `;
  });

  el.innerHTML = html;
}

/* ================= NAV ================= */
function openNews(id) {
  window.location.href = `news-detail.html?id=${id}`;
}

/* ================= ERRORS ================= */
function showNoNewsMessage() {
  ["topNewsContent", "trendingGrid", "breakingNews", "moreNews"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "<p>వార్తలు లేవు</p>";
  });
}

function showErrorMessage() {
  ["topNewsContent", "trendingGrid", "breakingNews", "moreNews"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "<p style='color:red'>Load failed</p>";
  });
}
