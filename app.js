const DEFAULTS={
  announcements:[
    {id:1,title:"Welcome to the MD-803 information hub",category:"General",priority:"Normal",message:"This website is the central place for program updates, resources, and cadet information."},
    {id:2,title:"Uniform information",category:"Reminders",priority:"Normal",message:"Check the Uniform of the Week page before uniform day."}
  ],
  events:[
    {id:1,title:"Uniform Day",type:"Unit Event",date:"2026-08-27",time:"",location:"",description:"Check the Uniform page for current requirements."},
    {id:2,title:"Cadet Staff Meeting",type:"Meeting",date:"2026-08-29",time:"",location:"",description:"Details to be confirmed by instructors."}
  ],
  uniform:{name:"Class B",date:"2026-08-27",notes:"Check the uniform page for complete requirements."},
  resources:[
    {id:1,title:"Cadet Handbook",category:"Forms & Documents",link:"",description:"Official handbook and program expectations."},
    {id:2,title:"Uniform Reference",category:"Uniform",link:"",description:"Approved uniform guides and reference material."}
  ],
  posts:[
    {id:1,author:"Cadet Staff",text:"Welcome to the MD-803 message board prototype."}
  ],
  settings:{siteName:"Gwynn Park High School AFJROTC MD-803",schoolYear:"2026–2027",publicMessage:"Excellence in All We Do"},
  activity:["Public site and sign-in restored"]
};

const $=id=>document.getElementById(id);
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let state;
try{state=JSON.parse(localStorage.getItem("md803_full_v8"))||structuredClone(DEFAULTS)}catch{state=structuredClone(DEFAULTS)}

