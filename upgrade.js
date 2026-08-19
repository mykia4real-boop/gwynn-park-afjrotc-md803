const ROLE_LABELS={cadet:"Cadet",class_leader:"Class Leader",command_staff:"Command Staff",instructor:"Instructor"};
const ADMIN_ROLES=["command_staff","instructor"];
let serviceHours=[];
const roleLabel=role=>ROLE_LABELS[role]||"Cadet";
const hasAdminAccess=()=>!!currentProfile&&ADMIN_ROLES.includes(currentProfile.role);
const isInstructor=()=>currentProfile?.role==="instructor";
const friendlyUniformName=name=>name==="Class A"?"Service Coat":name==="Class B"?"Lightweight Jacket":name;

async function upgradedLoadPublicData(){
  const [a,e,u,r,p]=await Promise.all([
    sb.from("announcements").select("*").order("created_at",{ascending:false}),
    sb.from("events").select("*").order("event_date",{ascending:true}),
    sb.from("uniforms").select("*").eq("active",true).order("updated_at",{ascending:false}).limit(1),
    sb.from("resources").select("*").order("created_at",{ascending:false}),
    sb.from("message_posts").select("*").eq("approved",true).order("created_at",{ascending:false})
  ]);
  if(!a.error){
    announcements=a.data||[];
    const ids=[...new Set(announcements.map(x=>x.author_id).filter(Boolean))];
    if(ids.length){
      const {data:people}=await sb.from("profiles").select("id,full_name,email").in("id",ids);
      const names=Object.fromEntries((people||[]).map(x=>[x.id,x.full_name||x.email||"AFJROTC Staff"]));
      announcements=announcements.map(x=>({...x,author_name:names[x.author_id]||"AFJROTC Staff"}));
    }
  }
  if(!e.error)events=e.data||[];
  if(!u.error)activeUniform=(u.data||[])[0]||null;
  if(!r.error)resources=r.data||[];
  if(!p.error)posts=p.data||[];
  renderPublic();
}
loadPublicData=upgradedLoadPublicData;

function announcementCard(a){
  return `<article class="card announcement-card"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p><small class="announcement-author">Posted by ${esc(a.author_name||"AFJROTC Staff")}</small></article>`;
}

const originalRenderAuth=renderAuth;
renderAuth=function(){
  originalRenderAuth();
  const signedIn=!!sessionUser;
  const showService=signedIn&&!isInstructor();
  $("serviceNavBtn")?.classList.toggle("hidden",!showService);
  $("mobileServiceNavBtn")?.classList.toggle("hidden",!showService);
  if($("galleryUploadNotice")) $("galleryUploadNotice").textContent=signedIn?"Upload a photo with a caption. It will appear publicly after approval.":"Sign in with an AFJROTC account to upload photos.";
};

const originalRenderPublic=renderPublic;
renderPublic=function(){
  originalRenderPublic();
  const u=activeUniform||{};
  const display=friendlyUniformName(u.uniform_name||"Not posted");
  if($("publicUniformName")) $("publicUniformName").textContent=display;
  if($("uniformName")) $("uniformName").textContent=display;
  if($("publicUniformQuick")) $("publicUniformQuick").textContent=display;
  if($("publicAnnouncements")) $("publicAnnouncements").innerHTML=announcements.map(announcementCard).join("")||"<p>No announcements yet.</p>";
  if($("publicHomeAnnouncements")) $("publicHomeAnnouncements").innerHTML=announcements.slice(0,3).map(announcementCard).join("")||"<p>No announcements yet.</p>";
};

const originalRenderCadetDashboard=renderCadetDashboard;
renderCadetDashboard=function(){
  originalRenderCadetDashboard();
  if($("cadetWelcomeMeta")) $("cadetWelcomeMeta").textContent=[roleLabel(currentProfile?.role),currentProfile?.flight,currentProfile?.position].filter(Boolean).join(" • ");
  if($("cadetAnnouncements")) $("cadetAnnouncements").innerHTML=announcements.slice(0,4).map(announcementCard).join("")||"<p class='muted'>No announcements yet.</p>";
  const u=activeUniform||{};
  if($("cadetUniformName")) $("cadetUniformName").textContent=friendlyUniformName(u.uniform_name||"Not posted");
  renderServiceHours();
};

