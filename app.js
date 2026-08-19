const SUPABASE_URL="https://usoqblqosmnqsogddgtc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

const $=id=>document.getElementById(id);
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let sessionUser=null,currentProfile=null,announcements=[],events=[],resources=[],posts=[],activeUniform=null,profiles=[];

function niceDate(date){
  if(!date)return{day:"--",month:"---",full:""};
  const d=new Date(date+"T12:00:00");
  return{
    day:String(d.getDate()).padStart(2,"0"),
    month:d.toLocaleString("en-US",{month:"short"}).toUpperCase(),
    full:d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
  };
}

function showPublic(page){
  $("adminApp").classList.add("hidden");
  $("publicSite").classList.remove("hidden");
  $("publicFooter").classList.remove("hidden");
  document.querySelector(".public-header").classList.remove("hidden");
  document.querySelectorAll(".public-page").forEach(p=>p.classList.remove("active"));
  $("public-"+page)?.classList.add("active");
  document.querySelectorAll("[data-public]").forEach(b=>b.classList.toggle("active",b.dataset.public===page));
  window.scrollTo(0,0);
}

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-public]");
  if(b)showPublic(b.dataset.public);
});

async function loadPublicData(){
  const [a,e,u,r,p]=await Promise.all([
    sb.from("announcements").select("*").order("created_at",{ascending:false}),
    sb.from("events").select("*").order("event_date",{ascending:true}),
    sb.from("uniforms").select("*").eq("active",true).order("updated_at",{ascending:false}).limit(1),
    sb.from("resources").select("*").order("created_at",{ascending:false}),
    sb.from("message_posts").select("*").eq("approved",true).order("created_at",{ascending:false})
  ]);

  if(!a.error)announcements=a.data||[];
  if(!e.error)events=e.data||[];
  if(!u.error)activeUniform=(u.data||[])[0]||null;
  if(!r.error)resources=r.data||[];
  if(!p.error)posts=p.data||[];

  renderPublic();
}

async function loadSession(){
  const {data:{session}}=await sb.auth.getSession();
  sessionUser=session?.user||null;
  currentProfile=null;

  if(sessionUser){
    const {data}=await sb.from("profiles").select("*").eq("id",sessionUser.id).single();
    currentProfile=data||null;
  }
  renderAuth();
}

function renderAuth(){
  const signedIn=!!sessionUser;
  $("signInBtn").textContent=signedIn?(currentProfile?.full_name||sessionUser.email||"Account"):"Sign In";
  if($("quickSignIn"))$("quickSignIn").textContent=signedIn?"My Account":"Sign In";
  $("publicPostForm").classList.toggle("hidden",!signedIn);
  $("boardNotice").textContent=signedIn?`Signed in as ${currentProfile?.full_name||sessionUser.email}.`:"Guest view is read-only.";
}

