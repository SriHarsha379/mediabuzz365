/* ================= AUTH ================= */

const token = localStorage.getItem("token");

if(!token){
 location.href="/superadmin/login.html";
}

const headers = {
 Authorization: "Bearer " + token
};

const API = location.hostname.includes("localhost")
 ? "http://localhost:3000"
 : "https://mediabuzz365.in";

/* ================= PAGE HANDLER ================= */
/* ================= DISTRICTS ================= */

const DISTRICTS = [

 // ANDHRA PRADESH
 "Srikakulam",
 "Parvathipuram Manyam",
 "Vizianagaram",
 "Visakhapatnam",
 "Anakapalli",
 "Alluri Sitharama Raju",
 "Kakinada",
 "Dr. B.R. Ambedkar Konaseema",
 "East Godavari",
 "Eluru",
 "West Godavari",
 "NTR",
 "Krishna",
 "Guntur",
 "Palnadu",
 "Bapatla",
 "Prakasam",
 "Sri Potti Sriramulu Nellore",
 "Kurnool",
 "Nandyal",
 "Anantapur",
 "Sri Sathya Sai",
 "YSR Kadapa",
 "Annamayya",
 "Tirupati",
 "Chittoor",

 // TELANGANA
 "Adilabad",
 "Bhadradri Kothagudem",
 "Hanumakonda",
 "Hyderabad",
 "Jagtial",
 "Jangaon",
 "Jayashankar Bhupalpally",
 "Jogulamba Gadwal",
 "Kamareddy",
 "Karimnagar",
 "Khammam",
 "Kumuram Bheem Asifabad",
 "Mahabubabad",
 "Mahabubnagar",
 "Mancherial",
 "Medak",
 "Medchal Malkajgiri",
 "Mulugu",
 "Nagarkurnool",
 "Nalgonda",
 "Narayanpet",
 "Nirmal",
 "Nizamabad",
 "Peddapalli",
 "Rajanna Sircilla",
 "Rangareddy",
 "Sangareddy",
 "Siddipet",
 "Suryapet",
 "Vikarabad",
 "Wanaparthy",
 "Warangal",
 "Yadadri Bhuvanagiri"
];

function show(id){

 document.querySelectorAll(".page")
 .forEach(p=>p.style.display="none");

 document.getElementById(id).style.display="block";

 if(id==="dashboard") loadStats();
 if(id==="pending") loadPending();
 if(id==="analytics") drawChart();
 if(id==="admins") loadAdmins();

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
  admins:3
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

async function loadStats(){

 try{
  const res = await fetch(
   API+"/api/news/admin/all",
   { headers }
  );

  if(!res.ok){
   if(res.status===401 || res.status===403){
    logout();
   }
   return;
  }

  const data = await res.json();

  total.innerText = data.length;

  pendingCount.innerText =
   data.filter(n=>n.status==="pending").length;

  approvedCount.innerText =
   data.filter(n=>n.status==="approved").length;

 }catch(err){
  console.error("loadStats error:",err);
 }
}

/* ================= PENDING ================= */

let pendingData=[];
let currentId=null;

async function loadPending(){

 try{
  const res = await fetch(
   API+"/api/news/admin/all?status=pending",
   { headers }
  );

  if(!res.ok) return;

  pendingData = await res.json();

  if(!pendingData.length){
   pendingList.innerHTML="<p>No pending news</p>";
   return;
  }

  pendingList.innerHTML="";

  pendingData.forEach((n,i)=>{
   pendingList.innerHTML+=`
    <div class="news" onclick="openModalByIndex(${i})">
     <h3>${n.title}</h3>
     <p>${n.city}</p>
     <small>Click to view</small>
    </div>
   `;
  });

 }catch(err){
  console.error("loadPending error:",err);
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
const BASE_URL = "https://mediabuzz365.in";

mImage.src = n.image
  ? (n.image.startsWith("http") ? n.image : BASE_URL + n.image)
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

const myId = JSON.parse(
 atob(token.split(".")[1])
).id;

let districtMap={};

async function loadAdmins(){

 try{
  const res = await fetch(API+"/api/users",{ headers });
  if(!res.ok) return;

  const users = await res.json();

  adminList.innerHTML = users.map(u=>`
   <div class="news">

    <b>👤 Candidate Name:</b> ${u.name}<br>
    <b>📧 Email:</b> ${u.email}<br>

    <div class="meta">
     📞 Phone: <b>${u.phone || "N/A"}</b><br>
     🆔 Aadhaar: <b>${u.aadhaar || "N/A"}</b><br>
     🗓 Registered On:
      <b>${new Date(u.createdAt).toLocaleString()}</b><br>
     🏷 Role: <b>${u.role}</b><br>
     🔖 Status: <b>${u.status}</b>
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
  `).join("");

 }catch(err){
  console.error("loadAdmins error:",err);
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
loadStats();
loadPending();
drawChart();
handleResize();
