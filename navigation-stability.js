(()=>{
  if(document.getElementById('navigationStabilityStyles'))return;
  const s=document.createElement('style');
  s.id='navigationStabilityStyles';
  s.textContent=`
  @media(min-width:1024px){
    .public-header{overflow:hidden!important;}
    .public-nav{flex:1 1 auto!important;min-height:0!important;max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important;padding-bottom:8px!important;}
    .public-nav button[data-public="home"],.public-nav button[data-public="cadet-dashboard"]{position:sticky!important;z-index:4!important;background:#0b2747!important;}
    .public-nav button[data-public="home"]{top:0!important;}
    .public-nav button[data-public="cadet-dashboard"]{top:50px!important;margin-bottom:4px!important;}
    .public-nav button[data-public="home"].active,.public-nav button[data-public="cadet-dashboard"].active{background:#173f6b!important;}
    .public-header>#adminPortalBtn,.public-header>#signInBtn{flex:0 0 auto!important;width:100%!important;min-height:44px!important;margin:4px 0 0!important;border-radius:11px!important;position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;pointer-events:auto!important;z-index:5!important;}
    body.site-rail-open .public-header>#adminPortalBtn,body.site-rail-open .public-header>#signInBtn{font-size:13px!important;}
    #publicSite,.public-page,.public-page *{pointer-events:auto;}
    .site-rail-toggle{pointer-events:auto!important;}
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