async function loadServiceHours(){
  if(!sessionUser){serviceHours=[];renderServiceHours();return;}
  let q=sb.from("community_service_hours").select("*").order("service_date",{ascending:false});
  if(!hasAdminAccess())q=q.eq("cadet_id",sessionUser.id);
  const {data,error}=await q;
  if(error){console.error("Service hours load error",error);serviceHours=[];return;}
  serviceHours=data||[];
  renderServiceHours();
}
const serviceTotal=rows=>rows.reduce((sum,row)=>sum+Number(row.hours||0),0);
function serviceRows(rows,showName=false){
  if(!rows.length)return "<p class='muted'>No community service hours yet.</p>";
  const names=Object.fromEntries(profiles.map(p=>[p.id,p.full_name||p.email||"Cadet"]));
  return rows.map(r=>`<div class="service-entry"><div><b>${showName?esc(names[r.cadet_id]||"Cadet"):esc(r.organization||"Community Service")}</b><small>${esc(niceDate(r.service_date).full)}${r.organization&&showName?` • ${esc(r.organization)}`:""}</small><p>${esc(r.description||"")}</p></div><div class="service-hours-badge">${Number(r.hours).toFixed(1)} hrs</div><button class="text-btn danger-link" data-delete-service="${r.id}">Remove</button></div>`).join("");
}
function renderServiceHours(){
  if(!sessionUser)return;
  const own=serviceHours.filter(r=>r.cadet_id===sessionUser.id);
  if($("serviceTotal"))$("serviceTotal").textContent=`${serviceTotal(own).toFixed(1)} hours`;
  if($("serviceList"))$("serviceList").innerHTML=serviceRows(own);
  if($("cadetServiceTotal"))$("cadetServiceTotal").textContent=`${serviceTotal(own).toFixed(1)} hrs`;
  if($("cadetServiceRecent"))$("cadetServiceRecent").innerHTML=serviceRows(own.slice(0,2));
  if($("adminServiceCadet")){
    const cadets=profiles.filter(p=>p.role!=="instructor");
    const selected=$("adminServiceCadet").value;
    $("adminServiceCadet").innerHTML=cadets.map(p=>`<option value="${p.id}">${esc(p.full_name||p.email||"Cadet")} — ${roleLabel(p.role)}</option>`).join("");
    if(cadets.some(p=>p.id===selected))$("adminServiceCadet").value=selected;
  }
  if($("adminServiceTotal"))$("adminServiceTotal").textContent=`${serviceTotal(serviceHours).toFixed(1)} total hours`;
  if($("adminServiceList"))$("adminServiceList").innerHTML=serviceRows(serviceHours,true);
}

openAdmin=async function(){
  if(!hasAdminAccess()){alert("You do not have management access.");return;}
  const {data,error}=await sb.from("profiles").select("id,full_name,email,role,flight,position,created_at").order("created_at",{ascending:true});
  if(error){alert("Could not load accounts: "+error.message);return;}
  profiles=data||[];
  await loadServiceHours();
  renderAdmin();
  $("publicSite").classList.add("hidden");
  $("publicFooter").classList.add("hidden");
  document.querySelector(".public-header").classList.add("hidden");
  $("adminApp").classList.remove("hidden");
  showAdminPage("dashboard");
};

const originalRenderAdmin=renderAdmin;
renderAdmin=function(){
  originalRenderAdmin();
  const cadetCount=profiles.filter(p=>p.role!=="instructor").length;
  if($("adminStats"))$("adminStats").innerHTML=[["Announcements",announcements.length],["Upcoming Events",events.length],["Cadet Accounts",cadetCount],["Service Hours",serviceTotal(serviceHours).toFixed(1)]].map(([n,v])=>`<div class="stat"><b>${v}</b><span>${n}</span></div>`).join("");
  if($("recentAnnouncements"))$("recentAnnouncements").innerHTML=announcements.slice(0,4).map(a=>`<div class="manage"><div class="manage-head"><b>${esc(a.title)}</b><span class="tag">${esc(a.category)}</span></div><p>${esc(a.message)}</p><small>Posted by ${esc(a.author_name||"AFJROTC Staff")}</small></div>`).join("")||"<p>No announcements yet.</p>";
  if($("allAnnouncements"))$("allAnnouncements").innerHTML=announcements.map(a=>`<div class="manage"><div class="manage-head"><b>${esc(a.title)}</b><span class="tag">${esc(a.category)}</span><span class="actions"><button class="danger" data-delete-announcement="${a.id}">Delete</button></span></div><p>${esc(a.message)}</p><small>Posted by ${esc(a.author_name||"AFJROTC Staff")}</small></div>`).join("")||"<p>No announcements yet.</p>";
  if($("accountList"))$("accountList").innerHTML=profiles.map(p=>`<div class="account-row"><div class="account-person"><b>${esc(p.full_name||"Unnamed User")}</b><small>${esc(p.position||p.flight||roleLabel(p.role))}</small></div><div class="account-email">${esc(p.email||"")}</div><select class="role-select" data-role-user="${p.id}"><option value="cadet" ${p.role==="cadet"?"selected":""}>Cadet</option><option value="class_leader" ${p.role==="class_leader"?"selected":""}>Class Leader</option><option value="command_staff" ${p.role==="command_staff"?"selected":""}>Command Staff</option><option value="instructor" ${p.role==="instructor"?"selected":""}>Instructor</option></select></div>`).join("")||"<p>No accounts found.</p>";
  if($("groupMemberPicker"))$("groupMemberPicker").innerHTML=profiles.map(p=>`<label class="member-choice"><input type="checkbox" name="groupMember" value="${p.id}"><span>${esc(p.full_name||p.email||"User")} <small>(${roleLabel(p.role)})</small></span></label>`).join("")||"<p>No accounts found.</p>";
  if($("adminUniformName"))$("adminUniformName").value=friendlyUniformName(activeUniform?.uniform_name||"Lightweight Jacket");
  renderServiceHours();
};

