(()=>{
  if(window.__afjrotcMobileMenuFinal)return;
  window.__afjrotcMobileMenuFinal=true;

  const style=document.createElement('style');
  style.id='mobileMenuFinalFixStyles';
  style.textContent=`
    @media(min-width:1024px){
      #mobileNav{display:none!important}
      .public-header .mobile-menu-btn{display:none!important}
    }
    @media(max-width:1023px){
      .public-header{z-index:5000!important}
      .public-header .mobile-menu-btn{
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        position:relative!important;
        z-index:5002!important;
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
      #mobileNav.hidden{display:none!important}
      #mobileNav:not(.hidden){
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
        z-index:5001!important;
        padding:10px!important;
        margin:0!important;
        border:1px solid rgba(143,178,207,.28)!important;
        border-radius:14px!important;
        background:#061f35!important;
        box-shadow:0 18px 42px rgba(0,0,0,.38)!important;
        box-sizing:border-box!important;
        visibility:visible!important;
        opacity:1!important;
        pointer-events:auto!important;
      }
      #mobileNav:not(.hidden) button{
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
      #mobileNav:not(.hidden) button.active{background:#205a89!important;color:#fff!important}
    }
  `;
  document.head.appendChild(style);

  const get=()=>({btn:document.getElementById('mobileMenuBtn'),nav:document.getElementById('mobileNav')});

  function closeMenu(){
    const {btn,nav}=get();
    if(!btn||!nav)return;
    nav.classList.add('hidden');
    nav.style.setProperty('display','none','important');
    btn.setAttribute('aria-expanded','false');
  }

  function rebuildMenu(){
    const {nav}=get();
    const shell=document.querySelector('.site-shell-nav');
    if(!nav||!shell)return;
    const items=[...shell.querySelectorAll('button[data-shell-page]')];
    if(!items.length)return;
    nav.innerHTML='';
    items.forEach(src=>{
      const b=document.createElement('button');
      b.type='button';
      b.textContent=(src.innerText||src.textContent||'').trim();
      b.dataset.mobileShellPage=src.dataset.shellPage||'';
      if(src.classList.contains('active'))b.classList.add('active');
      b.addEventListener('click',ev=>{
        ev.preventDefault();
        ev.stopPropagation();
        closeMenu();
        src.click();
      });
      nav.appendChild(b);
    });
  }

  function openMenu(){
    const {btn,nav}=get();
    if(!btn||!nav)return;
    rebuildMenu();
    nav.classList.remove('hidden');
    nav.style.setProperty('display','grid','important');
    nav.style.setProperty('visibility','visible','important');
    nav.style.setProperty('opacity','1','important');
    nav.style.setProperty('pointer-events','auto','important');
    btn.setAttribute('aria-expanded','true');
  }

  function toggleMenu(){
    const {btn,nav}=get();
    if(!btn||!nav)return;
    const open=btn.getAttribute('aria-expanded')==='true'&&!nav.classList.contains('hidden');
    open?closeMenu():openMenu();
  }

  function prepare(){
    const {btn,nav}=get();
    if(!btn||!nav)return false;
    btn.type='button';
    btn.style.setProperty('pointer-events','auto','important');
    if(!btn.hasAttribute('aria-expanded'))btn.setAttribute('aria-expanded','false');
    if(btn.getAttribute('aria-expanded')!=='true')closeMenu();
    return true;
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
    const {nav}=get();
    if(!nav||nav.classList.contains('hidden'))return;
    if(e.target.closest?.('#mobileNav'))return;
    closeMenu();
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeMenu();
  },true);

  prepare();
  setTimeout(prepare,300);
  setTimeout(prepare,1000);
  setTimeout(prepare,2200);
  const observer=new MutationObserver(()=>prepare());
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();