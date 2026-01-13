const API = location.hostname.includes("localhost")
 ? "http://localhost:3000"
 : "https://mediabuzz365.in";

async function loadAllNews(){
 try{
  const res = await fetch(`${API}/api/news`);
  const allNews = await res.json();

  const breaking = allNews.filter(
    n => n.category === "breaking"
  );

  renderBreaking(breaking);
  renderAll(allNews);

 }catch(err){
  console.error(err);
 }
}

/* BREAKING */
function renderBreaking(news){
 const box=document.getElementById("newsTrack");
 if(!box) return;

 box.innerHTML=news.map(n=>`
  <div class="news-item"
       onclick="openNews(event,'${n._id}')">
   🔴 ${n.title}
  </div>
 `).join("");
}

/* ALL */
function renderAll(news){
 const box=document.getElementById("allNews");
 if(!box) return;

 box.innerHTML=news.map(n=>`
  <article class="news-card"
           onclick="openNews(event,'${n._id}')">
   <img src="${API}${n.image}">
   <div>
    <span class="badge ${n.category}">
     ${n.category}
    </span>
    <h3>${n.title}</h3>
    <p>📍 ${n.city}</p>
    <small>${formatDate(n.date)}</small>
   </div>
  </article>
 `).join("");
}

/* FORCE NAVIGATION */
function openNews(e,id){
 e.stopPropagation();   // STOP header click
 e.preventDefault();    // STOP browser

 window.location.href =
  "news-detail.html?id=" + id;
}

/* DATE */
function formatDate(d){
 return new Date(d)
 .toLocaleString("te-IN");
}

document.addEventListener(
 "DOMContentLoaded",
 loadAllNews
);
