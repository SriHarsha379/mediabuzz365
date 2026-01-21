// API Configuration
const API = location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://mediabuzz365.in";

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

    // Get different categories
    const breakingNews = allNews.filter(n => n.category === "breaking");
    const sportsNews = allNews.filter(n => n.category === "sports");

    // Populate all sections
    populateTopNews(allNews);
    populateTrendingNews(allNews);
    populateBreakingNews(breakingNews.length > 0 ? breakingNews : allNews);
    populateMoreNews(allNews);

  } catch (error) {
    console.error('Error loading news:', error);
    showErrorMessage();
  }
}

// TOP NEWS SECTION (main + 4 side items)
function populateTopNews(newsData) {
  const topNewsContent = document.getElementById('topNewsContent');
  if (!topNewsContent) return;

  if (newsData.length === 0) {
    topNewsContent.innerHTML = '<p style="padding: 20px; text-align: center;">వార్తలు లేవు</p>';
    return;
  }

  const topItems = newsData.slice(0, 5);
  let html = '';

  // Main news (first item - full width)
  if (topItems.length > 0) {
    const mainNews = topItems[0];
    html += `
      <div class="news-main" onclick="openNews('${mainNews._id}')">
        <img src="${API}${mainNews.image}" alt="${mainNews.title}" onerror="this.src='https://via.placeholder.com/800x280?text=No+Image'">
        <h3>${mainNews.title}</h3>
      </div>
    `;
  }

  // Side news (remaining 4 items)
  topItems.slice(1).forEach(news => {
    html += `
      <div class="news-side" onclick="openNews('${news._id}')">
        <img src="${API}${news.image}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/400x160?text=No+Image'">
        <h4>${news.title}</h4>
      </div>
    `;
  });

  topNewsContent.innerHTML = html;
}

// TRENDING NEWS SECTION (6 items in 3 columns)
function populateTrendingNews(newsData) {
  const trendingGrid = document.getElementById('trendingGrid');
  if (!trendingGrid) return;

  if (newsData.length === 0) {
    trendingGrid.innerHTML = '<p style="padding: 20px; text-align: center;">వార్తలు లేవు</p>';
    return;
  }

  // Get 6 trending items (skip the first 5 used in top news)
  const trendingItems = newsData.slice(5, 11);
  
  let html = '';
  trendingItems.forEach(news => {
    html += `
      <div class="trending-item" onclick="openNews('${news._id}')">
        <img src="${API}${news.image}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/300x140?text=No+Image'">
        <h4>${news.title}</h4>
      </div>
    `;
  });

  trendingGrid.innerHTML = html;
}

// BREAKING NEWS SIDEBAR (list with small images)
function populateBreakingNews(newsData) {
  const breakingNews = document.getElementById('breakingNews');
  if (!breakingNews) return;

  if (newsData.length === 0) {
    breakingNews.innerHTML = '<p style="padding: 10px; text-align: center;">వార్తలు లేవు</p>';
    return;
  }

  // Get first 5 breaking news
  const breakingItems = newsData.slice(0, 5);
  
  let html = '';
  breakingItems.forEach(news => {
    html += `
      <div class="sidebar-item" onclick="openNews('${news._id}')">
        <img src="${API}${news.image}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/80x60?text=No+Image'">
        <h4>${news.title}</h4>
      </div>
    `;
  });

  breakingNews.innerHTML = html;
}

// MORE NEWS SIDEBAR (list with small images)
function populateMoreNews(newsData) {
  const moreNews = document.getElementById('moreNews');
  if (!moreNews) return;

  if (newsData.length === 0) {
    moreNews.innerHTML = '<p style="padding: 10px; text-align: center;">వార్తలు లేవు</p>';
    return;
  }

  // Get different set of news (skip first 11)
  const moreItems = newsData.slice(11, 16);
  
  let html = '';
  moreItems.forEach(news => {
    html += `
      <div class="sidebar-item" onclick="openNews('${news._id}')">
        <img src="${API}${news.image}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/80x60?text=No+Image'">
        <h4>${news.title}</h4>
      </div>
    `;
  });

  moreNews.innerHTML = html;
}

// Navigation helper
function openNews(newsId) {
  window.location.href = `news-detail.html?id=${newsId}`;
}

// Error handlers
function showNoNewsMessage() {
  const sections = ['topNewsContent', 'trendingGrid', 'breakingNews', 'moreNews'];
  sections.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.innerHTML = '<p style="padding: 20px; text-align: center;">ప్రస్తుతం వార్తలు అందుబాటులో లేవు</p>';
    }
  });
}

function showErrorMessage() {
  const sections = ['topNewsContent', 'trendingGrid', 'breakingNews', 'moreNews'];
  sections.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.innerHTML = '<p style="padding: 20px; text-align: center; color: #dc2626;">వార్తలను లోడ్ చేయడంలో లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.</p>';
    }
  });
}