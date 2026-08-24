(()=>{
  // Legacy compatibility shim. The responsive layout now belongs exclusively to site-shell.js.
  if(window.__afjrotcUnifiedShell)return;
  if(document.querySelector('script[data-unified-site-shell]'))return;
  const s=document.createElement('script');
  s.src='/site-shell.js?release=20260824-shell-sync';
  s.async=false;
  s.dataset.unifiedSiteShell='1';
  document.head.appendChild(s);
})();