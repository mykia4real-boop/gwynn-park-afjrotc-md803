(()=>{
  if(window.__afjrotcShellMobileMenuV3)return;
  window.__afjrotcShellMobileMenuV3=true;

  const STYLE_ID='shellMobileMenuV3Styles';
  const PANEL_ID='shellMobileMenu';

  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #${PANEL_ID}{display:none!important}
      @media(min-width:1024px){
        #${PANEL_ID}{display:none!important}
        .public-header .mobile-menu-btn{display:none!important}
      }
      @media(max-width:1023px){
        .public-header{z-index:2147483000!important}
        .public-header .mobile-menu-btn{
          display:inline-flex!important;
          align-items:center!important;
          justify-content:center!important;
          position:relative!important;
          z-index:2147483002!important;
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
        #${PANEL_ID}:not(.hidden){
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
          z-index:2147483001!important;
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

  function ensureButton(){
    let btn=document.getElementById('mobileMenuBtn');
    if(!btn){
      const header=getHeader();
      if(!header)return null;
      btn=document.createElement('button');
      btn.id='mobileMenuBtn';
      btn.className='mobile-menu-btn';
      btn.type='button';
      btn.textContent='Menu';
      const sign=document.getElementById('signInBtn');
      sign&&sign.parentElement===header?header.insertBefore(btn,sign):header.appendChild(btn);
    }
    btn.type='button';
    btn.setAttribute('aria-controls',PANEL_ID);
    if(!btn.hasAttribute('aria-expanded'))btn.setAttribute('aria-expanded','false');
    btn.style.setProperty('pointer-events','auto','important');
    return btn;
  }

  function ensurePanel(){
    let panel=document.getElementById(PANEL_ID);
    if(!panel){
      panel=document.createElement('nav');
      panel.id=PANEL_ID;
      panel.className='hidden';
      panel.setAttribute('aria-label','Site menu');
      document.body.appendChild(panel);
    }
    return panel;
  }

  function closeMenu(){
    const btn=ensureButton(),panel=ensurePanel();
    panel.classList.add('hidden');
    btn?.setAttribute('aria-expanded','false');
  }

  function rebuildMenu(){
    const panel=ensurePanel();
    const shell=document.querySelector('.site-shell-nav');
    if(!shell)return;
    const items=[...shell.querySelectorAll('button[data-shell-page]')];
    if(!items.length)return;

    panel.replaceChildren(...items.map(src=>{
      const b=document.createElement('button');
      b.type='button';
      b.textContent=(src.innerText||src.textContent||'').trim();
      b.dataset.shellMobilePage=src.dataset.shellPage||'';
      if(src.classList.contains('active'))b.classList.add('active');
      b.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        src.click();
      });
      return b;
    }));
  }

  function openMenu(){
    const btn=ensureButton(),panel=ensurePanel();
    if(!btn)return;
    rebuildMenu();
    panel.classList.remove('hidden');
    btn.setAttribute('aria-expanded','true');
  }

  function toggleMenu(){
    const btn=ensureButton(),panel=ensurePanel();
    if(!btn)return;
    const open=btn.getAttribute('aria-expanded')==='true'&&!panel.classList.contains('hidden');
    open?closeMenu():openMenu();
  }

  function prepare(){
    ensureButton();
    ensurePanel();
    const old=document.getElementById('mobileNav');
    if(old){old.setAttribute('aria-hidden','true')}
  }

  document.addEventListener('click',e=>{
    if(window.innerWidth>1023)return;
    const trigger=e.target.closest?.('#mobileMenuBtn');
    if(trigger){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      toggleMenu();
      return;
    }
    const panel=document.getElementById(PANEL_ID);
    if(!panel||panel.classList.contains('hidden'))return;
    if(e.target.closest?.('#'+PANEL_ID))return;
    closeMenu();
  },true);

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()},true);
  window.addEventListener('resize',()=>{if(window.innerWidth>1023)closeMenu()},{passive:true});

  prepare();
  setTimeout(prepare,250);
  setTimeout(prepare,900);
  setTimeout(prepare,1800);

  let timer=null;
  const observer=new MutationObserver(()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
      prepare();
      const btn=document.getElementById('mobileMenuBtn');
      if(btn?.getAttribute('aria-expanded')==='true')rebuildMenu();
    },60);
  });
  observer.observe(document.body,{childList:true,subtree:true});
})();