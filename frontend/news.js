const API = location.hostname.includes("localhost")
 ? "http://localhost:3000"
 : "https://mediabuzz365.in";

async function loadAllNews(){
 try{
  const res = await fetch(`${API}/api/news`);
  const allNews = await res.json();

  console.log("Loaded:", allNews);

  const breaking = allNews.filter(
    n => n.category === "breaking"
  );

  displayBreakingNews(breaking);
  displayAllNews(allNews);

 }catch(err){
  console.error("Load error:", err);
 }
}

/* BREAKING */
function displayBreakingNews(news){
 const track=document.getElementById("newsTrack");
 if(!track) return;

 if(!news.length){
  track.innerHTML="<div>No breaking news</div>";
  return;
 }

 track.innerHTML=news.map(n=>`
  <div class="news-item">
   🔴 <a href="news-detail.html?id=${n.id}">
   ${n.title}
   </a>
  </div>
 `).join("");
}

/* ALL NEWS */
function displayAllNews(news){
 const box=document.getElementById("allNews");
 if(!box) return;

 if(!news.length){
  box.innerHTML="<p>No news</p>";
  return;
 }

 box.innerHTML=news.map(n=>`
  <article class="news-card">
   <a href="news-detail.html?id=${n.id}">
    <img src="${API}${n.image}">
    <div>
     <span class="badge ${n.category}">
      ${n.category}
     </span>
     <h3>${n.title}</h3>
     <p>📍 ${n.city}</p>
     <small>${formatDate(n.date)}</small>
    </div>
   </a>
  </article>
 `).join("");
}

/* DATE */
function formatDate(d){
 return new Date(d).toLocaleString("te-IN");
}

document.addEventListener("DOMContentLoaded",loadAllNews);
