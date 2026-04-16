const token = localStorage.getItem("token");
if(!token) location.href="login.html";

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


let map={};

fetch("/api/users",{
 headers:{Authorization:"Bearer "+token}
})
.then(r=>r.json())
.then(users=>{

 list.innerHTML=users.map(u=>`

 <div class="news">
  <b>${u.name}</b>
  <p>${u.email}</p>
  <small>${u.role} | ${u.status}</small>

  ${
   u.role==="super_admin"
   ? "<p>👑 Full access</p>"
   : `
    <details>
     <summary>Assign Districts</summary>

     ${DISTRICTS.map(d=>`
      <label>
       <input type="checkbox"
        ${u.districts?.includes(d)?"checked":""}
        onchange="toggle('${u._id}','${d}',this.checked)">
       ${d}
      </label>
     `).join("<br>")}

     <br>
     <button onclick="save('${u._id}')">💾 Save</button>
    </details>
   `
  }

  ${
   u._id===myId
   ? "<small>⚠ You</small>"
   : `
    <button onclick="block('${u._id}')">Block</button>
    <button onclick="activate('${u._id}')">Activate</button>
   `
  }

 </div>

 `).join("");
});

/* track changes */
function toggle(id,d,val){
 if(!map[id]) map[id]=[];
 if(val && !map[id].includes(d)) map[id].push(d);
 if(!val) map[id]=map[id].filter(x=>x!==d);
}

/* save districts */
function save(id){
 fetch("/api/users/districts/"+id,{
  method:"PATCH",
  headers:{
   Authorization:"Bearer "+token,
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   districts:map[id]
  })
 })
 .then(()=>alert("District access updated"));
}

/* block */
function block(id){
 fetch("/api/users/block/"+id,{
  method:"PATCH",
  headers:{Authorization:"Bearer "+token}
 }).then(()=>location.reload());
}

/* activate */
function activate(id){
 fetch("/api/users/activate/"+id,{
  method:"PATCH",
  headers:{Authorization:"Bearer "+token}
 }).then(()=>location.reload());
}
