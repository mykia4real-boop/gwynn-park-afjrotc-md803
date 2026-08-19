(async()=>{
  const ADMIN_ROLES=["command_staff","instructor"];
  const roleName=r=>({command_staff:"Command Staff",instructor:"Instructor"}[r]||r||"User");

  function showGate(message,allowLogin=false){
    document.querySelector(".public-header")?.classList.add("hidden");
    document.getElementById("publicSite")?.classList.add("hidden");
    document.getElementById("publicFooter")?.classList.add("hidden");
    document.getElementById("adminApp")?.classList.add("hidden");

    let gate=document.getElementById("adminAccessGate");
    if(!gate){
      gate=document.createElement("main");
      gate.id="adminAccessGate";
      gate.innerHTML=`
        <section class="admin-gate-card">
          <p class="eyebrow">AFJROTC ADMINISTRATION</p>
          <h1>Admin Control Center</h1>
          <p id="adminGateMessage"></p>
          <form id="adminGateLogin" class="${allowLogin?"":"hidden"}">
            <label>Email<input id="adminGateEmail" type="email" required autocomplete="email"></label>
            <label>Password<input id="adminGatePassword" type="password" required autocomplete="current-password"></label>
            <button class="primary full" type="submit">Sign In to Admin</button>
            <p id="adminGateError" class="login-error hidden"></p>
          </form>
          <a class="secondary admin-back-link" href="/">Back to AFJROTC Site</a>
        </section>`;
      document.body.appendChild(gate);
    }
    document.getElementById("adminGateMessage").textContent=message;
    document.getElementById("adminGateLogin")?.classList.toggle("hidden",!allowLogin);
  }

  async function enterAdmin(){
    await loadSession();
    if(!sessionUser){
      showGate("Sign in with a Command Staff or Instructor account to continue.",true);
      return;
    }
    if(!currentProfile||!ADMIN_ROLES.includes(currentProfile.role)){
      showGate(`Your ${roleName(currentProfile?.role)} account does not have admin access.`,false);
      return;
    }
    document.getElementById("adminAccessGate")?.remove();
    await loadPublicData();
    await loadGroups();
    if(typeof loadGallery==="function") await loadGallery();
    if(typeof loadAlerts==="function") await loadAlerts();
    if(typeof loadServiceHours==="function") await loadServiceHours();
    await openAdmin();
    const title=document.getElementById("adminTitle");
    if(title) title.textContent="ADMIN CONTROL CENTER";
    const top=document.querySelector(".admin-top p");
    if(top) top.textContent=`Signed in as ${roleName(currentProfile.role)} • ${currentProfile.full_name||sessionUser.email}`;
  }

  document.addEventListener("submit",async e=>{
    if(e.target?.id!=="adminGateLogin")return;
    e.preventDefault();
    const errorEl=document.getElementById("adminGateError");
    errorEl?.classList.add("hidden");
    const {error}=await sb.auth.signInWithPassword({
      email:document.getElementById("adminGateEmail").value.trim(),
      password:document.getElementById("adminGatePassword").value
    });
    if(error){
      if(errorEl){errorEl.textContent=error.message;errorEl.classList.remove("hidden");}
      return;
    }
    await enterAdmin();
  });

  await enterAdmin();
})();
