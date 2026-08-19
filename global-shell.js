(()=>{
  const DESKTOP="(min-width:1024px)";
  const ICONS={
    home:"⌂",cadetDashboard:"▦",announcements:"◉",calendar:"▣",uniform:"◇",board:"□",groups:"◎",resources:"▤",gallery:"▧",service:"◷",drillQuiz:"◆",flight:"✈",ranks:"☆",settings:"⚙",
    dashboard:"▦",alerts:"!",accounts:"♙",assignments:"◇",todos:"✓"
  };

  function addStyles(){
    if(document.getElementById("globalShellStyles"))return;
    const s=document.createElement("style");
    s.id="globalShellStyles";
    s.textContent=`
      @media(min-width:1024px){
        :root{--site-rail-collapsed:76px;--site-rail-open:258px}
        body{min-width:0}
        .public-header{position:fixed!important;inset:0 auto 0 0!important;width:var(--site-rail-collapsed)!important;height:100vh!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;padding:16px 10px!important;background:linear-gradient(180deg,#0b1b31,#0a2747)!important;border:0!important;border-right:1px solid #29435f!important;box-shadow:8px 0 28px rgba(15,23,42,.08);overflow:visible!important;transition:width .22s ease;z-index:60!important}
        body.site-rail-open .public-header{width:var(--site-rail-open)!important}
        .public-brand{display:flex!important;align-items:center!important;gap:10px!important;min-width:0!important;width:100%!important;height:auto!important;padding:4px 2px 16px!important;border-bottom:1px solid rgba(255,255,255,.12)!important;overflow:hidden!important;flex:0 0 auto}
        .public-brand .crest{width:46px!important;height:46px!important;min-width:46px!important;border-radius:50%!important}
        .public-brand>div:last-child{opacity:0;width:0;overflow:hidden;white-space:nowrap;transition:opacity .16s ease,width .22s ease}
        body.site-rail-open .public-brand>div:last-child{opacity:1;width:170px}
        .public-brand strong{font-size:18px!important}.public-brand small{font-size:10px!important}
        .public-nav{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:4px!important;margin:14px 0 10px!important;width:100%!important;max-height:calc(100vh - 212px)!important;overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:thin;flex:1 1 auto}
        .public-nav button{position:relative;width:100%!important;min-height:46px!important;border:0!important;border-radius:11px!important;padding:11px 12px!important;text-align:left!important;color:#e8eef6!important;background:transparent!important;white-space:nowrap!important;overflow:hidden!important;font-size:0!important;font-weight:700!important;transition:background .15s ease,color .15s ease!important;pointer-events:auto!important}
        .public-nav button::before{content:attr(data-shell-icon);display:inline-grid;place-items:center;width:30px;height:24px;font-size:20px!important;line-height:1;color:#f7fbff;vertical-align:middle}
        body.site-rail-open .public-nav button{font-size:14px!important}
        body.site-rail-open .public-nav button::before{margin-right:10px}
        .public-nav button:hover,.public-nav button.active{background:#173f6b!important;color:#fff!important}
        .public-nav button.hidden{display:none!important}
        .public-header>.sign-in{width:100%!important;min-height:44px!important;margin-top:7px!important;border-radius:11px!important;padding:9px 10px!important;white-space:nowrap!important;overflow:hidden!important;font-size:0!important;flex:0 0 auto!important;pointer-events:auto!important}
        .public-header>.sign-in::before{content:attr(data-shell-icon);font-size:19px!important}
        body.site-rail-open .public-header>.sign-in{font-size:13px!important}
        body.site-rail-open .public-header>.sign-in::before{margin-right:7px}
        .mobile-menu-btn,#mobileNav{display:none!important}
        #publicSite,#publicFooter,.site-alert-banner{margin-left:var(--site-rail-collapsed)!important;transition:margin-left .22s ease!important}
        body.site-rail-open #publicSite,body.site-rail-open #publicFooter,body.site-rail-open .site-alert-banner{margin-left:var(--site-rail-open)!important}
        #publicSite{min-height:100vh!important}
        .public-page{padding-top:30px!important}
        .site-rail-toggle{position:absolute;top:112px;right:-18px;width:36px;height:72px;border:0;border-radius:0 12px 12px 0;background:#ffd83d;color:#071528;box-shadow:4px 7px 18px rgba(15,23,42,.16);font-size:25px;font-weight:900;display:grid;place-items:center;cursor:pointer;z-index:70;pointer-events:auto!important}
        .site-rail-toggle:hover{filter:brightness(.98)}

        .admin-side{position:fixed!important;inset:0 auto 0 0!important;width:var(--site-rail-collapsed)!important;height:100vh!important;padding:16px 10px 86px!important;background:linear-gradient(180deg,#0b1b31,#0a2747)!important;border-right:1px solid #29435f!important;box-shadow:8px 0 28px rgba(15,23,42,.08)!important;overflow:visible!important;transition:width .22s ease!important;z-index:60!important}
        body.admin-rail-open .admin-side{width:var(--site-rail-open)!important}
        .admin-side .brand{height:68px!important;padding:4px 2px 16px!important;gap:10px!important;overflow:hidden!important;white-space:nowrap!important}
        .admin-side .brand .crest{width:46px!important;height:46px!important;min-width:46px!important;border-radius:50%!important}
        .admin-side .brand>div:last-child{opacity:0;width:0;overflow:hidden;transition:opacity .16s ease,width .22s ease}
        body.admin-rail-open .admin-side .brand>div:last-child{opacity:1;width:170px}
        .admin-side nav{display:flex!important;flex-direction:column!important;gap:4px!important;margin-top:14px!important;padding-bottom:10px!important;max-height:calc(100vh - 178px)!important;overflow-y:auto!important;overflow-x:hidden!important}
        .admin-side nav button{position:relative;width:100%!important;min-height:46px!important;padding:11px 12px!important;border-radius:11px!important;white-space:nowrap!important;overflow:hidden!important;font-size:0!important;color:#e8eef6!important;pointer-events:auto!important}
        .admin-side nav button::before{content:attr(data-shell-icon);display:inline-grid;place-items:center;width:30px;height:24px;font-size:20px!important;color:#f7fbff;vertical-align:middle}
        body.admin-rail-open .admin-side nav button{font-size:14px!important}
        body.admin-rail-open .admin-side nav button::before{margin-right:10px}
        .admin-side nav button.active,.admin-side nav button:hover{background:#173f6b!important}
        .admin-side .back-btn{position:absolute!important;left:10px!important;right:10px!important;bottom:16px!important;width:calc(100% - 20px)!important;margin:0!important;white-space:nowrap!important;overflow:hidden!important;font-size:0!important;border-radius:11px!important;background:#071528!important}
        .admin-side .back-btn::before{content:"←";font-size:20px!important}
        body.admin-rail-open .admin-side .back-btn{font-size:13px!important}
        body.admin-rail-open .admin-side .back-btn::before{margin-right:7px}
        .admin-main{margin-left:var(--site-rail-collapsed)!important;transition:margin-left .22s ease!important}
        body.admin-rail-open .admin-main{margin-left:var(--site-rail-open)!important}
        .admin-rail-toggle{position:absolute;top:112px;right:-18px;width:36px;height:72px;border:0;border-radius:0 12px 12px 0;background:#ffd83d;color:#071528;box-shadow:4px 7px 18px rgba(15,23,42,.16);font-size:25px;font-weight:900;display:grid;place-items:center;cursor:pointer;z-index:70;pointer-events:auto!important}
        .admin-top{min-height:76px!important}
      }
      @media(max-width:1023px){.site-rail-toggle,.admin-rail-toggle{display:none!important}}
    `;
    document.head.appendChild(s);
  }

  function publicKey(btn){
    const p=btn.dataset.public||"";
    if(p==="cadet-dashboard")return "cadetDashboard";
    if(p==="drill-quiz")return "drillQuiz";
    if(p==="site-settings")return "settings";
    return p;
  }

  function decoratePublic(){
    const header=document.querySelector(".public-header");
    if(!header)return;
    header.querySelectorAll(".public-nav button[data-public]").forEach(btn=>{
      const k=publicKey(btn);
      if(!btn.dataset.shellIcon)btn.dataset.shellIcon=ICONS[k]||"•";
    });
    const admin=document.getElementById("adminPortalBtn");if(admin&&!admin.dataset.shellIcon)admin.dataset.shellIcon="◆";
    const acct=document.getElementById("signInBtn");if(acct&&!acct.dataset.shellIcon)acct.dataset.shellIcon="●";
    if(!header.querySelector(".site-rail-toggle")){
      const toggle=document.createElement("button");toggle.className="site-rail-toggle";toggle.type="button";toggle.setAttribute("aria-label","Open navigation panel");toggle.textContent="›";
      toggle.addEventListener("click",()=>{
        const open=document.body.classList.toggle("site-rail-open");
        localStorage.setItem("afjrotcRailOpen",open?"1":"0");
        toggle.textContent=open?"‹":"›";
        toggle.setAttribute("aria-label",open?"Collapse navigation panel":"Open navigation panel");
      });
      header.appendChild(toggle);
    }
    const saved=localStorage.getItem("afjrotcRailOpen")==="1";
    document.body.classList.toggle("site-rail-open",saved);
    const t=header.querySelector(".site-rail-toggle");if(t){t.textContent=saved?"‹":"›";t.setAttribute("aria-label",saved?"Collapse navigation panel":"Open navigation panel");}
  }

  function decorateAdmin(){
    const side=document.querySelector(".admin-side");
    if(!side)return;
    side.querySelectorAll("nav button[data-admin]").forEach(btn=>{
      const k=btn.dataset.admin;
      if(!btn.dataset.shellIcon)btn.dataset.shellIcon=ICONS[k]||({announcements:"◉",calendar:"▣",uniform:"◇",groups:"◎",board:"□",resources:"▤",gallery:"▧",settings:"⚙"}[k]||"•");
    });
    if(!side.querySelector(".admin-rail-toggle")){
      const toggle=document.createElement("button");toggle.className="admin-rail-toggle";toggle.type="button";toggle.setAttribute("aria-label","Open admin navigation panel");toggle.textContent="›";
      toggle.addEventListener("click",()=>{
        const open=document.body.classList.toggle("admin-rail-open");
        localStorage.setItem("afjrotcAdminRailOpen",open?"1":"0");
        toggle.textContent=open?"‹":"›";
        toggle.setAttribute("aria-label",open?"Collapse admin navigation panel":"Open admin navigation panel");
      });
      side.appendChild(toggle);
    }
    const saved=localStorage.getItem("afjrotcAdminRailOpen")==="1";
    document.body.classList.toggle("admin-rail-open",saved);
    const t=side.querySelector(".admin-rail-toggle");if(t){t.textContent=saved?"‹":"›";t.setAttribute("aria-label",saved?"Collapse admin navigation panel":"Open admin navigation panel");}
  }

  function sync(){addStyles();decoratePublic();decorateAdmin();}
  sync();
  // A few one-time retries cover elements created by earlier scripts without creating a mutation loop.
  setTimeout(sync,100);
  setTimeout(sync,500);
  setTimeout(sync,1200);
  window.addEventListener("resize",()=>{
    if(!matchMedia(DESKTOP).matches){document.body.classList.remove("site-rail-open","admin-rail-open");}
  });
})();