function save(activity){
  if(activity)state.activity.unshift(activity);
  localStorage.setItem("md803_full_v8",JSON.stringify(state));
  renderAll();
}
function niceDate(date){
  if(!date)return{day:"--",month:"---",full:""};
  const d=new Date(date+"T12:00:00");
  return{day:String(d.getDate()).padStart(2,"0"),month:d.toLocaleString("en-US",{month:"short"}).toUpperCase(),full:d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})};
}
function showPublic(page){
  document.querySelectorAll(".public-page").forEach(p=>p.classList.remove("active"));
  $("public-"+page)?.classList.add("active");
  document.querySelectorAll("[data-public]").forEach(b=>b.classList.toggle("active",b.dataset.public===page));
  window.scrollTo(0,0);
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-public]");
  if(b)showPublic(b.dataset.public);
});
function announcementForm(){
  return `<form class="announcementForm">
    <label>Title<input name="title" required></label>
    <div class="row">
      <label>Category<select name="category">
        <option>General</option><option>Unit Events</option><option>Field Trips</option><option>Community Service</option><option>Reminders</option><option>Drill / Competitions</option><option>Other</option>
      </select></label>
      <label>Priority<select name="priority"><option>Normal</option><option>Important</option><option>Urgent</option></select></label>
    </div>
    <label>Message<textarea name="message" required></textarea></label>
    <button class="primary">Post Announcement</button>
  </form>`;
}
function renderPublic(){
  $("publicUniformName").textContent=state.uniform.name;
  $("publicUniformDate").textContent=niceDate(state.uniform.date).full;
  $("publicUniformNotes").textContent=state.uniform.notes;
  $("uniformName").textContent=state.uniform.name;
  $("uniformDate").textContent=niceDate(state.uniform.date).full;
  $("uniformNotes").textContent=state.uniform.notes;

  const cards=state.announcements.map(a=>`<article class="card"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p></article>`).join("");
  $("publicAnnouncements").innerHTML=cards||"<p>No announcements yet.</p>";
  $("publicHomeAnnouncements").innerHTML=state.announcements.slice(0,3).map(a=>`<article class="card"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p></article>`).join("");

  const events=[...state.events].sort((a,b)=>a.date.localeCompare(b.date));
  const eventHtml=events.map(e=>{const d=niceDate(e.date);return `<div class="event"><div class="date"><b>${d.day}</b><small>${d.month}</small></div><div><h3>${esc(e.title)}</h3><p>${esc(e.type)}${e.location?" • "+esc(e.location):""}${e.time?" • "+esc(e.time):""}<br>${esc(e.description)}</p></div></div>`}).join("");
  $("publicEvents").innerHTML=eventHtml||"<p>No events yet.</p>";
  $("publicHomeEvents").innerHTML=events.slice(0,3).map(e=>{const d=niceDate(e.date);return `<div class="event"><div class="date"><b>${d.day}</b><small>${d.month}</small></div><div><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p></div></div>`}).join("");

  $("publicPosts").innerHTML=state.posts.map(p=>`<article class="post"><b>${esc(p.author)}</b><p>${esc(p.text)}</p></article>`).join("");
  $("publicResources").innerHTML=state.resources.map(r=>`<article class="resource-card"><p class="eyebrow">${esc(r.category)}</p><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p>${r.link?`<a href="${esc(r.link)}" target="_blank" rel="noopener">Open resource →</a>`:""}</article>`).join("");
}
function showAdmin(){
  $("publicSite").classList.add("hidden");
  $("publicFooter").classList.add("hidden");
  document.querySelector(".public-header").classList.add("hidden");
  $("adminApp").classList.remove("hidden");
  showAdminPage("dashboard");
}
function showAdminPage(page){
  document.querySelectorAll(".admin-page").forEach(p=>p.classList.remove("active"));
  $("admin-"+page)?.classList.add("active");
  document.querySelectorAll("[data-admin]").forEach(b=>b.classList.toggle("active",b.dataset.admin===page));
  $("adminTitle").textContent=page==="dashboard"?"ADMIN DASHBOARD":page.toUpperCase();
  window.scrollTo(0,0);
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-admin]");
  if(b)showAdminPage(b.dataset.admin);
  const d=e.target.closest("[data-delete]");
  if(d){
    state[d.dataset.delete]=state[d.dataset.delete].filter(x=>String(x.id)!==d.dataset.id);
    save("Content removed");
  }
});
function renderAdmin(){
  $("dashboardAnnouncementForm").innerHTML=announcementForm();
  $("announcementFormPage").innerHTML=announcementForm();

  const stats=[["Announcements",state.announcements.length],["Events",state.events.length],["Resources",state.resources.length],["Board Posts",state.posts.length]];
  $("adminStats").innerHTML=stats.map(([n,v])=>`<div class="stat"><b>${v}</b><span>${n}</span></div>`).join("");

  $("recentAnnouncements").innerHTML=state.announcements.slice(0,4).map(a=>`<div class="manage"><div class="manage-head"><b>${esc(a.title)}</b><span class="tag">${esc(a.category)}</span></div><p>${esc(a.message)}</p></div>`).join("");

  $("allAnnouncements").innerHTML=state.announcements.map(a=>`<div class="manage"><div class="manage-head"><b>${esc(a.title)}</b><span class="tag">${esc(a.category)}</span><span class="actions"><button class="danger" data-delete="announcements" data-id="${a.id}">Delete</button></span></div><p>${esc(a.message)}</p></div>`).join("");

  const sorted=[...state.events].sort((a,b)=>a.date.localeCompare(b.date));
  const eh=sorted.map(e=>`<div class="manage"><div class="manage-head"><b>${esc(e.title)}</b><span class="tag">${esc(e.type)}</span><span class="actions"><button class="danger" data-delete="events" data-id="${e.id}">Delete</button></span></div><p>${esc(niceDate(e.date).full)} ${e.time?esc(e.time):""} ${e.location?"• "+esc(e.location):""}<br>${esc(e.description)}</p></div>`).join("");
  $("calendarOverview").innerHTML=eh;
  $("allEvents").innerHTML=eh;

  $("activityList").innerHTML=state.activity.slice(0,6).map(a=>`<div class="manage"><b>${esc(a)}</b></div>`).join("");
  $("adminPosts").innerHTML=state.posts.map(p=>`<div class="manage"><div class="manage-head"><b>${esc(p.author)}</b><span class="actions"><button class="danger" data-delete="posts" data-id="${p.id}">Remove</button></span></div><p>${esc(p.text)}</p></div>`).join("");
  $("adminResources").innerHTML=state.resources.map(r=>`<div class="manage"><div class="manage-head"><b>${esc(r.title)}</b><span class="tag">${esc(r.category)}</span><span class="actions"><button class="danger" data-delete="resources" data-id="${r.id}">Delete</button></span></div><p>${esc(r.description)}</p></div>`).join("");

  $("adminUniformName").value=state.uniform.name;
  $("adminUniformDate").value=state.uniform.date;
  $("adminUniformNotes").value=state.uniform.notes;
  $("siteName").value=state.settings.siteName;
  $("schoolYear").value=state.settings.schoolYear;
  $("publicMessage").value=state.settings.publicMessage;

  document.querySelectorAll(".announcementForm").forEach(form=>{
    form.onsubmit=e=>{
      e.preventDefault();
      const fd=new FormData(form);
      state.announcements.unshift({id:Date.now(),title:fd.get("title"),category:fd.get("category"),priority:fd.get("priority"),message:fd.get("message")});
      form.reset();
      save("Announcement posted");
    };
  });
}
function renderAll(){renderPublic();renderAdmin()}

