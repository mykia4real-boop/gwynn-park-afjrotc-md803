(()=>{
  function removeUniformDayNav(){
    document.querySelectorAll('[data-shell-page="uniform-day"], [data-public="uniform-day"]').forEach(el=>el.remove());
    document.querySelectorAll('button,a').forEach(el=>{
      const t=(el.textContent||'').trim().toLowerCase();
      const href=(el.getAttribute('href')||'').toLowerCase();
      const onclick=(el.getAttribute('onclick')||'').toLowerCase();
      if(t==='uniform of the day' && (href.includes('uniform-day') || onclick.includes('uniform-day') || el.closest('.site-shell-nav,.public-nav,#mobileNav'))){el.remove();}
    });
  }
  removeUniformDayNav();
  new MutationObserver(removeUniformDayNav).observe(document.documentElement,{childList:true,subtree:true});
})();