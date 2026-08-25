(()=>{
  if(window.__afjrotcShellMobileMenuV4)return;
  window.__afjrotcShellMobileMenuV4=true;

  const STYLE_ID='shellMobileMenuV4Styles';
  const PANEL_ID='shellMobileMenu';

  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      @media(min-width:1024px){
        .public-header .mobile-menu-btn{display:none!important}
        #${PANEL_ID}{display:none!important}
      }
      @media(max-width:1023px){
        .public-header .mobile-menu-btn{
          display:inline-flex!important;
          align-items:center!important;
          justify-content:center!important;
          position:relative!important;
          z-index:1002!important;
          pointer-events:auto!important;
          touch-action:manipulation!important;
          min-width:58px!important;
          min-height:42px!important;
          padding:8px 11px!important;
          margin:0!important;
          border:1px solid rgba(255,255,255,.18)!important;
          border-radius:9px!important;
          background:#0d304d!important;
          color:#f5f8fb!important;
          font-size:12px!important;
          font-weight:900!important;
          cursor:pointer!important;
          user-select:none!important;
          -webkit-user-select:none!important;
        }
        .public-header .mobile-menu-btn[aria-expanded="true"]{
          background:#174c75!important;
          border-color:rgba(255,216,61,.55)!important;
          color:#ffd83d!important;
        }
        #${PANEL_ID}{
          display:grid!important;
          grid-template-columns:1fr!important;
          gap:5px!important;
          position:fixed!important;
          top:80px!important;
          left:10px!important;
          right:10px!important;
          width:auto!important;
          max-height:calc(100dvh - 92px)!important;
          overflow-y:auto!important;
          z-index:1001!important;
          padding:10px!important;
          margin:0!important;
          border:1px solid rgba(143,178,207,.28)!important;
          border-radius:14px!important;
          background:#061f35!important;
          box-shadow:0 18px 42px rgba(0,0,0,.42)!important;
          box-sizing:border-box!important;
          visibility:visible!important;
          opacity:1!important;
          pointer-events:auto!important;
        }
        #${PANEL_ID} button{
          display:flex!important;
          align-items:center!important;
          width:100%!important;
          min-height:46px!important;
          padding:11px 12px!important;
          border:0!important;
          border-radius:9px!important;
          background:transparent!important;
          color:#e8f0f6!important;
          font-size:13px!important;
          font-weight:800!important;
          text-align:left!important;
          cursor:pointer!important;
          pointer-events:auto!important;
        }
        #${PANEL_ID} button.active{background:#205a89!important;color:#fff!important}
      }
    `;
    document.head.appendChild(style);
  }

  function getHeader(){return document.querySelector('.public-header')}
  function getButton(){return document.getElementById('mobileMenuBtn')}
  function getPanel(){return document.getElementById(PANEL_ID)}

  function removeOldMenu(){
    const old=document.getElementById('mobileNav');
    if(old){
      old.classList.add('hidden');
      old.style.setProperty('display','none','important');
      old.style.setProperty('pointer-events','none','important');
      old.setAttribute('aria-hidden','true');
    }
  }

  function closeMenu(){
    const btn=getButton();
    const panel=getPanel();
    if(panel)panel.remove();
    if(btn)btn.setAttribute('aria-expanded','false');
    document.body.classList.remove('shell-mobile-menu-open');
  }

  function routeFromShell(src){
    closeMenu();
    requestAnimationFrame(()=>{
      try{src.click()}catch(e){
        const key=src?.dataset?.shellPage||'home';
        location.href='/?open='+encodeURIComponent(key);
      }
    });
  }

  function buildPanel(){
    closeMenu();
    const shell=document.querySelector('.site-shell-nav');
    if(!shell)return null;
    const items=[...shell.querySelectorAll('button[data-shell-page]')];
    if(!items.length)return null;

    const panel=document.createElement('nav');
    panel.id=PANEL_ID;
    panel.setAttribute('aria-label','Site menu');

    items.forEach(src=>{
      const b=document.createElement('button');
      b.type='button';
      b.textContent=(src.innerText||src.textContent||'').trim();
      b.dataset.shellMobilePage=src.dataset.shellPage||'';
      if(src.classList.contains('active'))b.classList.add('active');
      b.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        routeFromShell(src);
      });
      panel.appendChild(b);
    });

    document.body.appendChild(panel);
    return panel;
  }

  function openMenu(){
    const btn=getButton();
    if(!btn)return;
    const panel=buildPanel();
    if(!panel)return;
    btn.setAttribute('aria-expanded','true');
    document.body.classList.add('shell-mobile-menu-open');
  }

  function toggleMenu(){
    const btn=getButton();
    if(!btn)return;
    const open=btn.getAttribute('aria-expanded')==='true'&&!!getPanel();
    open?closeMenu():openMenu();
  }

  function wireButton(){
    const btn=getButton();
    if(!btn)return false;
    btn.type='button';
    btn.setAttribute('aria-controls',PANEL_ID);
    btn.setAttribute('aria-expanded','false');
    btn.style.setProperty('pointer-events','auto','important');
    btn.onclick=null;

    if(btn.dataset.shellMenuV4!=='1'){
      btn.dataset.shellMenuV4='1';
      btn.addEventListener('click',e=>{
        if(window.innerWidth>1023)return;
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });
    }
    return true;
  }

  function prepare(){
    removeOldMenu();
    wireButton();
    closeMenu();
  }

  document.addEventListener('click',e=>{
    const panel=getPanel();
    if(!panel)return;
    if(e.target.closest?.('#'+PANEL_ID)||e.target.closest?.('#mobileMenuBtn'))return;
    closeMenu();
  });

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  window.addEventListener('resize',()=>{if(window.innerWidth>1023)closeMenu()},{passive:true});
  window.addEventListener('pageshow',closeMenu);

  prepare();
  setTimeout(()=>{removeOldMenu();wireButton()},300);
  setTimeout(()=>{removeOldMenu();wireButton()},1000);
})();