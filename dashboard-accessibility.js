(()=>{
  function addStyles(){
    if(document.getElementById("dashboardAccessibilityStyles"))return;
    const style=document.createElement("style");
    style.id="dashboardAccessibilityStyles";
    style.textContent=`
      .sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
      .dashboard-skip{position:absolute;left:12px;top:-80px;z-index:100000;background:#fff;color:#0f172a;padding:10px 14px;border-radius:10px;box-shadow:0 8px 24px rgba(15,23,42,.18);font-weight:800;text-decoration:none}.dashboard-skip:focus{top:12px}
      .dashboard-shortcuts{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin:16px 0 22px}.dashboard-shortcut{min-height:76px;border:1px solid #dbe2ea;background:#fff;border-radius:16px;padding:12px 10px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:4px;text-align:left;cursor:pointer;font:inherit;box-shadow:0 5px 18px rgba(15,23,42,.045)}.dashboard-shortcut strong{font-size:.96rem;color:#0f172a}.dashboard-shortcut span{font-size:.78rem;color:#64748b}.dashboard-shortcut:hover{transform:translateY(-1px);box-shadow:0 9px 22px rgba(15,23,42,.08)}
      button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid #2563eb!important;outline-offset:3px!important}
      .public-nav button,.mobile-nav button,.quick-links button,.dashboard-shortcut,.sign-in{min-height:44px}
      .post-author{display:block;margin-top:10px;color:#526071;font-size:.84rem}.post-comments{margin-top:14px;padding-top:12px;border-top:1px solid #e5eaf0}.comment-list{display:grid;gap:8px}.comment-row{display:flex;justify-content:space-between;gap:10px;padding:9px 10px;background:#f8fafc;border-radius:12px}.comment-row b{font-size:.85rem}.comment-row small{display:block;color:#64748b;font-size:.72rem;margin-top:2px}.comment-row p{margin:5px 0 0!important;font-size:.9rem}.comment-delete{border:0;background:transparent;color:#9f1d1d;font-size:.75rem;cursor:pointer;align-self:flex-start}.comment-form{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:10px}.comment-form input{min-width:0}.comment-form button{border:0;border-radius:10px;background:#172554;color:#fff;padding:0 14px;font-weight:800;cursor:pointer;min-height:42px}.comment-empty,.comment-signin{font-size:.82rem;margin:0}.photo-caption .post-comments{margin-top:10px}
      @media(max-width:980px){.dashboard-shortcuts{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:620px){.dashboard-shortcuts{grid-template-columns:repeat(2,minmax(0,1fr))}.dashboard-shortcut{min-height:68px}.comment-form{grid-template-columns:1fr}.comment-form button{width:100%}}
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
    if(!dash||document.getElementById("dashboardShortcuts"))return;
    const head=dash.querySelector(".cadet-welcome,.page-head")||dash.firstElementChild;
    const nav=document.createElement("nav");
    nav.id="dashboardShortcuts";nav.className="dashboard-shortcuts";nav.setAttribute("aria-label","Cadet dashboard quick access");
    nav.innerHTML=`
      <button class="dashboard-shortcut" data-public="announcements"><strong>Announcements</strong><span>Latest unit updates</span></button>
      <button class="dashboard-shortcut" data-public="events"><strong>Upcoming Events</strong><span>Dates and activities</span></button>
      <button class="dashboard-shortcut" data-public="uniform"><strong>Uniform</strong><span>What to wear</span></button>
      <button class="dashboard-shortcut" data-public="service"><strong>Service Hours</strong><span>Track volunteering</span></button>
      <button class="dashboard-shortcut" data-public="groups"><strong>Groups</strong><span>Private discussions</span></button>
      <button class="dashboard-shortcut" data-public="drill-quiz"><strong>Drill Quiz</strong><span>30-command practice</span></button>`;
    if(head)head.insertAdjacentElement("afterend",nav);else dash.prepend(nav);

    document.querySelectorAll("button").forEach(btn=>{if(!btn.getAttribute("type")&&!btn.closest("form"))btn.type="button";});
    document.querySelectorAll("img").forEach(img=>{if(!img.hasAttribute("alt"))img.alt="";});
  }

  const previousRenderAuth=renderAuth;
  renderAuth=function(){previousRenderAuth();mountShortcuts();};
  mountShortcuts();
})();
