(()=>{
  const ADMIN_ROLES=["command_staff","instructor"];
  const canAdmin=()=>!!currentProfile&&ADMIN_ROLES.includes(currentProfile.role);

  function syncAdminLink(){
    const header=document.querySelector(".public-header");
    if(!header)return;
    let btn=document.getElementById("adminPortalBtn");
    if(!btn){
      btn=document.createElement("button");
      btn.id="adminPortalBtn";
      btn.className="sign-in hidden";
      btn.textContent="Admin Control Center";
      btn.addEventListener("click",()=>{window.location.href="/admin.html";});
      header.insertBefore(btn,document.getElementById("signInBtn"));
    }
    btn.classList.toggle("hidden",!canAdmin());
  }

  const previousRenderAuth=renderAuth;
  renderAuth=function(){
    previousRenderAuth();
    syncAdminLink();
  };

  const accountButton=document.getElementById("signInBtn");
  if(accountButton){
    accountButton.onclick=async()=>{
      if(!sessionUser){document.getElementById("loginModal")?.classList.remove("hidden");return;}
      if(canAdmin()){window.location.href="/admin.html";return;}
      document.getElementById("accountName").textContent=currentProfile?.full_name||sessionUser.email||"Account";
      document.getElementById("accountRole").textContent=`Role: ${typeof roleLabel==="function"?roleLabel(currentProfile?.role):(currentProfile?.role||"Cadet")}`;
      document.getElementById("profileFullName").value=currentProfile?.full_name||"";
      document.getElementById("profileFlight").value=currentProfile?.flight||"";
      document.getElementById("profilePosition").value=currentProfile?.position||"";
      document.getElementById("accountModal")?.classList.remove("hidden");
    };
  }

  setTimeout(syncAdminLink,0);
})();
