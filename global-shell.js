(()=>{
  const style=document.createElement('style');
  style.id='standaloneUnifiedShellGuard';
  style.textContent=`.public-header .public-nav{display:none!important}body.shell-loading .public-header{visibility:hidden!important}.guide-head .day-link[href*="uniform-day"]{display:none!important}`;
  document.head.appendChild(style);

  if(!window.__afjrotcUnifiedShell&&!document.querySelector('script[data-unified-site-shell]')){
    const s=document.createElement('script');
    s.src='/site-shell.js?release=20260828-ranks-visible-v2';
    s.async=false;
    s.dataset.unifiedSiteShell='1';
    document.head.appendChild(s);
  }

  if(!window.__afjrotcRanksRouteFix&&!document.querySelector('script[data-ranks-route-fix]')){
    const r=document.createElement('script');
    r.src='/ranks-direct-link.js?release=20260828-ranks-visible-v2';
    r.async=false;
    r.dataset.ranksRouteFix='1';
    document.head.appendChild(r);
  }
})();