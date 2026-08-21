(()=>{
  if(document.getElementById('navigationStabilityStyles'))return;
  const s=document.createElement('style');
  s.id='navigationStabilityStyles';
  s.textContent=`
  @media(min-width:1024px){
    /* Keep the panel itself open so the yellow edge toggle can extend outside it. */
    .public-header{overflow:visible!important;}
    /* Only the navigation list scrolls. */
    .public-nav{flex:1 1 auto!important;min-height:0!important;max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important;padding-bottom:8px!important;}
    /* Home and My Dashboard/Profile scroll normally with every other nav item. */
    .public-nav button[data-public="home"],.public-nav button[data-public="cadet-dashboard"]{position:relative!important;top:auto!important;z-index:auto!important;background:transparent!important;}
    .public-nav button[data-public="home"].active,.public-nav button[data-public="cadet-dashboard"].active{background:#173f6b!important;}
    .site-rail-toggle{right:-20px!important;z-index:90!important;pointer-events:auto!important;}
    .public-header>#adminPortalBtn,.public-header>#signInBtn{flex:0 0 auto!important;width:100%!important;min-height:44px!important;margin:4px 0 0!important;border-radius:11px!important;position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;pointer-events:auto!important;z-index:5!important;}
    body.site-rail-open .public-header>#adminPortalBtn,body.site-rail-open .public-header>#signInBtn{font-size:13px!important;}
    #publicSite,.public-page,.public-page *{pointer-events:auto;}
  }
  `;
  document.head.appendChild(s);

  // Remove stale invisible mobile navigation layers on desktop.
  const clearDesktopOverlay=()=>{
    if(matchMedia('(min-width:1024px)').matches){
      const mobile=document.getElementById('mobileNav');
      if(mobile){mobile.classList.add('hidden');mobile.style.pointerEvents='none';}
    }else{
      document.getElementById('mobileNav')?.style.removeProperty('pointer-events');
    }
  };
  clearDesktopOverlay();
  window.addEventListener('resize',clearDesktopOverlay);
})();