refreshAll=async function(reopenAdmin=false){
  await loadPublicData();await loadGroups();await loadGallery();await loadAlerts();await loadServiceHours();
  if(reopenAdmin&&hasAdminAccess())await openAdmin();
};

$("signInBtn").onclick=async()=>{
  if(!sessionUser){$("loginModal").classList.remove("hidden");return;}
  if(hasAdminAccess())await openAdmin();
  else{
    $("accountName").textContent=currentProfile?.full_name||sessionUser.email||"Account";
    $("accountRole").textContent=`Role: ${roleLabel(currentProfile?.role)}`;
    $("profileFullName").value=currentProfile?.full_name||"";$("profileFlight").value=currentProfile?.flight||"";$("profilePosition").value=currentProfile?.position||"";
    $("accountModal").classList.remove("hidden");
  }
};

$("loginForm").onsubmit=async e=>{
  e.preventDefault();$("loginError").classList.add("hidden");const submit=e.submitter;
  if(submit){submit.disabled=true;submit.textContent="Signing In...";}
  const {error}=await sb.auth.signInWithPassword({email:$("loginEmail").value.trim(),password:$("loginPassword").value});
  if(error){if(submit){submit.disabled=false;submit.textContent="Sign In";}$("loginError").textContent=error.message;$("loginError").classList.remove("hidden");return;}
  if(submit){submit.disabled=false;submit.textContent="Sign In";}$("loginModal").classList.add("hidden");e.target.reset();
  await loadSession();await loadGroups();await loadServiceHours();
  if(hasAdminAccess())await openAdmin();else showPublic("cadet-dashboard");
};

if($("serviceForm"))$("serviceForm").onsubmit=async e=>{
  e.preventDefault();if(!sessionUser||isInstructor())return;
  const {error}=await sb.from("community_service_hours").insert({cadet_id:sessionUser.id,service_date:$("serviceDate").value,organization:$("serviceOrganization").value.trim()||null,description:$("serviceDescription").value.trim()||null,hours:Number($("serviceHoursInput").value)});
  if(error)return alert(error.message);e.target.reset();$("serviceDate").valueAsDate=new Date();await loadServiceHours();
};
if($("adminServiceForm"))$("adminServiceForm").onsubmit=async e=>{
  e.preventDefault();if(!hasAdminAccess())return;
  const {error}=await sb.from("community_service_hours").insert({cadet_id:$("adminServiceCadet").value,service_date:$("adminServiceDate").value,organization:$("adminServiceOrganization").value.trim()||null,description:$("adminServiceDescription").value.trim()||null,hours:Number($("adminServiceHoursInput").value)});
  if(error)return alert(error.message);e.target.reset();$("adminServiceDate").valueAsDate=new Date();await loadServiceHours();renderAdmin();
};
document.addEventListener("click",async e=>{
  const del=e.target.closest("[data-delete-service]");if(!del)return;
  const {error}=await sb.from("community_service_hours").delete().eq("id",del.dataset.deleteService);if(error)return alert(error.message);
  await loadServiceHours();if(hasAdminAccess()&&!$("adminApp").classList.contains("hidden"))renderAdmin();
});

function polishStaticUI(){
  document.title="AFJROTC | Gwynn Park High School";
  document.querySelectorAll(".brand .crest").forEach(el=>el.textContent="GP");
  const publicStrong=document.querySelector(".public-brand strong");if(publicStrong)publicStrong.textContent="AFJROTC";
  const publicSmall=document.querySelector(".public-brand small");if(publicSmall)publicSmall.textContent="GWYNN PARK HIGH SCHOOL";
  document.querySelectorAll(".panel-title,.public-panel-title").forEach(el=>{el.childNodes.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)n.textContent=n.textContent.replace(/^[\s📣♙▣◎▱▦⚠♧◌▧⚙＋]+/,"");});});
  if($("siteName"))$("siteName").value="AFJROTC — Gwynn Park High School";
  if($("serviceDate"))$("serviceDate").valueAsDate=new Date();
  if($("adminServiceDate"))$("adminServiceDate").valueAsDate=new Date();
}
polishStaticUI();
loadSession().then(async()=>{await loadPublicData();await loadGroups();await loadServiceHours();renderAuth();});
