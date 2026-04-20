/* ================= AUTH ================= */

const token = localStorage.getItem("token");

if(!token){
 location.href="/superadmin/login.html";
}

const headers = {
 Authorization: "Bearer " + token
};

const API = window.location.origin;

function escapeHTML(value){
 return String(value ?? "")
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;")
  .replace(/'/g,"&#39;");
}

/* ================= PAGE HANDLER ================= */
/* DISTRICTS is defined in districts.js, loaded before this script */


function show(id){

 document.querySelectorAll(".page")
 .forEach(p=>p.style.display="none");

 document.getElementById(id).style.display="block";

 if(id==="dashboard") loadStats();
 if(id==="pending") loadPending();
 if(id==="analytics") drawChart();
 if(id==="admins") loadAdmins();
 if(id==="youtube" && typeof window.loadYoutube === "function") window.loadYoutube();

 setActive(id);
}

/* ACTIVE MENU */

function setActive(id){

 document.querySelectorAll(".side button")
 .forEach(b=>b.classList.remove("active"));

 const map={
  dashboard:0,
  pending:1,
  analytics:2,
  admins:3,
  youtube:4
 };

 if(map[id]!==undefined){
  document.querySelectorAll(".side button")[map[id]]
   .classList.add("active");
 }

 if(window.innerWidth<768) toggleMenu(false);
}

/* ================= LOGOUT ================= */

function logout(){
 localStorage.removeItem("token"); // ❌ no clear()
 location.href="/superadmin/login.html";
}

/* ================= DASHBOARD ================= */

function setStats(t, p, a){
 document.getElementById("total").innerText = t;
 document.getElementById("pendingCount").innerText = p;
 document.getElementById("approvedCount").innerText = a;
}

async function loadStats(){

 try{
  const statsRes = await fetch(
   API+"/api/news/admin/stats",
   { headers }
  );

  if(statsRes.ok){
   const data = await statsRes.json();
   setStats(data.total ?? 0, data.pending ?? 0, data.approved ?? 0);
   return;
  }

  if(statsRes.status===401 || statsRes.status===403){
   logout();
   return;
  }

  // Fallback: derive counts from full list if stats route fails in some deployments
  const allRes = await fetch(
   API+"/api/news/admin/all",
   { headers }
  );

  if(!allRes.ok){
   setStats(0,0,0);
   return;
  }

  const allNews = await allRes.json();
  const list = Array.isArray(allNews) ? allNews : [];

  const counts = list.reduce((acc, n)=>{
   if(n.status==="pending") acc.pending += 1;
   if(n.status==="approved") acc.approved += 1;
   return acc;
  },{ pending:0, approved:0 });

  setStats(list.length, counts.pending, counts.approved);

 }catch(err){
  console.error("loadStats error:",err);
  setStats(0,0,0);
 }
}

/* ================= PENDING ================= */

let pendingData=[];
let currentId=null;

async function loadPending(){

 try{
  const pendingListEl = document.getElementById("pendingList");
  if(!pendingListEl) return;

  const res = await fetch(
   API+"/api/news/admin/all?status=pending",
   { headers }
  );

  if(!res.ok){
   pendingListEl.innerHTML="<p>Failed to load pending news</p>";
   return;
  }

  pendingData = await res.json();

  if(!pendingData.length){
   pendingListEl.innerHTML="<p>No pending news</p>";
   return;
  }

  pendingListEl.innerHTML = pendingData.map((n,i)=>{
   const safeTitle = escapeHTML(n.title);
   const safeCity = escapeHTML(n.city);
   return `
    <div class="news" onclick="openModalByIndex(${i})">
     <h3>${safeTitle}</h3>
     <p>${safeCity}</p>
     <small>Click to view</small>
    </div>
   `;
  }).join("");

 }catch(err){
  console.error("loadPending error:",err);
  const pendingListEl = document.getElementById("pendingList");
  if(pendingListEl){
   pendingListEl.innerHTML="<p>Failed to load pending news</p>";
  }
 }
}

function openModalByIndex(i){
 openModal(pendingData[i]);
}

function openModal(n){

 currentId=n._id;

 mTitle.innerText=n.title;
 mCity.innerText="📍 "+n.city;
 mDesc.innerText=n.description;
const img =
  n.images && n.images.length
    ? n.images[0]
    : null;

mImage.src = img
  ? (img.startsWith("http") ? img : API + img)
  : "https://via.placeholder.com/400";


 document.getElementById("newsModal")
 .style.display="flex";
}

function closeModal(){
 document.getElementById("newsModal")
 .style.display="none";
}

/* ================= APPROVE ================= */

async function approve(id){

 try{
  await fetch(
   API+"/api/news/approve/"+id,{
    method:"PATCH",
    headers
   }
  );

  alert("Approved successfully");
  closeModal();
  loadPending();
  loadStats();

 }catch(err){
  alert("Approval failed");
 }
}

/* ================= REJECT ================= */

async function rejectNews(id){

 try{
  await fetch(
   API+"/api/news/reject/"+id,{
    method:"PATCH",
    headers
   }
  );

  alert("Rejected successfully");
  closeModal();
  loadPending();
  loadStats();

 }catch(err){
  alert("Reject failed");
 }
}

/* ================= ANALYTICS ================= */

let myChart=null;

async function drawChart(){

 try{
  if(myChart) myChart.destroy();

  const res = await fetch(
   API+"/api/news/admin/all",
   { headers }
  );

  if(!res.ok) return;

  const d = await res.json();

  const cats={};

  d.forEach(n=>{
   cats[n.category]=(cats[n.category]||0)+1;
  });

  const ctx=document
  .getElementById("chart");

  myChart=new Chart(ctx,{
   type:"bar",
   data:{
    labels:Object.keys(cats),
    datasets:[{
     label:"News count",
     data:Object.values(cats)
    }]
   }
  });

 }catch(err){
  console.error("drawChart error:",err);
 }
}

/* ================= ADMIN MANAGEMENT ================= */

let myId;
try {
 // JWTs use base64url; atob() needs standard base64 with padding
 const b64 = token.split(".")[1]
  .replace(/-/g, "+")
  .replace(/_/g, "/");
 const paddingNeeded = (4 - b64.length % 4) % 4;
 const padded = b64 + "=".repeat(paddingNeeded);
 myId = JSON.parse(atob(padded)).id;
} catch(e) {
 console.warn("Could not parse JWT payload:", e);
}

let districtMap={};

async function loadAdmins(){

 try{
  const adminListEl = document.getElementById("adminList");
  if(!adminListEl) return;

  const res = await fetch(API+"/api/users",{ headers });
  if(!res.ok){
   adminListEl.innerHTML="<p>Failed to load admins</p>";
   return;
  }

  const users = await res.json();

  adminListEl.innerHTML = users.map(u=>{
   const safeName = escapeHTML(u.name);
   const safeEmail = escapeHTML(u.email);
   const safePhone = escapeHTML(u.phone || "N/A");
   const safeAadhaar = escapeHTML(u.aadhaar || "N/A");
   const safeRole = escapeHTML(u.role);
   const safeStatus = escapeHTML(u.status);
   const safeCreatedAt = escapeHTML(new Date(u.createdAt).toLocaleString());

   return `
   <div class="news">

    <b>👤 Candidate Name:</b> ${safeName}<br>
    <b>📧 Email:</b> ${safeEmail}<br>

    <div class="meta">
     📞 Phone: <b>${safePhone}</b><br>
     🆔 Aadhaar: <b>${safeAadhaar}</b><br>
     🗓 Registered On:
      <b>${safeCreatedAt}</b><br>
     🏷 Role: <b>${safeRole}</b><br>
     🔖 Status: <b>${safeStatus}</b>
    </div>

    ${
     u.role==="super_admin"
     ? "<p style='color:#28a745'>👑 Full Access</p>"
     : `
<details>
 <summary>📍 Assign Districts (${u.districts?.length || 0})</summary>

 <!-- SEARCH -->
 <input
  type="text"
  placeholder="Search district..."
  onkeyup="filterDistricts(this,'${u._id}')"
  style="width:100%;padding:6px;border-radius:6px;border:1px solid #ccc;margin:8px 0">

 <div class="district-box" id="dist-${u._id}"
  style="max-height:220px;overflow-y:auto">

  <b>📍 ANDHRA PRADESH</b>
  ${DISTRICTS.slice(0,26).map(d=>`
   <label class="dist-item">
    <input type="checkbox"
     ${u.districts?.includes(d)?"checked":""}
     onchange="toggleDistrict('${u._id}','${d}',this.checked)">
    ${d}
   </label>
  `).join("")}

  <hr>

  <b>📍 TELANGANA</b>
  ${DISTRICTS.slice(26).map(d=>`
   <label class="dist-item">
    <input type="checkbox"
     ${u.districts?.includes(d)?"checked":""}
     onchange="toggleDistrict('${u._id}','${d}',this.checked)">
    ${d}
   </label>
  `).join("")}

 </div>

 <button onclick="saveDistricts('${u._id}')">💾 Save</button>
</details>

     `
    }

    ${
     u._id===myId
     ? "<small style='color:#ffc107'>⚠️ This is you</small>"
     : `
      <div style="margin-top:10px">
       ${u.status==="active"
        ? `<button onclick="blockUser('${u._id}')">🚫 Block</button>`
        : `<button onclick="activateUser('${u._id}')">✅ Activate</button>`
       }
       <button onclick="deleteUser('${u._id}')">🗑️ Delete</button>
      </div>
     `
    }

   </div>
   `;
  }).join("");

 }catch(err){
  console.error("loadAdmins error:",err);
  const adminListEl = document.getElementById("adminList");
  if(adminListEl){
   adminListEl.innerHTML="<p>Failed to load admins</p>";
  }
 }
}


function toggleDistrict(userId, district, checked){
 if(!districtMap[userId]) districtMap[userId]=[];

 if(checked && !districtMap[userId].includes(district)){
  districtMap[userId].push(district);
 }

 if(!checked){
  districtMap[userId] =
   districtMap[userId].filter(d=>d!==district);
 }
}

function filterDistricts(input,id){

 const value=input.value.toLowerCase();

 document.querySelectorAll(
  "#dist-"+id+" .dist-item"
 ).forEach(el=>{
  el.style.display=
   el.innerText.toLowerCase().includes(value)
   ?"block":"none";
 });
}

async function saveDistricts(userId){

 try{
  await fetch(
   API+"/api/users/districts/"+userId,
   {
    method:"PATCH",
    headers:{
     ...headers,
     "Content-Type":"application/json"
    },
    body:JSON.stringify({
     districts: districtMap[userId]||[]
    })
   }
  );

  alert("Districts updated");
  loadAdmins();

 }catch(err){
  alert("Update failed");
 }
}

/* ================= DELETE USER ================= */

async function deleteUser(id){

 if(!confirm("Are you sure you want to delete this admin?")){
  return;
 }

 try{
  const res = await fetch(
   API+"/api/users/"+id,
   {
    method:"DELETE",
    headers
   }
  );

  const data = await res.json();

  alert(data.message || "Deleted");
  loadAdmins();

 }catch(err){
  alert("Delete failed");
 }
}

/* ================= BLOCK USER ================= */

async function blockUser(id){

 if(!confirm("Block this admin?")) return;

 try{
  const res = await fetch(
   API+"/api/users/block/"+id,
   {
    method:"PATCH",
    headers
   }
  );

  const data = await res.json();
  alert(data.message);
  loadAdmins();

 }catch(err){
  alert("Block failed");
 }
}

/* ================= ACTIVATE USER ================= */

async function activateUser(id){

 try{
  const res = await fetch(
   API+"/api/users/activate/"+id,
   {
    method:"PATCH",
    headers
   }
  );

  const data = await res.json();
  alert(data.message);
  loadAdmins();

 }catch(err){
  alert("Activate failed");
 }
}

/* ================= MOBILE MENU ================= */

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

function toggleMenu(force){

 const side=document.querySelector(".side");

 if(force===true) side.style.display="block";
 else if(force===false) side.style.display="none";
 else{
  side.style.display =
   side.style.display==="none"
   ?"block":"none";
 }
}

function handleResize(){

 const side=document.querySelector(".side");

 if(window.innerWidth<768){
  burger.style.display="block";
  side.style.display="none";
 }else{
  burger.style.display="none";
  side.style.display="block";
 }
}

window.addEventListener("resize",handleResize);

/* ================= INIT ================= */

show("dashboard");
handleResize();
