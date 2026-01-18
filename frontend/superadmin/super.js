/* ================= AUTH ================= */

const token = localStorage.getItem("token");
if(!token) location.href="login.html";

const headers={
 Authorization:"Bearer "+token
};

const API = location.hostname.includes("localhost")
 ? "http://localhost:3000"
 : "https://mediabuzz365.in";

/* ================= PAGE HANDLER ================= */

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
 localStorage.clear();
 location.href="login.html";
}

/* ================= DASHBOARD ================= */

async function loadStats(){

 const res=await fetch(
  API+"/api/news/admin/all",{headers}
 );

 const data=await res.json();

 total.innerText=data.length;

 pendingCount.innerText=
  data.filter(n=>n.status==="pending").length;

 approvedCount.innerText=
  data.filter(n=>n.status==="approved").length;
}

/* ================= PENDING ================= */

let pendingData=[];
let currentId=null;

async function loadPending(){

 const res=await fetch(
  API+"/api/news/admin/all?status=pending",
  {headers}
 );

 pendingData=await res.json();

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
}

function openModalByIndex(i){
 openModal(pendingData[i]);
}

function openModal(n){

 currentId=n._id;

 mTitle.innerText=n.title;
 mCity.innerText="📍 "+n.city;
 mDesc.innerText=n.description;
 mImage.src=n.image ||
  "https://via.placeholder.com/400";

 document.getElementById("newsModal")
 .style.display="flex";
}

function closeModal(){
 document.getElementById("newsModal")
 .style.display="none";
}

/* ================= APPROVE ================= */

async function approve(id){

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
}

/* ================= REJECT ================= */

async function rejectNews(id){

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
}

/* ================= ANALYTICS ================= */

let myChart=null;

async function drawChart(){

 if(myChart) myChart.destroy();

 const res=await fetch(
  API+"/api/news/admin/all",
  {headers}
 );

 const d=await res.json();

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
}

/* ================= ADMIN MANAGEMENT ================= */

const myId = JSON.parse(
 atob(token.split(".")[1])
).id;

