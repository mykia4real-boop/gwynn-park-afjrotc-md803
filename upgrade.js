const ROLE_LABELS={cadet:"Cadet",class_leader:"Class Leader",command_staff:"Command Staff",instructor:"Instructor"};
const ADMIN_ROLES=["command_staff","instructor"];
const DRILL_SEQUENCE=[
"Fall In","Open Ranks, March","Ready, Front","Close Ranks, March","Present Arms","Order Arms","Parade Rest","Attention","Left Face","About Face","Forward, March","Right Flank, March","Left Flank, March","Column Right, March","Forward, March","To the Rear, March","To the Rear, March","Column Right, March","Forward, March","Eyes Right","Ready Front","Column Right, March","Forward, March","Change Step, March","Column Right, March","Forward, March","Flight Halt","Left Face","Right Step, March","Flight Halt"
];
let serviceHours=[];
let drillQuiz=[];
let drillAnswers={};
const roleLabel=role=>ROLE_LABELS[role]||"Cadet";
const hasAdminAccess=()=>!!currentProfile&&ADMIN_ROLES.includes(currentProfile.role);
const isInstructor=()=>currentProfile?.role==="instructor";
const friendlyUniformName=name=>name==="Class A"?"Service Coat":name==="Class B"?"Lightweight Jacket":name;

function injectUpgradeUI(){
  const css=document.createElement("link");css.rel="stylesheet";css.href="upgrade.css?v=21";document.head.appendChild(css);

  const desktopGallery=[...document.querySelectorAll('.public-nav button')].find(b=>b.dataset.public==="gallery");
  if(desktopGallery&&!$("serviceNavBtn")){
    const service=document.createElement("button");service.id="serviceNavBtn";service.dataset.public="service";service.className="hidden";service.textContent="Service Hours";
    const quiz=document.createElement("button");quiz.id="drillQuizNavBtn";quiz.dataset.public="drill-quiz";quiz.className="hidden";quiz.textContent="Drill Quiz";
    desktopGallery.before(service,quiz);
  }
  const mobileGallery=[...document.querySelectorAll('#mobileNav button')].find(b=>b.dataset.public==="gallery");
  if(mobileGallery&&!$("mobileServiceNavBtn")){
    const service=document.createElement("button");service.id="mobileServiceNavBtn";service.dataset.public="service";service.className="hidden";service.textContent="Service Hours";
    const quiz=document.createElement("button");quiz.id="mobileDrillQuizNavBtn";quiz.dataset.public="drill-quiz";quiz.className="hidden";quiz.textContent="Drill Quiz";
    mobileGallery.before(service,quiz);
  }

  const resources=$("public-resources");
  if(resources&&!$("public-service")){
    resources.insertAdjacentHTML("beforebegin",`
      <section id="public-service" class="public-page">
        <div class="page-head"><p class="eyebrow">CADET RECORD</p><h1>Community Service</h1><p>Track your volunteer hours throughout the school year.</p></div>
        <div class="service-summary"><span>My verified total</span><strong id="serviceTotal">0.0 hours</strong></div>
        <div class="public-grid2 service-grid">
          <form id="serviceForm" class="panel">
            <div class="panel-title">ADD SERVICE HOURS</div>
            <label>Date<input id="serviceDate" type="date" required></label>
            <label>Organization / Event<input id="serviceOrganization" placeholder="Example: Food drive"></label>
            <label>Hours<input id="serviceHoursInput" type="number" min="0.25" max="24" step="0.25" required></label>
            <label>What did you do?<textarea id="serviceDescription" maxlength="500"></textarea></label>
            <button class="primary">Add Hours</button>
          </form>
          <article class="panel"><div class="panel-title">MY SERVICE LOG</div><div id="serviceList"></div></article>
        </div>
      </section>
      <section id="public-drill-quiz" class="public-page">
        <div class="page-head"><p class="eyebrow">CADET PRACTICE</p><h1>30-Command Drill Sequence Quiz</h1><p>Practice the official sequence order. Each attempt gives you 10 randomized questions.</p></div>
        <div class="quiz-shell">
          <div class="quiz-topline"><div><span>Practice score</span><strong id="drillQuizScore">Not submitted</strong></div><button id="newDrillQuiz" class="secondary">New Quiz</button></div>
          <div id="drillQuizQuestions" class="quiz-questions"></div>
          <button id="submitDrillQuiz" class="primary quiz-submit">Submit Quiz</button>
          <details class="sequence-study"><summary>Study the full 30-command sequence</summary><ol id="drillSequenceList"></ol></details>
        </div>
      </section>`);
  }

  const cadetQuick=document.querySelector("#public-cadet-dashboard .quick-links");
  if(cadetQuick&&!cadetQuick.querySelector('[data-public="service"]')){
    cadetQuick.insertAdjacentHTML("beforeend",'<button data-public="service">Service Hours</button><button data-public="drill-quiz">Drill Quiz</button>');
  }
  const cadetGrid=document.querySelector("#public-cadet-dashboard .cadet-dashboard-grid");
  if(cadetGrid&&!$("cadetServiceTotal")){
    cadetGrid.insertAdjacentHTML("afterbegin",`<article class="cadet-panel service-mini"><div class="public-panel-title">COMMUNITY SERVICE</div><div class="service-mini-total" id="cadetServiceTotal">0.0 hrs</div><div id="cadetServiceRecent"></div><button class="text-btn" data-public="service">Open service tracker</button></article>`);
  }

  const adminSettings=$("admin-settings");
  if(adminSettings&&!$("admin-service")){
    adminSettings.insertAdjacentHTML("beforebegin",`
      <section id="admin-service" class="admin-page">
        <div class="page-head"><h1>Community Service</h1><p>Review and maintain community service records for cadets.</p></div>
        <div class="service-summary"><span>Unit total</span><strong id="adminServiceTotal">0.0 total hours</strong></div>
        <div class="grid2">
          <form id="adminServiceForm" class="panel">
            <div class="panel-title">ADD HOURS FOR A CADET</div>
            <label>Cadet<select id="adminServiceCadet" required></select></label>
            <label>Date<input id="adminServiceDate" type="date" required></label>
            <label>Organization / Event<input id="adminServiceOrganization"></label>
            <label>Hours<input id="adminServiceHoursInput" type="number" min="0.25" max="24" step="0.25" required></label>
            <label>Description<textarea id="adminServiceDescription" maxlength="500"></textarea></label>
            <button class="primary">Add Hours</button>
          </form>
          <article class="panel"><div class="panel-title">CADET SERVICE LOG</div><div id="adminServiceList"></div></article>
        </div>
      </section>`);
    const settingsButton=[...document.querySelectorAll('#adminNav button')].find(b=>b.dataset.admin==="settings");
    if(settingsButton){const b=document.createElement("button");b.dataset.admin="service";b.textContent="Community Service";settingsButton.before(b);}
  }

  const roleSelect=$("newAccountRole");
  if(roleSelect)roleSelect.innerHTML='<option value="cadet">Cadet</option><option value="class_leader">Class Leader</option><option value="command_staff">Command Staff</option><option value="instructor">Instructor</option>';
  const uniformSelect=$("adminUniformName");
  if(uniformSelect)uniformSelect.innerHTML='<option>Service Coat</option><option>Lightweight Jacket</option><option>OCP / Utility Uniform</option><option>PT Gear</option><option>Unit Polo / Civilian Attire</option><option>Other</option>';
  const accountNotice=document.querySelector('#admin-accounts .notice');if(accountNotice)accountNotice.textContent="Command Staff and Instructors can manage account roles.";
  const accountHead=document.querySelector('#admin-accounts .page-head p');if(accountHead)accountHead.textContent="View accounts and assign Cadet, Class Leader, Command Staff, or Instructor roles.";

  if($("serviceDate"))$("serviceDate").valueAsDate=new Date();
  if($("adminServiceDate"))$("adminServiceDate").valueAsDate=new Date();
  if($("drillSequenceList"))$("drillSequenceList").innerHTML=DRILL_SEQUENCE.map((x,i)=>`<li><b>${i+1}.</b> ${esc(x)}</li>`).join("");
  buildDrillQuiz();
}

