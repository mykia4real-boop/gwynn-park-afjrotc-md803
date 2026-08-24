(()=>{
  const style=document.createElement('style');
  style.id='standaloneUnifiedShellGuard';
  style.textContent=`.public-header .public-nav{display:none!important}body.shell-loading .public-header{visibility:hidden!important}.guide-head .day-link[href*="uniform-day"]{display:none!important}`;
  document.head.appendChild(style);
  if(window.__afjrotcUnifiedShell)return;
  if(document.querySelector('script[data-unified-site-shell]'))return;
  const s=document.createElement('script');
  s.src='/site-shell.js?release=20260824-shell-sync';
  s.async=false;
  s.dataset.unifiedSiteShell='1';
  document.head.appendChild(s);
})();