const token = localStorage.getItem("token");
if(!token) location.href="login.html";

/* PAGE HANDLER */
function show(id){

 document.querySelectorAll(".page")
 .forEach(p=>p.style.display="none");

 document.getElementById(id).style.display="block";

 // LOAD DATA BASED ON TAB
 if(id==="dashboard"){
  loadStats();
 }

 if(id==="pending"){
  loadPending();
 }

 if(id==="analytics"){
  chart();
 }

 setActive(id);
}


/* ACTIVE BUTTON */
function setActive(id){
 document.querySelectorAll(".side button")
 .forEach(b=>b.classList.remove("active"));

 const map={
  dashboard:0,
  pending:1,
  analytics:2
 };

 if(map[id]!==undefined){
  document.querySelectorAll(".side button")[map[id]]
   .classList.add("active");
 }

 // auto close sidebar on mobile
 if(window.innerWidth<768){
  toggleMenu(false);
 }
}

/* LOGOUT */
function logout(){
 localStorage.clear();
 location.href="login.html";
}

/* DASHBOARD STATS */
async function loadStats(){
 const res=await fetch("/api/news");
 const data=await res.json();

 total.innerText=data.length;
 pendingCount.innerText=
  data.filter(n=>n.status==="pending").length;
 approvedCount.innerText=
  data.filter(n=>n.status==="approved").length;
}

/* PENDING NEWS */
let currentId=null;

async function loadPending(){

 const res=await fetch("/api/news?status=pending");
 const data=await res.json();

 if(data.length===0){
  pendingList.innerHTML="<p>No pending news</p>";
  return;
 }

 pendingList.innerHTML=data.map(n=>`
  <div class="news" onclick='openModal(${JSON.stringify(n)})'>
   <h3>${n.title}</h3>
   <p>${n.city}</p>
   <small>Click to view</small>
  </div>
 `).join("");
}


function openModal(n){
 currentId=n._id;

 mTitle.innerText=n.title;
 mCity.innerText="📍 "+n.city;
 mDesc.innerText=n.description;
 mImage.src=n.image || "https://via.placeholder.com/400";

 document.getElementById("newsModal").style.display="flex";
}

function closeModal(){
 document.getElementById("newsModal").style.display="none";
}

async function rejectNews(id){

 await fetch("/api/news/reject/"+id,{
  method:"PATCH",
  headers:{
   Authorization:"Bearer "+token
  }
 });

 alert("Rejected");
 closeModal();
 loadPending();
 loadStats();
}


async function approve(id){
 await fetch("/api/news/approve/"+id,{
  method:"PATCH",
  headers:{
   Authorization:"Bearer "+token
  }
 });
 alert("Approved");
 loadPending();
 loadStats();
}

/* ANALYTICS */
async function chart(){
 const res=await fetch("/api/news");
 const d=await res.json();

 const cats={};
 d.forEach(n=>{
  cats[n.category]=(cats[n.category]||0)+1;
 });

 const ctx=document.getElementById("chart");

 new Chart(ctx,{
  type:"bar",
  data:{
   labels:Object.keys(cats),
   datasets:[{
    label:"News count",
    data:Object.values(cats)
   }]
  }
 });
}

/* ================= RESPONSIVE JS ================= */

/* CREATE HAMBURGER */
const burger=document.createElement("div");
burger.innerHTML="☰";
burger.style.cssText=`
 position:fixed;
 top:15px;
 left:15px;
 font-size:26px;
 cursor:pointer;
 z-index:999;
 display:none;
`;
document.body.appendChild(burger);

burger.onclick=()=>toggleMenu();

/* TOGGLE MENU */
function toggleMenu(force){
 const side=document.querySelector(".side");

 if(force===true){
  side.style.display="block";
 }
 else if(force===false){
  side.style.display="none";
 }
 else{
  side.style.display=
   side.style.display==="none"?"block":"none";
 }
}

/* SCREEN RESIZE HANDLER */
function handleResize(){
 const side=document.querySelector(".side");

 if(window.innerWidth<768){
  burger.style.display="block";
  side.style.display="none";
 }
 else{
  burger.style.display="none";
  side.style.display="block";
 }
}

window.addEventListener("resize",handleResize);

/* INIT */
show("dashboard");
loadStats();
loadPending();
chart();
handleResize();