function shuffle(items){return [...items].sort(()=>Math.random()-.5)}
function makeOptions(correct,avoidIndex){
  const pool=[...new Set(DRILL_SEQUENCE.filter((_,i)=>i!==avoidIndex&&DRILL_SEQUENCE[i]!==correct))];
  return shuffle([correct,...shuffle(pool).slice(0,3)]);
}
function buildDrillQuiz(){
  if(!$("drillQuizQuestions"))return;
  drillAnswers={};
  const eligible=[...Array(29).keys()];
  const picks=shuffle(eligible).slice(0,10);
  drillQuiz=picks.map((i,n)=>({id:`dq${n}`,step:i+1,current:DRILL_SEQUENCE[i],answer:DRILL_SEQUENCE[i+1],options:makeOptions(DRILL_SEQUENCE[i+1],i+1)}));
  $("drillQuizQuestions").innerHTML=drillQuiz.map((q,n)=>`<article class="quiz-question" data-quiz-q="${q.id}"><div class="quiz-number">${n+1}</div><div><h3>What command comes immediately after <span>${esc(q.current)}</span>?</h3><div class="quiz-options">${q.options.map(opt=>`<button type="button" data-quiz-answer="${esc(opt)}" data-quiz-id="${q.id}">${esc(opt)}</button>`).join("")}</div><p class="quiz-feedback" id="feedback-${q.id}"></p></div></article>`).join("");
  $("drillQuizScore").textContent="Not submitted";
}

