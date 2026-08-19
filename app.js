
const SUPABASE_URL = "https://usoqblqosmnqsogddgtc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
})[c]);

let sessionUser = null;
let currentProfile = null;
let announcements = [];
let events = [];
let resources = [];
let posts = [];
let activeUniform = null;
let profiles = [];

function niceDate(date) {
  if (!date) return { day:"--", month:"---", full:"" };
  const d = new Date(date + "T12:00:00");
  return {
    day: String(d.getDate()).padStart(2,"0"),
    month: d.toLocaleString("en-US",{month:"short"}).toUpperCase(),
    full: d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
  };
}

async function fetchPublicData() {
  const [
    announcementRes,
    eventRes,
    uniformRes,
    resourceRes,
    postRes
  ] = await Promise.all([
    supabase.from("announcements").select("*").order("created_at",{ascending:false}),
    supabase.from("events").select("*").order("event_date",{ascending:true}),
    supabase.from("uniforms").select("*").eq("active",true).order("updated_at",{ascending:false}).limit(1),
    supabase.from("resources").select("*").order("created_at",{ascending:false}),
    supabase.from("message_posts").select("*").eq("approved",true).order("created_at",{ascending:false})
  ]);

  if (!announcementRes.error) announcements = announcementRes.data || [];
  if (!eventRes.error) events = eventRes.data || [];
  if (!uniformRes.error) activeUniform = (uniformRes.data || [])[0] || null;
  if (!resourceRes.error) resources = resourceRes.data || [];
  if (!postRes.error) posts = postRes.data || [];

  renderPublic();
}

async function fetchSessionAndProfile() {
  const { data:{ session } } = await supabase.auth.getSession();
  sessionUser = session?.user || null;
  currentProfile = null;

  if (sessionUser) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sessionUser.id)
      .single();
    currentProfile = data || null;
  }

  updateAuthUI();
}

function updateAuthUI() {
  const signedIn = !!sessionUser;
  const admin = currentProfile && ["admin","instructor"].includes(currentProfile.role);

  $("signInBtn").textContent = signedIn
    ? (currentProfile?.full_name || sessionUser.email || "Account")
    : "Sign In";

  const quick = $("quickSignIn");
  if (quick) quick.textContent = signedIn ? "My Account" : "Sign In";

  $("publicPostForm").classList.toggle("hidden", !signedIn);
  $("boardNotice").textContent = signedIn
    ? `Signed in as ${currentProfile?.full_name || sessionUser.email}.`
    : "Guest view is read-only.";

  if (admin) {
    $("signInBtn").classList.add("admin-ready");
  } else {
    $("signInBtn").classList.remove("admin-ready");
  }
}

function showPublic(page) {
  $("adminApp").classList.add("hidden");
  $("publicSite").classList.remove("hidden");
  $("publicFooter").classList.remove("hidden");
  document.querySelector(".public-header").classList.remove("hidden");

  document.querySelectorAll(".public-page").forEach(p => p.classList.remove("active"));
  $("public-" + page)?.classList.add("active");
  document.querySelectorAll("[data-public]").forEach(b => b.classList.toggle("active", b.dataset.public === page));
  window.scrollTo(0,0);
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-public]");
  if (b) showPublic(b.dataset.public);
});

