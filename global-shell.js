(()=>{
  const style=document.createElement('style');
  style.id='standaloneUnifiedShellGuard';
  style.textContent=`
    .public-header .public-nav{display:none!important}
    @media(min-width:1024px){
      body:not(.guest-shell):not(.account-shell) .public-header{visibility:hidden!important}
    }
  `;
  document.head.appendChild(style);

  if(window.__afjrotcUnifiedShell)return;
  if(document.querySelector('script[data-unified-site-shell]'))return;
  const s=document.createElement('script');
  s.src='/site-shell.js?final=uniform-sync';
  s.async=false;
  s.dataset.unifiedSiteShell='1';
  document.head.appendChild(s);
})();