document.addEventListener("click",e=>{
  const answer=e.target.closest("[data-quiz-answer]");
  if(answer){
    const qid=answer.dataset.quizId;drillAnswers[qid]=answer.dataset.quizAnswer;
    document.querySelectorAll(`[data-quiz-id="${qid}"]`).forEach(b=>b.classList.toggle("selected",b===answer));return;
  }
  if(e.target.closest("#newDrillQuiz")){buildDrillQuiz();return;}
  if(e.target.closest("#submitDrillQuiz")){
    let score=0;
    drillQuiz.forEach(q=>{
      const chosen=drillAnswers[q.id];const ok=chosen===q.answer;if(ok)score++;
      const feedback=$("feedback-"+q.id);if(feedback){feedback.className=`quiz-feedback ${ok?"good":"needs-work"}`;feedback.textContent=ok?`Correct — ${q.answer} is next.`:`Next is ${q.answer}.`;}
      document.querySelectorAll(`[data-quiz-id="${q.id}"]`).forEach(b=>{b.classList.toggle("correct-answer",b.dataset.quizAnswer===q.answer);b.classList.toggle("wrong-answer",!!chosen&&b.dataset.quizAnswer===chosen&&!ok);});
    });
    $("drillQuizScore").textContent=`${score} / ${drillQuiz.length}`;return;
  }
});

injectUpgradeUI();

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

function announcementCard(a){return `<article class="card announcement-card"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p><small class="announcement-author">Posted by ${esc(a.author_name||"AFJROTC Staff")}</small></article>`;}

const originalRenderAuth=renderAuth;
renderAuth=function(){
  originalRenderAuth();
  const signedIn=!!sessionUser;
  const showCadetTools=signedIn&&!isInstructor();
  $("serviceNavBtn")?.classList.toggle("hidden",!showCadetTools);
  $("mobileServiceNavBtn")?.classList.toggle("hidden",!showCadetTools);
  $("drillQuizNavBtn")?.classList.toggle("hidden",!showCadetTools);
  $("mobileDrillQuizNavBtn")?.classList.toggle("hidden",!showCadetTools);
  if($("galleryUploadNotice"))$("galleryUploadNotice").textContent=signedIn?"Upload a photo with a caption. It will appear publicly after approval.":"Sign in with an AFJROTC account to upload photos.";
};

const originalRenderPublic=renderPublic;
renderPublic=function(){
  originalRenderPublic();
  const u=activeUniform||{};const display=friendlyUniformName(u.uniform_name||"Not posted");
  if($("publicUniformName"))$("publicUniformName").textContent=display;
  if($("uniformName"))$("uniformName").textContent=display;
  if($("publicUniformQuick"))$("publicUniformQuick").textContent=display;
  if($("publicAnnouncements"))$("publicAnnouncements").innerHTML=announcements.map(announcementCard).join("")||"<p>No announcements yet.</p>";
  if($("publicHomeAnnouncements"))$("publicHomeAnnouncements").innerHTML=announcements.slice(0,3).map(announcementCard).join("")||"<p>No announcements yet.</p>";
};

const originalRenderCadetDashboard=renderCadetDashboard;
renderCadetDashboard=function(){
  originalRenderCadetDashboard();
  if($("cadetWelcomeMeta"))$("cadetWelcomeMeta").textContent=[roleLabel(currentProfile?.role),currentProfile?.flight,currentProfile?.position].filter(Boolean).join(" • ");
  if($("cadetAnnouncements"))$("cadetAnnouncements").innerHTML=announcements.slice(0,4).map(announcementCard).join("")||"<p class='muted'>No announcements yet.</p>";
  const u=activeUniform||{};if($("cadetUniformName"))$("cadetUniformName").textContent=friendlyUniformName(u.uniform_name||"Not posted");
  renderServiceHours();
};