const DISTRICTS = [
 // ANDHRA PRADESH (26)
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

 // TELANGANA (33)
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

let districtMap={};

async function loadAdmins(){

 const res = await fetch(
  API+"/api/users",
  {
   headers: {
    "Authorization": "Bearer " + token
   }
  }
 );

 const users = await res.json();

 adminList.innerHTML = users.map(u=>`
  <div class="news">
   <b>${u.name}</b>
   <p>${u.email}</p>
   <small>${u.role} | ${u.status}</small>

   ${
    u.role==="super_admin"
    ? "<p style='color:#28a745'>👑 Full Access</p>"
    : `
     <details>
      <summary>📍 Assign Districts (${u.districts?.length || 0} assigned)</summary>
      <div style="max-height:200px;overflow-y:auto;margin:10px 0">
       ${DISTRICTS.map(d=>`
        <label style="display:block;margin:5px 0">
         <input type="checkbox"
          ${u.districts?.includes(d)?"checked":""}
          onchange="toggleDistrict('${u._id}','${d}',this.checked)">
         ${d}
        </label>
       `).join("")}
      </div>
      <button onclick="saveDistricts('${u._id}')" style="background:#007bff;color:white;padding:8px 16px;border:none;cursor:pointer;border-radius:4px">💾 Save Districts</button>
     </details>
    `
   }

   ${
    u._id===myId
    ? "<small style='color:#ffc107'>⚠️ This is you</small>"
    : `
     <div style="margin-top:10px">
      ${u.status==="active"
       ? `<button onclick="blockUser('${u._id}')" style="background:#dc3545;color:white;padding:6px 12px;border:none;cursor:pointer;border-radius:4px;margin-right:5px">🚫 Block</button>`
       : `<button onclick="activateUser('${u._id}')" style="background:#28a745;color:white;padding:6px 12px;border:none;cursor:pointer;border-radius:4px;margin-right:5px">✅ Activate</button>`
      }
      <button onclick="deleteUser('${u._id}')" style="background:#6c757d;color:white;padding:6px 12px;border:none;cursor:pointer;border-radius:4px">🗑️ Delete</button>
     </div>
    `
   }
  </div>
 `).join("");
}

function toggleDistrict(userId, district, checked){
 if(!districtMap[userId]) {
  districtMap[userId] = [];
 }

 if(checked && !districtMap[userId].includes(district)) {
  districtMap[userId].push(district);
 }

 if(!checked) {
  districtMap[userId] = districtMap[userId].filter(d => d !== district);
 }
}

async function saveDistricts(userId){
 try {
  await fetch(
   API+"/api/users/districts/"+userId,
   {
    method:"PATCH",
    headers:{
     "Authorization": "Bearer " + token,
     "Content-Type":"application/json"
    },
    body:JSON.stringify({
     districts: districtMap[userId] || []
    })
   }
  );

  alert("District access updated successfully!");
  loadAdmins();
 } catch(err) {
  alert("Failed to update districts");
 }
}

async function blockUser(userId){
 if(!confirm("Block this admin?")) return;

 try {
  await fetch(
   API+"/api/users/block/"+userId,
   {
    method:"PATCH",
    headers: {
     "Authorization": "Bearer " + token
    }
   }
  );

  alert("Admin blocked successfully");
  loadAdmins();
 } catch(err) {
  alert("Failed to block admin");
 }
}

async function activateUser(userId){
 if(!confirm("Activate this admin?")) return;

 try {
  await fetch(
   API+"/api/users/activate/"+userId,
   {
    method:"PATCH",
    headers: {
     "Authorization": "Bearer " + token
    }
   }
  );

  alert("Admin activated successfully");
  loadAdmins();
 } catch(err) {
  alert("Failed to activate admin");
 }
}

async function deleteUser(userId){
 if(!confirm("Are you sure you want to delete this admin? This action cannot be undone.")) return;

 try {
  await fetch(
   API+"/api/users/"+userId,
   {
    method:"DELETE",
    headers: {
     "Authorization": "Bearer " + token
    }
   }
  );

  alert("Admin deleted successfully");
  loadAdmins();
 } catch(err) {
  alert("Failed to delete admin");
 }
}

/* CREATE NEW ADMIN */

function showCreateAdminModal(){
 document.getElementById("createAdminModal").style.display="flex";
}

function closeCreateAdminModal(){
 document.getElementById("createAdminModal").style.display="none";
 document.getElementById("createAdminForm").reset();
}

async function createAdmin(e){
 e.preventDefault();

 const name = document.getElementById("adminName").value.trim();
 const email = document.getElementById("adminEmail").value.trim();
 const password = document.getElementById("adminPassword").value;

 // Validate inputs
 if(!name || !email || !password){
  alert("Please fill all fields");
  return;
 }

 if(password.length < 6){
  alert("Password must be at least 6 characters");
  return;
 }

 try {
  const res = await fetch(
   API+"/api/users/create-admin",
   {
    method:"POST",
    headers:{
     "Authorization": "Bearer " + token,
     "Content-Type":"application/json"
    },
    body:JSON.stringify({
     name,
     email,
     password,
     role: "admin"
    })
   }
  );

  const data = await res.json();

  if(res.ok){
   alert(`Admin created successfully!\n\nCredentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease share these credentials with the admin.`);
   closeCreateAdminModal();
   loadAdmins();
  } else {
   alert(data.message || "Failed to create admin");
  }
 } catch(err) {
  alert("Failed to create admin");
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

 if(force===true){
  side.style.display="block";
 }
 else if(force===false){
  side.style.display="none";
 }
 else{
  side.style.display=
   side.style.display==="none"
   ?"block":"none";
 }
}

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

window.addEventListener(
 "resize",handleResize);

/* ================= INIT ================= */

show("dashboard");
loadStats();
loadPending();
drawChart();
handleResize();