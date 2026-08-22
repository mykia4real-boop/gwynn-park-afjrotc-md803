(()=>{
  function addStyles(){
    if(document.getElementById('communityRedesignStyles'))return;
    const s=document.createElement('style');
    s.id='communityRedesignStyles';
    s.textContent=`
      #public-community{max-width:none!important;padding:0!important;background:#f4f6f8!important;min-height:100vh}
      .community-hero{background:linear-gradient(135deg,#07182b,#17283a);color:#fff;padding:38px 42px 30px;border-bottom:1px solid #2c3b4c}.community-hero .eyebrow{color:#ffd83d}.community-hero h1{font-size:clamp(34px,4vw,52px);margin:5px 0 8px}.community-hero p{margin:0;color:#c3ced9;max-width:720px;line-height:1.55}
      .community-wrap{padding:24px 34px 48px;max-width:1500px;margin:0 auto}.community-tabs{display:grid;grid-template-columns:1fr 1fr;background:#132235;border:1px solid #304155;border-radius:15px 15px 0 0;overflow:hidden}.community-tabs button{border:0;background:transparent;color:#d9e2ec;padding:17px 18px;font:inherit;font-weight:900;cursor:pointer;border-bottom:4px solid transparent}.community-tabs button.active{background:#1d2d40;color:#fff;border-bottom-color:#ffd83d}.community-tabs button:disabled{opacity:.48;cursor:not-allowed}
      .community-stage{background:#eef2f6;border:1px solid #d7dee7;border-top:0;border-radius:0 0 16px 16px;padding:18px}.community-pane{display:none!important}.community-pane.community-active{display:block!important}.community-pane>.page-head{display:none!important}
      #public-community .board53-head{margin-bottom:14px}#public-community .board53-head h1{font-size:1.65rem}#public-community .board53-banner{border-radius:12px}#public-community .board53-shell{grid-template-columns:minmax(0,1fr) 280px}#public-community .board53-side{top:12px}
      #public-community #public-groups{padding:0!important;max-width:none!important}#public-community #public-groups .group-layout{grid-template-columns:330px minmax(0,1fr);gap:16px}#public-community #public-groups .panel{border-radius:15px;box-shadow:0 8px 24px rgba(15,23,42,.04)}#public-community #public-groups .panel-title{font-size:12px;letter-spacing:.05em;color:#0b1b31}#public-community .group-item{border-radius:11px!important;padding:14px!important}#public-community .group-item.active{background:#fff8d9!important;border-color:#e4c23e!important}
      .community-groups-intro{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:14px;padding:4px 2px}.community-groups-intro h2{margin:0;font-size:1.55rem;color:#0b1b31}.community-groups-intro p{margin:4px 0 0;color:#64748b}.community-access-note{background:#fff8d9;border:1px solid #e7cf70;color:#665009;border-radius:12px;padding:11px 13px;font-size:.88rem;font-weight:700}
      @media(max-width:960px){.community-wrap{padding:18px}.community-hero{padding:30px 22px}.community-stage{padding:14px}#public-community .board53-shell{grid-template-columns:1fr}#public-community #public-groups .group-layout{grid-template-columns:1fr}.community-groups-intro{align-items:flex-start;flex-direction:column}}
      @media(max-width:620px){.community-tabs button{padding:14px 8px;font-size:.86rem}.community-wrap{padding:12px}.community-stage{padding:10px}.community-hero{padding:26px 18px}}
    `;
    document.head.appendChild(s);
  }

  function updateNavigation(){
    document.querySelectorAll('[data-public="board"]').forEach(b=>{b.dataset.public='community';b.textContent='Community';b.dataset.shellIcon='◉';b.classList.remove('hidden')});
    document.querySelectorAll('[data-public="groups"]').forEach(b=>b.classList.add('hidden'));
    const quick=[...document.querySelectorAll('.quick-links button[data-public="board"]')];
    quick.forEach(b=>{b.dataset.public='community';b.textContent='Community'});
  }

  function build(){
    addStyles();updateNavigation();
    const main=document.getElementById('publicSite');
    const board=document.getElementById('public-board');
    const groups=document.getElementById('public-groups');
    if(!main||!board||!groups)return;

    let community=document.getElementById('public-community');
    if(!community){
      community=document.createElement('section');
      community.id='public-community';community.className='public-page';
      community.innerHTML=`<div class="community-hero"><p class="eyebrow">CADET COMMUNITY</p><h1>Community</h1><p>Use the Message Board for unit-wide conversation and My Groups for private discussions with the teams and groups you belong to.</p></div><div class="community-wrap"><div class="community-tabs" role="tablist"><button id="communityBoardTab" class="active" type="button" role="tab" aria-selected="true">Message Board</button><button id="communityGroupsTab" type="button" role="tab" aria-selected="false">My Groups</button></div><div class="community-stage" id="communityStage"></div></div>`;
      main.insertBefore(community,board);
    }

    const stage=document.getElementById('communityStage');
    board.classList.remove('public-page');board.classList.add('community-pane','community-active');
    groups.classList.remove('public-page');groups.classList.add('community-pane');
    if(board.parentElement!==stage)stage.appendChild(board);
    if(groups.parentElement!==stage)stage.appendChild(groups);

    if(!groups.querySelector('.community-groups-intro')){
      const intro=document.createElement('div');intro.className='community-groups-intro';
      intro.innerHTML='<div><h2>My Groups</h2><p>Private discussions only appear for groups you have permission to access.</p></div><div class="community-access-note">Signed-in members only</div>';
      groups.prepend(intro);
    }

    const boardTab=document.getElementById('communityBoardTab'),groupsTab=document.getElementById('communityGroupsTab');
    const signedIn=!!window.sessionUser || (typeof sessionUser!=='undefined'&&!!sessionUser);
    groupsTab.disabled=!signedIn;groupsTab.title=signedIn?'':'Sign in to open My Groups';
    function show(which){
      const isGroups=which==='groups'&&signedIn;
      board.classList.toggle('community-active',!isGroups);groups.classList.toggle('community-active',isGroups);
      boardTab.classList.toggle('active',!isGroups);groupsTab.classList.toggle('active',isGroups);
      boardTab.setAttribute('aria-selected',String(!isGroups));groupsTab.setAttribute('aria-selected',String(isGroups));
    }
    boardTab.onclick=()=>show('board');groupsTab.onclick=()=>show('groups');
  }

  const originalRenderAuth=typeof renderAuth==='function'?renderAuth:null;
  if(originalRenderAuth){window.renderAuth=function(){originalRenderAuth();setTimeout(build,0)}}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(build,900));else setTimeout(build,900);
  [1700,3000].forEach(ms=>setTimeout(build,ms));
})();