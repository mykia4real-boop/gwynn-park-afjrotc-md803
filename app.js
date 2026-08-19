const SUPABASE_URL="https://usoqblqosmnqsogddgtc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

const $=id=>document.getElementById(id);
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let sessionUser=null,currentProfile=null,announcements=[],events=[],resources=[],posts=[],activeUniform=null,profiles=[];
let discussionGroups=[], activeGroupId=null;
let galleryPhotos=[];

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


async function loadGallery(){
  const {data,error}=await sb.from("gallery_photos").select("*").order("created_at",{ascending:false});
  if(error){ console.error("Gallery load error",error); return; }
  galleryPhotos=data||[];
  renderGallery();
}

function galleryPublicUrl(path){
  return sb.storage.from("gallery").getPublicUrl(path).data.publicUrl;
}

function renderGallery(){
  if(!$("publicGallery")) return;

  const approved=galleryPhotos.filter(p=>p.approved);
  $("publicGallery").innerHTML=approved.map(p=>`
    <article class="photo-card">
      <img src="${galleryPublicUrl(p.storage_path)}" alt="${esc(p.caption||"MD-803 gallery photo")}" loading="lazy">
      <div class="photo-caption">
        <p>${esc(p.caption||"")}</p>
        <small>${new Date(p.created_at).toLocaleDateString()}</small>
      </div>
    </article>`).join("")||"<p class='muted'>No gallery photos have been approved yet.</p>";

  if($("pendingGallery")){
    const pending=galleryPhotos.filter(p=>!p.approved);
    $("pendingGallery").innerHTML=pending.map(p=>`
      <div class="gallery-review">
        <img src="${galleryPublicUrl(p.storage_path)}" alt="">
        <p>${esc(p.caption||"")}</p>
        <div class="gallery-actions">
          <button class="approve-btn" data-approve-photo="${p.id}">Approve</button>
          <button class="danger" data-delete-photo="${p.id}" data-storage-path="${esc(p.storage_path)}">Delete</button>
        </div>
      </div>`).join("")||"<p class='muted'>No photos are waiting for approval.</p>";
  }

  if($("approvedGalleryAdmin")){
    $("approvedGalleryAdmin").innerHTML=approved.map(p=>`
      <div class="gallery-review">
        <img src="${galleryPublicUrl(p.storage_path)}" alt="">
        <p>${esc(p.caption||"")}</p>
        <div class="gallery-actions">
          <button class="danger" data-delete-photo="${p.id}" data-storage-path="${esc(p.storage_path)}">Remove</button>
        </div>
      </div>`).join("")||"<p class='muted'>No public photos yet.</p>";
  }
}

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
  $("groupsNavBtn").classList.toggle("hidden",!signedIn);
  $("cadetDashboardNav").classList.toggle("hidden",!signedIn);
  $("galleryUploadForm").classList.toggle("hidden",!signedIn);
  $("galleryUploadNotice").textContent=signedIn?"Upload a photo with a caption. It will appear publicly after admin approval.":"Sign in with an MD-803 account to upload photos.";
  if(!signedIn){ discussionGroups=[]; activeGroupId=null; }
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
  renderCadetDashboard();
  $("publicResources").innerHTML=resources.map(r=>`<article class="resource-card"><p class="eyebrow">${esc(r.category)}</p><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p>${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener">Open resource →</a>`:""}</article>`).join("")||"<p>No resources yet.</p>";
}


async function loadGroups(){
  if(!sessionUser){ discussionGroups=[]; renderGroups(); return; }
  const {data,error}=await sb.from("discussion_groups").select("*").eq("archived",false).order("created_at",{ascending:false});
  if(error){ console.error(error); return; }
  discussionGroups=data||[];
  renderGroups();
  renderCadetDashboard();
}

function renderGroups(){
  if(!$("myGroups")) return;
  $("myGroups").innerHTML=discussionGroups.map(g=>`<button class="group-item ${activeGroupId===g.id?"active":""}" data-open-group="${g.id}"><b>${esc(g.name)}</b><small>${esc(g.description||"Private discussion")}</small></button>`).join("")||"<p class='muted'>You have no private groups yet.</p>";
}

async function openGroup(groupId){
  activeGroupId=groupId;
  renderGroups();
  const group=discussionGroups.find(g=>g.id===groupId);
  if(!group)return;
  $("groupChatEmpty").classList.add("hidden");
  $("groupChat").classList.remove("hidden");
  $("groupChatTitle").textContent=group.name;
  const {data,error}=await sb.from("discussion_messages").select("*").eq("group_id",groupId).order("created_at",{ascending:true});
  if(error){ $("groupMessages").innerHTML="<p>Could not load messages.</p>"; return; }
  const authorIds=[...new Set((data||[]).map(m=>m.author_id))];
  let names={};
  if(authorIds.length){
    const {data:people}=await sb.from("profiles").select("id,full_name").in("id",authorIds);
    (people||[]).forEach(p=>names[p.id]=p.full_name||"Member");
  }
  $("groupMessages").innerHTML=(data||[]).map(m=>`<div class="group-message"><b>${esc(names[m.author_id]||"Member")}</b><small>${new Date(m.created_at).toLocaleString()}</small><p>${esc(m.message)}</p></div>`).join("")||"<p class='muted'>No messages yet.</p>";
  $("groupMessages").scrollTop=$("groupMessages").scrollHeight;
}


function renderCadetDashboard(){
  if(!$("cadetWelcomeName")) return;
  const u=activeUniform||{uniform_name:"Not posted",wear_date:null,notes:"Uniform information has not been posted yet."};

  $("cadetWelcomeName").textContent=currentProfile?.full_name?`Welcome, ${currentProfile.full_name}`:"My Dashboard";
  $("cadetWelcomeMeta").textContent=[currentProfile?.role||"cadet", currentProfile?.flight, currentProfile?.position].filter(Boolean).join(" • ");

  $("cadetUniformName").textContent=u.uniform_name;
  $("cadetUniformDate").textContent=niceDate(u.wear_date).full;
  $("cadetUniformNotes").textContent=u.notes||"";

  $("cadetUpcomingEvents").innerHTML=events.slice(0,4).map(e=>{
    const d=niceDate(e.event_date);
    return `<div class="event"><div class="date"><b>${d.day}</b><small>${d.month}</small></div><div><h3>${esc(e.title)}</h3><p>${esc(e.event_type)}${e.location?" • "+esc(e.location):""}</p></div></div>`;
  }).join("")||"<p class='muted'>No upcoming events.</p>";

  $("cadetAnnouncements").innerHTML=announcements.slice(0,4).map(a=>`<article class="card"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p></article>`).join("")||"<p class='muted'>No announcements yet.</p>";

  $("cadetGroups").innerHTML=discussionGroups.slice(0,5).map(g=>`<button class="group-item" data-open-group="${g.id}" data-public="groups"><b>${esc(g.name)}</b><small>${esc(g.description||"Private discussion")}</small></button>`).join("")||"<p class='muted'>No private groups assigned.</p>";

  $("cadetResources").innerHTML=resources.slice(0,4).map(r=>`<article class="resource-card"><p class="eyebrow">${esc(r.category)}</p><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p></article>`).join("")||"<p class='muted'>No resources yet.</p>";
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
  renderGallery();
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

  $("groupMemberPicker").innerHTML=profiles.map(p=>`<label class="member-choice"><input type="checkbox" name="groupMember" value="${p.id}"><span>${esc(p.full_name||p.email||"User")} <small>(${esc(p.role)})</small></span></label>`).join("")||"<p>No accounts found.</p>";

  $("adminGroups").innerHTML=discussionGroups.map(g=>`<div class="group-admin-card"><b>${esc(g.name)}</b><p class="muted">${esc(g.description||"No description")}</p><button class="danger" data-archive-group="${g.id}">Archive</button></div>`).join("")||"<p>No groups yet.</p>";

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
  await loadGroups();
  await loadGallery();
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
    $("profileFullName").value=currentProfile?.full_name||"";
    $("profileFlight").value=currentProfile?.flight||"";
    $("profilePosition").value=currentProfile?.position||"";
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
  await loadGroups();

  if(currentProfile&&["admin","instructor"].includes(currentProfile.role))await openAdmin();
};


$("profileForm").onsubmit=async e=>{
  e.preventDefault();
  const {data,error}=await sb.rpc("update_own_profile",{
    new_full_name:$("profileFullName").value.trim(),
    new_flight:$("profileFlight").value.trim()||null,
    new_position:$("profilePosition").value.trim()||null
  });
  if(error)return alert(error.message);
  await loadSession();
  renderCadetDashboard();
  alert("Profile updated.");
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


$("createAccountForm").onsubmit = async (e) => {
  e.preventDefault();

  const status = $("createAccountStatus");
  const button = e.submitter;
  status.className = "";
  status.textContent = "Creating account...";
  if (button) button.disabled = true;

  const payload = {
    full_name: $("newAccountName").value.trim(),
    email: $("newAccountEmail").value.trim(),
    password: $("newAccountPassword").value,
    role: $("newAccountRole").value
  };

  const { data, error } = await sb.functions.invoke("create-md803-user", {
    body: payload
  });

  if (button) button.disabled = false;

  if (error || data?.error) {
    status.className = "login-error";
    status.textContent = data?.error || error?.message || "Could not create account.";
    return;
  }

  status.className = "notice";
  status.textContent = `Account created for ${payload.full_name}.`;
  e.target.reset();
  await openAdmin();
};



$("galleryUploadForm").onsubmit=async e=>{
  e.preventDefault();
  if(!sessionUser)return alert("Sign in first.");

  const file=$("galleryFile").files[0];
  const caption=$("galleryCaption").value.trim();
  const status=$("galleryUploadStatus");

  if(!file||!caption)return;
  if(file.size>10*1024*1024){
    status.className="login-error";
    status.textContent="Photo must be 10 MB or smaller.";
    return;
  }

  status.className="";
  status.textContent="Uploading...";

  const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
  const path=`${sessionUser.id}/${crypto.randomUUID()}.${ext}`;

  const {error:uploadError}=await sb.storage.from("gallery").upload(path,file,{
    contentType:file.type||"image/jpeg",
    upsert:false
  });

  if(uploadError){
    status.className="login-error";
    status.textContent=uploadError.message;
    return;
  }

  const {error:rowError}=await sb.from("gallery_photos").insert({
    uploader_id:sessionUser.id,
    storage_path:path,
    caption,
    approved:false
  });

  if(rowError){
    await sb.storage.from("gallery").remove([path]);
    status.className="login-error";
    status.textContent=rowError.message;
    return;
  }

  e.target.reset();
  status.className="notice";
  status.textContent="Uploaded! An admin will review it before it appears publicly.";
  await loadGallery();
};

document.addEventListener("click",async e=>{
  const approve=e.target.closest("[data-approve-photo]");
  if(approve){
    const {error}=await sb.from("gallery_photos").update({approved:true}).eq("id",approve.dataset.approvePhoto);
    if(error)return alert(error.message);
    await loadGallery();
    return;
  }

  const del=e.target.closest("[data-delete-photo]");
  if(del){
    const path=del.dataset.storagePath;
    const {error:rowError}=await sb.from("gallery_photos").delete().eq("id",del.dataset.deletePhoto);
    if(rowError)return alert(rowError.message);
    if(path) await sb.storage.from("gallery").remove([path]);
    await loadGallery();
  }
});

$("createGroupForm").onsubmit=async e=>{
  e.preventDefault();
  const memberIds=[...document.querySelectorAll('input[name="groupMember"]:checked')].map(x=>x.value);
  const {data:group,error}=await sb.from("discussion_groups").insert({
    name:$("newGroupName").value.trim(),
    description:$("newGroupDescription").value.trim()||null,
    created_by:sessionUser.id
  }).select().single();
  if(error)return alert(error.message);

  const uniqueMembers=[...new Set([...memberIds,sessionUser.id])];
  const {error:memberError}=await sb.from("discussion_group_members").insert(uniqueMembers.map(user_id=>({group_id:group.id,user_id})));
  if(memberError){
    await sb.from("discussion_groups").delete().eq("id",group.id);
    return alert(memberError.message);
  }
  e.target.reset();
  await loadGroups();
  await openAdmin();
  showAdminPage("groups");
};

$("groupMessageForm").onsubmit=async e=>{
  e.preventDefault();
  if(!activeGroupId)return;
  const message=$("groupMessageText").value.trim();
  if(!message)return;
  const {error}=await sb.from("discussion_messages").insert({group_id:activeGroupId,author_id:sessionUser.id,message});
  if(error)return alert(error.message);
  e.target.reset();
  await openGroup(activeGroupId);
};

document.addEventListener("click",async e=>{
  const open=e.target.closest("[data-open-group]");
  if(open){ await openGroup(open.dataset.openGroup); return; }
  const archive=e.target.closest("[data-archive-group]");
  if(archive){
    const {error}=await sb.from("discussion_groups").update({archived:true}).eq("id",archive.dataset.archiveGroup);
    if(error)return alert(error.message);
    await loadGroups(); await openAdmin(); showAdminPage("groups");
  }
});

$("settingsForm").onsubmit=e=>{
  e.preventDefault();
  alert("Settings page is ready. Site-wide settings storage is the next database table we’ll add.");
};

sb.auth.onAuthStateChange(async()=>{await loadSession()});

(async function init(){
  await loadSession();
  await loadPublicData();
  await loadGroups();
  await loadGallery();
})();
if($("cadetAccountBtn")) $("cadetAccountBtn").onclick=()=>$("signInBtn").click();