function renderPublic(){
  const u=activeUniform||{uniform_name:"Not posted",wear_date:null,notes:"Uniform information has not been posted yet."};

  $("publicUniformName").textContent=u.uniform_name;
  $("publicUniformDate").textContent=niceDate(u.wear_date).full;
  $("publicUniformNotes").textContent=u.notes||"";
  $("uniformName").textContent=u.uniform_name;
  $("uniformDate").textContent=niceDate(u.wear_date).full;
  $("uniformNotes").textContent=u.notes||"";
  $("publicAnnouncementCount").textContent=announcements.length;
  $("publicEventCount").textContent=events.length;
  $("publicResourceCount").textContent=resources.length;
  $("publicUniformQuick").textContent=u.uniform_name;

  const cards=announcements.map(a=>`<article class="card"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p></article>`).join("");
  $("publicAnnouncements").innerHTML=cards||"<p>No announcements yet.</p>";
  $("publicHomeAnnouncements").innerHTML=announcements.slice(0,3).map(a=>`<article class="card"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p></article>`).join("")||"<p>No announcements yet.</p>";

  const evhtml=events.map(e=>{
    const d=niceDate(e.event_date);
    return `<div class="event"><div class="date"><b>${d.day}</b><small>${d.month}</small></div><div><h3>${esc(e.title)}</h3><p>${esc(e.event_type)}${e.location?" • "+esc(e.location):""}${e.start_time?" • "+esc(e.start_time.slice(0,5)):""}<br>${esc(e.description)}</p></div></div>`;
  }).join("");
  $("publicEvents").innerHTML=evhtml||"<p>No events yet.</p>";
  $("publicHomeEvents").innerHTML=events.slice(0,3).map(e=>{
    const d=niceDate(e.event_date);
    return `<div class="event"><div class="date"><b>${d.day}</b><small>${d.month}</small></div><div><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p></div></div>`;
  }).join("")||"<p>No events yet.</p>";

  $("publicPosts").innerHTML=posts.map(p=>`<article class="post"><b>${esc(p.title||"Cadet Post")}</b><p>${esc(p.message)}</p></article>`).join("")||"<p>No approved posts yet.</p>";
  $("publicResources").innerHTML=resources.map(r=>`<article class="resource-card"><p class="eyebrow">${esc(r.category)}</p><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p>${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener">Open resource →</a>`:""}</article>`).join("")||"<p>No resources yet.</p>";
}

function announcementForm(){
  return `<form class="announcementForm">
    <label>Title<input name="title" required></label>
    <div class="row">
      <label>Category<select name="category">
        <option>General</option><option>Unit Events</option><option>Field Trips</option><option>Community Service</option><option>Reminders</option><option>Drill / Competitions</option><option>Other</option>
      </select></label>
      <label>Priority<select name="priority"><option value="false">Normal</option><option value="true">Important</option></select></label>
    </div>
    <label>Message<textarea name="message" required></textarea></label>
    <button class="primary">Post Announcement</button>
  </form>`;
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
});

async function openAdmin(){
  if(!currentProfile||!["admin","instructor"].includes(currentProfile.role)){
    alert("You do not have admin access.");
    return;
  }

  const {data,error}=await sb.from("profiles").select("id,full_name,email,role,flight,position,created_at").order("created_at",{ascending:true});
  if(error){
    alert("Could not load accounts: "+error.message);
    return;
  }

  profiles=data||[];
  renderAdmin();
  $("publicSite").classList.add("hidden");
  $("publicFooter").classList.add("hidden");
  document.querySelector(".public-header").classList.add("hidden");
  $("adminApp").classList.remove("hidden");
  showAdminPage("dashboard");
}

function renderAdmin(){
  $("dashboardAnnouncementForm").innerHTML=announcementForm();
  $("announcementFormPage").innerHTML=announcementForm();

  $("adminStats").innerHTML=[
    ["Announcements",announcements.length],
    ["Events",events.length],
    ["Resources",resources.length],
    ["Accounts",profiles.length]
  ].map(([n,v])=>`<div class="stat"><b>${v}</b><span>${n}</span></div>`).join("");

  $("recentAnnouncements").innerHTML=announcements.slice(0,4).map(a=>`<div class="manage"><div class="manage-head"><b>${esc(a.title)}</b><span class="tag">${esc(a.category)}</span></div><p>${esc(a.message)}</p></div>`).join("")||"<p>No announcements yet.</p>";

  $("allAnnouncements").innerHTML=announcements.map(a=>`<div class="manage"><div class="manage-head"><b>${esc(a.title)}</b><span class="tag">${esc(a.category)}</span><span class="actions"><button class="danger" data-delete-announcement="${a.id}">Delete</button></span></div><p>${esc(a.message)}</p></div>`).join("")||"<p>No announcements yet.</p>";

  const ev=events.map(e=>`<div class="manage"><div class="manage-head"><b>${esc(e.title)}</b><span class="tag">${esc(e.event_type)}</span><span class="actions"><button class="danger" data-delete-event="${e.id}">Delete</button></span></div><p>${esc(niceDate(e.event_date).full)}${e.start_time?" • "+esc(e.start_time.slice(0,5)):""}${e.location?" • "+esc(e.location):""}<br>${esc(e.description)}</p></div>`).join("");
  $("calendarOverview").innerHTML=ev||"<p>No events yet.</p>";
  $("allEvents").innerHTML=ev||"<p>No events yet.</p>";

  $("adminPosts").innerHTML=posts.map(p=>`<div class="manage"><div class="manage-head"><b>${esc(p.title||"Cadet Post")}</b><span class="actions"><button class="danger" data-delete-post="${p.id}">Remove</button></span></div><p>${esc(p.message)}</p></div>`).join("")||"<p>No posts yet.</p>";

  $("adminResources").innerHTML=resources.map(r=>`<div class="manage"><div class="manage-head"><b>${esc(r.title)}</b><span class="tag">${esc(r.category)}</span><span class="actions"><button class="danger" data-delete-resource="${r.id}">Delete</button></span></div><p>${esc(r.description)}</p></div>`).join("")||"<p>No resources yet.</p>";

  $("accountList").innerHTML=profiles.map(p=>`<div class="account-row"><div class="account-person"><b>${esc(p.full_name||"Unnamed User")}</b><small>${esc(p.position||p.flight||"MD-803 Account")}</small></div><div class="account-email">${esc(p.email||"")}</div><select class="role-select" data-role-user="${p.id}"><option value="cadet" ${p.role==="cadet"?"selected":""}>Cadet</option><option value="staff" ${p.role==="staff"?"selected":""}>Staff</option><option value="admin" ${p.role==="admin"?"selected":""}>Admin</option><option value="instructor" ${p.role==="instructor"?"selected":""}>Instructor</option></select></div>`).join("")||"<p>No accounts found.</p>";

  const u=activeUniform||{};
  $("adminUniformName").value=u.uniform_name||"Class B";
  $("adminUniformDate").value=u.wear_date||"";
  $("adminUniformNotes").value=u.notes||"";

  document.querySelectorAll(".announcementForm").forEach(form=>{
    form.onsubmit=async e=>{
      e.preventDefault();
      const fd=new FormData(form);
      const {error}=await sb.from("announcements").insert({
        title:fd.get("title"),
        category:fd.get("category"),
        message:fd.get("message"),
        priority:fd.get("priority")==="true",
        author_id:sessionUser.id
      });
      if(error)return alert(error.message);
      form.reset();
      await refreshAll(true);
    };
  });
}

async function refreshAll(reopenAdmin=false){
  await loadPublicData();
  if(reopenAdmin&&currentProfile&&["admin","instructor"].includes(currentProfile.role))await openAdmin();
}

$("signInBtn").onclick=async()=>{
  if(!sessionUser){
    $("loginModal").classList.remove("hidden");
    return;
  }
  if(currentProfile&&["admin","instructor"].includes(currentProfile.role)){
    await openAdmin();
  }else{
    $("accountName").textContent=currentProfile?.full_name||sessionUser.email||"Account";
    $("accountRole").textContent=`Role: ${currentProfile?.role||"cadet"}`;
    $("accountModal").classList.remove("hidden");
  }
};

$("quickSignIn").onclick=()=>$("signInBtn").click();
$("closeLogin").onclick=()=>$("loginModal").classList.add("hidden");
$("guestBtn").onclick=()=>$("loginModal").classList.add("hidden");
$("closeAccount").onclick=()=>$("accountModal").classList.add("hidden");

$("loginForm").onsubmit=async e=>{
  e.preventDefault();
  $("loginError").classList.add("hidden");
  const email=$("loginEmail").value.trim();
  const password=$("loginPassword").value;

  const {error}=await sb.auth.signInWithPassword({email,password});
  if(error){
    $("loginError").textContent=error.message;
    $("loginError").classList.remove("hidden");
    return;
  }

  $("loginModal").classList.add("hidden");
  e.target.reset();
  await loadSession();

  if(currentProfile&&["admin","instructor"].includes(currentProfile.role))await openAdmin();
};

$("accountSignOut").onclick=async()=>{
  await sb.auth.signOut();
  $("accountModal").classList.add("hidden");
  await loadSession();
  showPublic("home");
};

$("adminSignOut").onclick=async()=>{
  await sb.auth.signOut();
  await loadSession();
  showPublic("home");
};

$("backToSite").onclick=()=>showPublic("home");

$("eventForm").onsubmit=async e=>{
  e.preventDefault();
  const {error}=await sb.from("events").insert({
    title:$("eventTitle").value.trim(),
    event_type:$("eventType").value,
    event_date:$("eventDate").value,
    start_time:$("eventTime").value||null,
    location:$("eventLocation").value.trim()||null,
    description:$("eventDescription").value.trim()||null,
    author_id:sessionUser.id
  });
  if(error)return alert(error.message);
  e.target.reset();
  await refreshAll(true);
};

$("uniformForm").onsubmit=async e=>{
  e.preventDefault();

  let result;
  if(activeUniform?.id){
    result=await sb.from("uniforms").update({
      uniform_name:$("adminUniformName").value,
      wear_date:$("adminUniformDate").value||null,
      notes:$("adminUniformNotes").value.trim(),
      active:true,
      updated_by:sessionUser.id,
      updated_at:new Date().toISOString()
    }).eq("id",activeUniform.id);
  }else{
    result=await sb.from("uniforms").insert({
      uniform_name:$("adminUniformName").value,
      wear_date:$("adminUniformDate").value||null,
      notes:$("adminUniformNotes").value.trim(),
      active:true,
      updated_by:sessionUser.id
    });
  }

  if(result.error)return alert(result.error.message);
  await refreshAll(true);
};

$("resourceForm").onsubmit=async e=>{
  e.preventDefault();
  const {error}=await sb.from("resources").insert({
    title:$("resourceTitle").value.trim(),
    category:$("resourceCategory").value,
    url:$("resourceLink").value.trim()||null,
    description:$("resourceDescription").value.trim()||null,
    author_id:sessionUser.id
  });
  if(error)return alert(error.message);
  e.target.reset();
  await refreshAll(true);
};

$("publicPostForm").onsubmit=async e=>{
  e.preventDefault();
  if(!sessionUser)return alert("Sign in first.");

  const {error}=await sb.from("message_posts").insert({
    author_id:sessionUser.id,
    title:$("postTitle").value.trim()||null,
    message:$("postMessage").value.trim(),
    approved:true
  });
  if(error)return alert(error.message);
  e.target.reset();
  await loadPublicData();
};

document.addEventListener("change",async e=>{
  const select=e.target.closest("[data-role-user]");
  if(!select)return;

  const {error}=await sb.rpc("set_user_role",{
    target_user_id:select.dataset.roleUser,
    new_role:select.value
  });

  if(error){
    alert("Role change failed: "+error.message);
    await openAdmin();
    return;
  }

  await openAdmin();
});

document.addEventListener("click",async e=>{
  let table=null,id=null;
  const a=e.target.closest("[data-delete-announcement]");
  const ev=e.target.closest("[data-delete-event]");
  const r=e.target.closest("[data-delete-resource]");
  const p=e.target.closest("[data-delete-post]");

  if(a){table="announcements";id=a.dataset.deleteAnnouncement}
  else if(ev){table="events";id=ev.dataset.deleteEvent}
  else if(r){table="resources";id=r.dataset.deleteResource}
  else if(p){table="message_posts";id=p.dataset.deletePost}

  if(!table)return;
  const {error}=await sb.from(table).delete().eq("id",id);
  if(error)return alert(error.message);
  await refreshAll(true);
});

$("settingsForm").onsubmit=e=>{
  e.preventDefault();
  alert("Settings page is ready. Site-wide settings storage is the next database table we’ll add.");
};

sb.auth.onAuthStateChange(async()=>{await loadSession()});

(async function init(){
  await loadSession();
  await loadPublicData();
})();