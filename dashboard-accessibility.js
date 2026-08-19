(()=>{
  function addStyles(){
    if(document.getElementById("dashboardAccessibilityStyles"))return;
    const style=document.createElement("style");
    style.id="dashboardAccessibilityStyles";
    style.textContent=`
      .sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
      .dashboard-skip{position:absolute;left:12px;top:-80px;z-index:100000;background:#fff;color:#0f172a;padding:10px 14px;border-radius:10px;box-shadow:0 8px 24px rgba(15,23,42,.18);font-weight:800;text-decoration:none}.dashboard-skip:focus{top:12px}
      #public-cadet-dashboard{position:relative}
      .cadet-dashboard-shell{display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px;align-items:start}
      .dashboard-sidepanel{position:sticky;top:92px;background:#fff;border:1px solid #dfe5ec;border-radius:18px;padding:12px;box-shadow:0 8px 24px rgba(15,23,42,.06);max-height:calc(100vh - 116px);overflow:auto}
      .dashboard-sidepanel-title{padding:8px 8px 10px;color:#64748b;font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em}
      .dashboard-shortcuts{display:grid;grid-template-columns:1fr;gap:6px;margin:0}.dashboard-shortcut{min-height:52px;border:0;background:transparent;border-radius:12px;padding:9px 10px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;text-align:left;cursor:pointer;font:inherit;width:100%}.dashboard-shortcut strong{font-size:.92rem;color:#0f172a}.dashboard-shortcut span{font-size:.72rem;color:#64748b}.dashboard-shortcut:hover{background:#f1f5f9}.dashboard-shortcut.active{background:#e8eefc}.dashboard-main-content{min-width:0}
      .dashboard-panel-toggle{display:none;width:100%;min-height:46px;border:1px solid #dbe2ea;background:#fff;border-radius:12px;padding:10px 12px;font:inherit;font-weight:800;text-align:left;margin:0 0 12px;cursor:pointer}
      button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid #2563eb!important;outline-offset:3px!important}
      .public-nav button,.mobile-nav button,.quick-links button,.dashboard-shortcut,.sign-in{min-height:44px}
      .post-author{display:block;margin-top:10px;color:#526071;font-size:.84rem}.post-comments{margin-top:14px;padding-top:12px;border-top:1px solid #e5eaf0}.comment-list{display:grid;gap:8px}.comment-row{display:flex;justify-content:space-between;gap:10px;padding:9px 10px;background:#f8fafc;border-radius:12px}.comment-row b{font-size:.85rem}.comment-row small{display:block;color:#64748b;font-size:.72rem;margin-top:2px}.comment-row p{margin:5px 0 0!important;font-size:.9rem}.comment-delete{border:0;background:transparent;color:#9f1d1d;font-size:.75rem;cursor:pointer;align-self:flex-start}.comment-form{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:10px}.comment-form input{min-width:0}.comment-form button{border:0;border-radius:10px;background:#172554;color:#fff;padding:0 14px;font-weight:800;cursor:pointer;min-height:42px}.comment-empty,.comment-signin{font-size:.82rem;margin:0}.photo-caption .post-comments{margin-top:10px}
      @media(max-width:900px){.cadet-dashboard-shell{grid-template-columns:190px minmax(0,1fr)}.dashboard-sidepanel{top:82px}}
      @media(max-width:720px){
        .public-header{height:68px!important;padding:0 12px!important;gap:8px!important;overflow:visible}
        .public-brand{min-width:0!important;flex:1 1 auto;gap:7px!important;overflow:hidden}
        .public-brand .crest{width:38px!important;height:38px!important;min-width:38px!important;font-size:14px}
        .public-brand strong{font-size:14px!important;line-height:1.05;letter-spacing:.04em;white-space:nowrap}
        .public-brand small{font-size:8px!important;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:118px}
        #adminPortalBtn{padding:8px 10px!important;min-height:40px!important;font-size:12px!important;line-height:1!important;border-radius:10px!important;white-space:nowrap;flex:0 0 auto}
        #signInBtn{padding:8px 11px!important;min-height:40px!important;font-size:12px!important;line-height:1!important;border-radius:10px!important;white-space:nowrap;max-width:84px;overflow:hidden;text-overflow:ellipsis;flex:0 0 auto}
        .public-dashboard-head{overflow:visible!important;padding-left:18px!important;padding-right:18px!important}
        .public-dashboard-head .eyebrow{font-size:9px!important;letter-spacing:.12em!important;line-height:1.35!important;white-space:normal!important;overflow:visible!important;max-width:100%;padding-left:0!important;margin-left:0!important}
        .public-dashboard-head h1{font-size:30px!important;line-height:1.05}
        .cadet-dashboard-shell{display:block}.dashboard-panel-toggle{display:block}.dashboard-sidepanel{position:static;max-height:none;margin-bottom:12px;display:none}.dashboard-sidepanel.open{display:block}.dashboard-shortcuts{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.dashboard-shortcut{border:1px solid #e2e8f0;background:#fff}.comment-form{grid-template-columns:1fr}.comment-form button{width:100%}
      }
      @media(max-width:440px){.dashboard-shortcuts{grid-template-columns:1fr}.public-brand small{display:none}.public-brand strong{font-size:13px!important}.public-header{gap:6px!important;padding:0 9px!important}#adminPortalBtn,#signInBtn{font-size:11px!important;padding:7px 8px!important}}
      @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
    `;
    document.head.appendChild(style);
  }

  function mountShortcuts(){
    addStyles();
    if(!document.getElementById("dashboardSkip")){
      const skip=document.createElement("a");skip.id="dashboardSkip";skip.className="dashboard-skip";skip.href="#public-cadet-dashboard";skip.textContent="Skip to cadet dashboard";document.body.prepend(skip);
    }
    const dash=document.getElementById("public-cadet-dashboard");
    if(!dash||document.getElementById("dashboardSidePanel"))return;

    const existingChildren=[...dash.children];
    const shell=document.createElement("div");shell.className="cadet-dashboard-shell";
    const side=document.createElement("aside");side.id="dashboardSidePanel";side.className="dashboard-sidepanel";side.setAttribute("aria-label","Cadet dashboard navigation");
    side.innerHTML=`<div class="dashboard-sidepanel-title">Dashboard</div><nav id="dashboardShortcuts" class="dashboard-shortcuts" aria-label="Cadet dashboard quick access">
      <button class="dashboard-shortcut" data-public="announcements"><strong>Announcements</strong><span>Latest unit updates</span></button>
      <button class="dashboard-shortcut" data-public="events"><strong>Upcoming Events</strong><span>Dates and activities</span></button>
      <button class="dashboard-shortcut" data-public="uniform"><strong>Uniform</strong><span>What to wear</span></button>
      <button class="dashboard-shortcut" data-public="service"><strong>Service Hours</strong><span>Track volunteering</span></button>
      <button class="dashboard-shortcut" data-public="groups"><strong>Groups</strong><span>Private discussions</span></button>
      <button class="dashboard-shortcut" data-public="drill-quiz"><strong>Drill Quiz</strong><span>30-command practice</span></button>
    </nav>`;

    const main=document.createElement("div");main.className="dashboard-main-content";
    const toggle=document.createElement("button");toggle.type="button";toggle.className="dashboard-panel-toggle";toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-controls","dashboardSidePanel");toggle.textContent="Dashboard Menu";
    toggle.addEventListener("click",()=>{const open=side.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"Close Dashboard Menu":"Dashboard Menu";});
    main.appendChild(toggle);
    existingChildren.forEach(child=>main.appendChild(child));
    shell.append(side,main);dash.appendChild(shell);

    document.querySelectorAll("button").forEach(btn=>{if(!btn.getAttribute("type")&&!btn.closest("form"))btn.type="button";});
    document.querySelectorAll("img").forEach(img=>{if(!img.hasAttribute("alt"))img.alt="";});
  }

  const previousRenderAuth=renderAuth;
  renderAuth=function(){previousRenderAuth();mountShortcuts();};
  mountShortcuts();
})();
