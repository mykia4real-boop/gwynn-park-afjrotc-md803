(()=>{
  if(document.getElementById('mobileMenuFinalFixStyles'))return;

  const style=document.createElement('style');
  style.id='mobileMenuFinalFixStyles';
  style.textContent=`
    @media(min-width:1024px){
      #mobileNav{display:none!important}
      .public-header .mobile-menu-btn{display:none!important}
    }
    @media(max-width:1023px){
      .public-header .mobile-menu-btn{
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        position:relative!important;
        z-index:2100!important;
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
        z-index:2000!important;
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
        min-height:44px!important;
        padding:10px 12px!important;
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
      #mobileNav:not(.hidden) button:hover,
      #mobileNav:not(.hidden) button.active{
        background:#205a89!important;
        color:#fff!important;
      }
    }
  `;
  document.head.appendChild(style);

  const btn=document.getElementById('mobileMenuBtn');
  const nav=document.getElementById('mobileNav');
  if(!btn||!nav)return;

  btn.type='button';
  btn.style.pointerEvents='auto';

  document.addEventListener('click',e=>{
    if(window.innerWidth>1023)return;
    if(nav.classList.contains('hidden'))return;
    if(e.target.closest('#mobileMenuBtn')||e.target.closest('#mobileNav'))return;
    nav.classList.add('hidden');
    btn.setAttribute('aria-expanded','false');
  });
})();