$("signInBtn").onclick=()=>$("loginModal").classList.remove("hidden");
$("closeLogin").onclick=()=>$("loginModal").classList.add("hidden");
$("guestBtn").onclick=()=>{$("loginModal").classList.add("hidden");showPublic("home")};
$("adminLoginBtn").onclick=()=>{$("loginModal").classList.add("hidden");$("adminPinModal").classList.remove("hidden");setTimeout(()=>$("adminPin").focus(),50)};
$("closePin").onclick=()=>$("adminPinModal").classList.add("hidden");
$("submitPin").onclick=()=>{
  if($("adminPin").value.trim()==="8030"){
    $("adminPin").value="";
    $("adminPinModal").classList.add("hidden");
    showAdmin();
  }else{
    alert("Incorrect demo PIN.");
  }
};
$("cadetLoginBtn").onclick=()=>{$("loginModal").classList.add("hidden");$("cadetModal").classList.remove("hidden")};
$("closeCadet").onclick=()=>$("cadetModal").classList.add("hidden");
$("cadetDemoContinue").onclick=()=>{$("cadetModal").classList.add("hidden");alert("Cadet view is connected visually. Secure individual cadet accounts come next.")};

$("backToSite").onclick=()=>{
  $("adminApp").classList.add("hidden");
  $("publicSite").classList.remove("hidden");
  $("publicFooter").classList.remove("hidden");
  document.querySelector(".public-header").classList.remove("hidden");
  showPublic("home");
};
$("adminSignOut").onclick=$("backToSite").onclick;

$("eventForm").onsubmit=e=>{
  e.preventDefault();
  state.events.push({id:Date.now(),title:$("eventTitle").value.trim(),type:$("eventType").value,date:$("eventDate").value,time:$("eventTime").value,location:$("eventLocation").value.trim(),description:$("eventDescription").value.trim()});
  e.target.reset();
  save("Calendar event added");
};
$("uniformForm").onsubmit=e=>{
  e.preventDefault();
  state.uniform={name:$("adminUniformName").value,date:$("adminUniformDate").value,notes:$("adminUniformNotes").value.trim()};
  save("Uniform updated");
};
$("resourceForm").onsubmit=e=>{
  e.preventDefault();
  state.resources.push({id:Date.now(),title:$("resourceTitle").value.trim(),category:$("resourceCategory").value,link:$("resourceLink").value.trim(),description:$("resourceDescription").value.trim()});
  e.target.reset();
  save("Resource added");
};
$("settingsForm").onsubmit=e=>{
  e.preventDefault();
  state.settings={siteName:$("siteName").value.trim(),schoolYear:$("schoolYear").value.trim(),publicMessage:$("publicMessage").value.trim()};
  save("Settings updated");
};

renderAll();
