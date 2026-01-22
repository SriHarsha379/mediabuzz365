// API Configuration
const API = location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://mediabuzz365.in";

// Pick safe image
function getImage(news) {
  if (news.images && news.images.length > 0) {
    return API + news.images[0]; // first image
  }
  if (news.image) {
    return API + news.image; // fallback old data
  }
  return "https://via.placeholder.com/800x400?text=No+Image";
}

// Load all news when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadAllNews();
});

async function loadAllNews() {
  try {
    const response = await fetch(`${API}/api/news`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allNews = await response.json();

    if (!allNews || allNews.length === 0) {
      showNoNewsMessage();
      return;
    }

    // Sort by date (newest first)
    allNews.sort((a, b) => new Date(b.date) - new Date(a.date));

    const breakingNews = allNews.filter(n => n.category === "breaking");

    populateTopNews(allNews);
    populateTrendingNews(allNews);
    populateBreakingNews(breakingNews.length ? breakingNews : allNews);
    populateMoreNews(allNews);

  } catch (error) {
    console.error('Error loading news:', error);
    showErrorMessage();
  }
}

/* ================= TOP NEWS ================= */
function populateTopNews(newsData) {
  const topNewsContent = document.getElementById('topNewsContent');
  if (!topNewsContent) return;

  if (!newsData.length) {
    topNewsContent.innerHTML = '<p>వార్తలు లేవు</p>';
    return;
  }

  const topItems = newsData.slice(0, 5);
  let html = '';

  const mainNews = topItems[0];
  html += `
    <div class="news-main" onclick="openNews('${mainNews._id}')">
      <img src="${getImage(mainNews)}">
      <h3>${mainNews.title}</h3>
    </div>
  `;

  topItems.slice(1).forEach(news => {
    html += `
      <div class="news-side" onclick="openNews('${news._id}')">
        <img src="${getImage(news)}">
        <h4>${news.title}</h4>
      </div>
    `;
  });

  topNewsContent.innerHTML = html;
}

/* ================= TRENDING ================= */
function populateTrendingNews(newsData) {
  const grid = document.getElementById('trendingGrid');
  if (!grid) return;

  const trendingItems = newsData.slice(5, 11);
  let html = '';

  trendingItems.forEach(news => {
    html += `
      <div class="trending-item" onclick="openNews('${news._id}')">
        <img src="${getImage(news)}">
        <h4>${news.title}</h4>
      </div>
    `;
  });

  grid.innerHTML = html;
}

/* ================= BREAKING ================= */
function populateBreakingNews(newsData) {
  const breakingNews = document.getElementById('breakingNews');
  if (!breakingNews) return;

  const breakingItems = newsData.slice(0, 5);
  let html = '';

  breakingItems.forEach(news => {
    html += `
      <div class="sidebar-item" onclick="openNews('${news._id}')">
        <img src="${getImage(news)}">
        <h4>${news.title}</h4>
      </div>
    `;
  });

  breakingNews.innerHTML = html;
}

/* ================= MORE ================= */
function populateMoreNews(newsData) {
  const moreNews = document.getElementById('moreNews');
  if (!moreNews) return;

  const moreItems = newsData.slice(11, 16);
  let html = '';

  moreItems.forEach(news => {
    html += `
      <div class="sidebar-item" onclick="openNews('${news._id}')">
        <img src="${getImage(news)}">
        <h4>${news.title}</h4>
      </div>
    `;
  });

  moreNews.innerHTML = html;
}

/* ================= NAV ================= */
function openNews(newsId) {
  window.location.href = `news-detail.html?id=${newsId}`;
}

/* ================= ERRORS ================= */
function showNoNewsMessage() {
  ['topNewsContent','trendingGrid','breakingNews','moreNews']
  .forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.innerHTML="<p>వార్తలు లేవు</p>";
  });
}

function showErrorMessage() {
  ['topNewsContent','trendingGrid','breakingNews','moreNews']
  .forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.innerHTML="<p style='color:red'>Load failed</p>";
  });
}