function renderPublic() {
  const uniform = activeUniform || {
    uniform_name:"Not posted",
    wear_date:null,
    notes:"Uniform information has not been posted yet."
  };

  $("publicUniformName").textContent = uniform.uniform_name;
  $("publicUniformDate").textContent = niceDate(uniform.wear_date).full;
  $("publicUniformNotes").textContent = uniform.notes || "";
  $("uniformName").textContent = uniform.uniform_name;
  $("uniformDate").textContent = niceDate(uniform.wear_date).full;
  $("uniformNotes").textContent = uniform.notes || "";

  if ($("publicAnnouncementCount")) $("publicAnnouncementCount").textContent = announcements.length;
  if ($("publicEventCount")) $("publicEventCount").textContent = events.length;
  if ($("publicResourceCount")) $("publicResourceCount").textContent = resources.length;
  if ($("publicUniformQuick")) $("publicUniformQuick").textContent = uniform.uniform_name;

  const announcementCards = announcements.map(a => `
    <article class="card">
      <span class="tag">${esc(a.category)}</span>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.message)}</p>
    </article>`).join("");

  $("publicAnnouncements").innerHTML = announcementCards || "<p>No announcements yet.</p>";
  $("publicHomeAnnouncements").innerHTML = announcements.slice(0,3).map(a => `
    <article class="card">
      <span class="tag">${esc(a.category)}</span>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.message)}</p>
    </article>`).join("") || "<p>No announcements yet.</p>";

  const eventHtml = events.map(e => {
    const d = niceDate(e.event_date);
    return `
      <div class="event">
        <div class="date"><b>${d.day}</b><small>${d.month}</small></div>
        <div>
          <h3>${esc(e.title)}</h3>
          <p>${esc(e.event_type)}${e.location ? " • " + esc(e.location) : ""}${e.start_time ? " • " + esc(e.start_time.slice(0,5)) : ""}<br>${esc(e.description)}</p>
        </div>
      </div>`;
  }).join("");

  $("publicEvents").innerHTML = eventHtml || "<p>No events yet.</p>";
  $("publicHomeEvents").innerHTML = events.slice(0,3).map(e => {
    const d = niceDate(e.event_date);
    return `
      <div class="event">
        <div class="date"><b>${d.day}</b><small>${d.month}</small></div>
        <div><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p></div>
      </div>`;
  }).join("") || "<p>No events yet.</p>";

  $("publicPosts").innerHTML = posts.map(p => `
    <article class="post">
      <b>${esc(p.title || "Cadet Post")}</b>
      <p>${esc(p.message)}</p>
    </article>`).join("") || "<p>No approved posts yet.</p>";

  $("publicResources").innerHTML = resources.map(r => `
    <article class="resource-card">
      <p class="eyebrow">${esc(r.category)}</p>
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.description)}</p>
      ${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">Open resource →</a>` : ""}
    </article>`).join("") || "<p>No resources yet.</p>";
}

async function loadAdminData() {
  if (!currentProfile || !["admin","instructor"].includes(currentProfile.role)) {
    alert("You do not have admin access.");
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,flight,position,created_at")
    .order("created_at",{ascending:true});

  if (error) {
    alert("Could not load accounts: " + error.message);
    return;
  }

  profiles = data || [];
  renderAdmin();
  showAdminPage("dashboard");
  $("publicSite").classList.add("hidden");
  $("publicFooter").classList.add("hidden");
  document.querySelector(".public-header").classList.add("hidden");
  $("adminApp").classList.remove("hidden");
}

function announcementForm() {
  return `<form class="announcementForm">
    <label>Title<input name="title" required></label>
    <div class="row">
      <label>Category
        <select name="category">
          <option>General</option>
          <option>Unit Events</option>
          <option>Field Trips</option>
          <option>Community Service</option>
          <option>Reminders</option>
          <option>Drill / Competitions</option>
          <option>Other</option>
        </select>
      </label>
      <label>Priority
        <select name="priority">
          <option value="false">Normal</option>
          <option value="true">Important</option>
        </select>
      </label>
    </div>
    <label>Message<textarea name="message" required></textarea></label>
    <button class="primary">Post Announcement</button>
  </form>`;
}

function renderAdmin() {
  $("dashboardAnnouncementForm").innerHTML = announcementForm();
  $("announcementFormPage").innerHTML = announcementForm();

  const stats = [
    ["Announcements",announcements.length],
    ["Events",events.length],
    ["Resources",resources.length],
    ["Accounts",profiles.length]
  ];
  $("adminStats").innerHTML = stats.map(([name,value]) => `
    <div class="stat"><b>${value}</b><span>${name}</span></div>`).join("");

  $("recentAnnouncements").innerHTML = announcements.slice(0,4).map(a => `
    <div class="manage">
      <div class="manage-head"><b>${esc(a.title)}</b><span class="tag">${esc(a.category)}</span></div>
      <p>${esc(a.message)}</p>
    </div>`).join("");

  $("allAnnouncements").innerHTML = announcements.map(a => `
    <div class="manage">
      <div class="manage-head">
        <b>${esc(a.title)}</b>
        <span class="tag">${esc(a.category)}</span>
        <span class="actions"><button class="danger" data-delete-announcement="${a.id}">Delete</button></span>
      </div>
      <p>${esc(a.message)}</p>
    </div>`).join("") || "<p>No announcements yet.</p>";

  const eventAdmin = events.map(e => `
    <div class="manage">
      <div class="manage-head">
        <b>${esc(e.title)}</b>
        <span class="tag">${esc(e.event_type)}</span>
        <span class="actions"><button class="danger" data-delete-event="${e.id}">Delete</button></span>
      </div>
      <p>${esc(niceDate(e.event_date).full)} ${e.start_time ? esc(e.start_time.slice(0,5)) : ""} ${e.location ? "• " + esc(e.location) : ""}<br>${esc(e.description)}</p>
    </div>`).join("");

  $("calendarOverview").innerHTML = eventAdmin || "<p>No events yet.</p>";
  $("allEvents").innerHTML = eventAdmin || "<p>No events yet.</p>";

  $("adminPosts").innerHTML = posts.map(p => `
    <div class="manage">
      <div class="manage-head">
        <b>${esc(p.title || "Cadet Post")}</b>
        <span class="actions"><button class="danger" data-delete-post="${p.id}">Remove</button></span>
      </div>
      <p>${esc(p.message)}</p>
    </div>`).join("") || "<p>No posts yet.</p>";

  $("adminResources").innerHTML = resources.map(r => `
    <div class="manage">
      <div class="manage-head">
        <b>${esc(r.title)}</b>
        <span class="tag">${esc(r.category)}</span>
        <span class="actions"><button class="danger" data-delete-resource="${r.id}">Delete</button></span>
      </div>
      <p>${esc(r.description)}</p>
    </div>`).join("") || "<p>No resources yet.</p>";

  $("accountList").innerHTML = profiles.map(p => `
    <div class="account-row">
      <div class="account-person">
        <b>${esc(p.full_name || "Unnamed User")}</b>
        <small>${esc(p.position || p.flight || "MD-803 Account")}</small>
      </div>
      <div class="account-email">${esc(p.email || "")}</div>
      <select class="role-select" data-role-user="${p.id}">
        <option value="cadet" ${p.role==="cadet"?"selected":""}>Cadet</option>
        <option value="staff" ${p.role==="staff"?"selected":""}>Staff</option>
        <option value="admin" ${p.role==="admin"?"selected":""}>Admin</option>
        <option value="instructor" ${p.role==="instructor"?"selected":""}>Instructor</option>
      </select>
    </div>`).join("") || "<p>No accounts found.</p>";

  const uniform = activeUniform || {};
  $("adminUniformName").value = uniform.uniform_name || "Class B";
  $("adminUniformDate").value = uniform.wear_date || "";
  $("adminUniformNotes").value = uniform.notes || "";
  $("siteName").value = "Gwynn Park High School AFJROTC MD-803";
  $("schoolYear").value = "2026–2027";
  $("publicMessage").value = "Excellence in All We Do";

  wireAdminForms();
}

function showAdminPage(page) {
  document.querySelectorAll(".admin-page").forEach(p => p.classList.remove("active"));
  $("admin-" + page)?.classList.add("active");
  document.querySelectorAll("[data-admin]").forEach(b => b.classList.toggle("active", b.dataset.admin === page));
  $("adminTitle").textContent = page === "dashboard" ? "ADMIN DASHBOARD" : page.toUpperCase();
  window.scrollTo(0,0);
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-admin]");
  if (b) showAdminPage(b.dataset.admin);
});

function wireAdminForms() {
  document.querySelectorAll(".announcementForm").forEach(form => {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const { error } = await supabase.from("announcements").insert({
        title: fd.get("title"),
        category: fd.get("category"),
        message: fd.get("message"),
        priority: fd.get("priority") === "true",
        author_id: sessionUser.id
      });
      if (error) return alert(error.message);
      form.reset();
      await refreshAll();
    };
  });
}

document.addEventListener("change", async (e) => {
  const select = e.target.closest("[data-role-user]");
  if (!select) return;

  const userId = select.dataset.roleUser;
  const newRole = select.value;

  const { error } = await supabase.rpc("set_user_role", {
    target_user_id: userId,
    new_role: newRole
  });

  if (error) {
    alert("Role change failed: " + error.message);
    await loadAdminData();
    return;
  }

  await loadAdminData();
});

document.addEventListener("click", async (e) => {
  const ann = e.target.closest("[data-delete-announcement]");
  const ev = e.target.closest("[data-delete-event]");
  const res = e.target.closest("[data-delete-resource]");
  const post = e.target.closest("[data-delete-post]");

  let table, id;
  if (ann) { table="announcements"; id=ann.dataset.deleteAnnouncement; }
  if (ev) { table="events"; id=ev.dataset.deleteEvent; }
  if (res) { table="resources"; id=res.dataset.deleteResource; }
  if (post) { table="message_posts"; id=post.dataset.deletePost; }
  if (!table) return;

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return alert(error.message);
  await refreshAll();
});

$("eventForm").onsubmit = async (e) => {
  e.preventDefault();
  const { error } = await supabase.from("events").insert({
    title: $("eventTitle").value.trim(),
    event_type: $("eventType").value,
    event_date: $("eventDate").value,
    start_time: $("eventTime").value || null,
    location: $("eventLocation").value.trim() || null,
    description: $("eventDescription").value.trim() || null,
    author_id: sessionUser.id
  });
  if (error) return alert(error.message);
  e.target.reset();
  await refreshAll();
};

$("uniformForm").onsubmit = async (e) => {
  e.preventDefault();

  if (activeUniform?.id) {
    const { error } = await supabase.from("uniforms").update({
      uniform_name: $("adminUniformName").value,
      wear_date: $("adminUniformDate").value || null,
      notes: $("adminUniformNotes").value.trim(),
      active: true,
      updated_by: sessionUser.id,
      updated_at: new Date().toISOString()
    }).eq("id", activeUniform.id);
    if (error) return alert(error.message);
  } else {
    const { error } = await supabase.from("uniforms").insert({
      uniform_name: $("adminUniformName").value,
      wear_date: $("adminUniformDate").value || null,
      notes: $("adminUniformNotes").value.trim(),
      active: true,
      updated_by: sessionUser.id
    });
    if (error) return alert(error.message);
  }

  await refreshAll();
};

$("resourceForm").onsubmit = async (e) => {
  e.preventDefault();
  const { error } = await supabase.from("resources").insert({
    title: $("resourceTitle").value.trim(),
    category: $("resourceCategory").value,
    url: $("resourceLink").value.trim() || null,
    description: $("resourceDescription").value.trim() || null,
    author_id: sessionUser.id
  });
  if (error) return alert(error.message);
  e.target.reset();
  await refreshAll();
};

$("publicPostForm").onsubmit = async (e) => {
  e.preventDefault();
  if (!sessionUser) return alert("Sign in first.");

  const { error } = await supabase.from("message_posts").insert({
    author_id: sessionUser.id,
    title: $("postTitle").value.trim() || null,
    message: $("postMessage").value.trim(),
    approved: true
  });

  if (error) return alert(error.message);
  e.target.reset();
  await refreshAll();
};

async function refreshAll() {
  await fetchPublicData();
  if (currentProfile && ["admin","instructor"].includes(currentProfile.role)) {
    await loadAdminData();
  }
}

$("signInBtn").onclick = async () => {
  if (!sessionUser) {
    $("loginModal").classList.remove("hidden");
    return;
  }

  if (currentProfile && ["admin","instructor"].includes(currentProfile.role)) {
    await loadAdminData();
  } else {
    $("cadetAccountName").textContent = currentProfile?.full_name || sessionUser.email || "Cadet Account";
    $("cadetAccountRole").textContent = `Role: ${currentProfile?.role || "cadet"}`;
    $("cadetAccountModal").classList.remove("hidden");
  }
};

const quickSignIn = $("quickSignIn");
if (quickSignIn) {
  quickSignIn.onclick = () => $("signInBtn").click();
}

$("closeLogin").onclick = () => $("loginModal").classList.add("hidden");
$("guestBtn").onclick = () => $("loginModal").classList.add("hidden");

$("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  $("loginError").classList.add("hidden");

  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    $("loginError").textContent = error.message;
    $("loginError").classList.remove("hidden");
    return;
  }

  $("loginModal").classList.add("hidden");
  e.target.reset();
  await fetchSessionAndProfile();

  if (currentProfile && ["admin","instructor"].includes(currentProfile.role)) {
    await loadAdminData();
  }
};

$("closeCadetAccount").onclick = () => $("cadetAccountModal").classList.add("hidden");
$("cadetSignOut").onclick = async () => {
  await supabase.auth.signOut();
  $("cadetAccountModal").classList.add("hidden");
  await fetchSessionAndProfile();
  showPublic("home");
};

$("backToSite").onclick = () => showPublic("home");
$("adminSignOut").onclick = async () => {
  await supabase.auth.signOut();
  await fetchSessionAndProfile();
  showPublic("home");
};

supabase.auth.onAuthStateChange(async () => {
  await fetchSessionAndProfile();
});

(async function init(){
  await fetchSessionAndProfile();
  await fetchPublicData();
})();