async function loadServiceHours(){
  if(!sessionUser){serviceHours=[];return;}
  let q=sb.from("community_service_hours").select("*").order("service_date",{ascending:false});
  if(!hasAdminAccess())q=q.eq("cadet_id",sessionUser.id);
  const {data,error}=await q;if(error){console.error("Service hours load error",error);serviceHours=[];return;}serviceHours=data||[];renderServiceHours();
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
    const cadets=profiles.filter(p=>p.role!=="instructor");const selected=$("adminServiceCadet").value;
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
  profiles=data||[];await loadServiceHours();renderAdmin();
  $("publicSite").classList.add("hidden");$("publicFooter").classList.add("hidden");document.querySelector(".public-header").classList.add("hidden");$("adminApp").classList.remove("hidden");showAdminPage("dashboard");
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

refreshAll=async function(reopenAdmin=false){await loadPublicData();await loadGroups();await loadGallery();await loadAlerts();await loadServiceHours();if(reopenAdmin&&hasAdminAccess())await openAdmin();};

$("signInBtn").onclick=async()=>{
  if(!sessionUser){$("loginModal").classList.remove("hidden");return;}
  if(hasAdminAccess())await openAdmin();
  else{$("accountName").textContent=currentProfile?.full_name||sessionUser.email||"Account";$("accountRole").textContent=`Role: ${roleLabel(currentProfile?.role)}`;$("profileFullName").value=currentProfile?.full_name||"";$("profileFlight").value=currentProfile?.flight||"";$("profilePosition").value=currentProfile?.position||"";$("accountModal").classList.remove("hidden");}
};

$("loginForm").onsubmit=async e=>{
  e.preventDefault();$("loginError").classList.add("hidden");const submit=e.submitter;if(submit){submit.disabled=true;submit.textContent="Signing In...";}
  const {error}=await sb.auth.signInWithPassword({email:$("loginEmail").value.trim(),password:$("loginPassword").value});
  if(error){if(submit){submit.disabled=false;submit.textContent="Sign In";}$("loginError").textContent=error.message;$("loginError").classList.remove("hidden");return;}
  if(submit){submit.disabled=false;submit.textContent="Sign In";}$("loginModal").classList.add("hidden");e.target.reset();await loadSession();await loadGroups();await loadServiceHours();if(hasAdminAccess())await openAdmin();else showPublic("cadet-dashboard");
};

$("serviceForm").onsubmit=async e=>{
  e.preventDefault();if(!sessionUser||isInstructor())return;
  const {error}=await sb.from("community_service_hours").insert({cadet_id:sessionUser.id,service_date:$("serviceDate").value,organization:$("serviceOrganization").value.trim()||null,description:$("serviceDescription").value.trim()||null,hours:Number($("serviceHoursInput").value)});
  if(error)return alert(error.message);e.target.reset();$("serviceDate").valueAsDate=new Date();await loadServiceHours();
};
$("adminServiceForm").onsubmit=async e=>{
  e.preventDefault();if(!hasAdminAccess())return;
  const {error}=await sb.from("community_service_hours").insert({cadet_id:$("adminServiceCadet").value,service_date:$("adminServiceDate").value,organization:$("adminServiceOrganization").value.trim()||null,description:$("adminServiceDescription").value.trim()||null,hours:Number($("adminServiceHoursInput").value)});
  if(error)return alert(error.message);e.target.reset();$("adminServiceDate").valueAsDate=new Date();await loadServiceHours();renderAdmin();
};
document.addEventListener("click",async e=>{
  const del=e.target.closest("[data-delete-service]");if(!del)return;
  const {error}=await sb.from("community_service_hours").delete().eq("id",del.dataset.deleteService);if(error)return alert(error.message);await loadServiceHours();if(hasAdminAccess()&&!$("adminApp").classList.contains("hidden"))renderAdmin();
});

function polishStaticUI(){
  document.title="AFJROTC | Gwynn Park High School";
  document.querySelectorAll(".brand .crest").forEach(el=>el.textContent="GP");
  const publicStrong=document.querySelector(".public-brand strong");if(publicStrong)publicStrong.textContent="AFJROTC";
  const publicSmall=document.querySelector(".public-brand small");if(publicSmall)publicSmall.textContent="GWYNN PARK HIGH SCHOOL";
  const homeTitle=document.querySelector("#public-home h1");if(homeTitle)homeTitle.textContent="AFJROTC Dashboard";
  const homeSub=document.querySelector("#public-home .public-dashboard-head p:last-child");
  document.querySelectorAll(".panel-title,.public-panel-title").forEach(el=>{el.childNodes.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)n.textContent=n.textContent.replace(/^[\s📣♙▣◎▱▦⚠♧◌▧⚙＋]+/,"");});});
  document.querySelectorAll('#adminNav button').forEach(b=>b.textContent=b.textContent.replace(/^[\s📣♙▣◎▱▦⚠♧◌▧⚙]+/,""));
  const adminBrand=document.querySelector('.admin-side .brand b');if(adminBrand)adminBrand.textContent="AFJROTC";
  const adminSmall=document.querySelector('.admin-side .brand small');if(adminSmall)adminSmall.textContent="MANAGEMENT CENTER";
  const adminTop=document.querySelector('.admin-top p');if(adminTop)adminTop.textContent="Manage the Gwynn Park High School AFJROTC website";
  document.querySelectorAll("body *").forEach(el=>{if(el.children.length===0&&el.textContent?.includes("MD-803"))el.textContent=el.textContent.replaceAll("MD-803","AFJROTC");});
  if($("siteName"))$("siteName").value="AFJROTC — Gwynn Park High School";
}
polishStaticUI();
loadSession().then(async()=>{await loadPublicData();await loadGroups();await loadServiceHours();renderAuth();});
