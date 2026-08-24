(()=>{
  if(window.__afjrotcRanksRouteFix)return;
  window.__afjrotcRanksRouteFix=true;

  function cleanLegacy(){
    document.querySelectorAll('.public-nav,#mobileNav').forEach(nav=>{
      [...nav.querySelectorAll('button,a')].forEach(el=>{
        const text=(el.textContent||'').trim().toLowerCase();
        if(el.dataset?.public==='ranks'||text==='ranks & info'||text==='ranks and info'||el.classList.contains('ranks-direct-link')) el.remove();
      });
    });
  }

  function syncActive(){
    if(!location.pathname.endsWith('/handbook.html')||location.hash!=='#ranks')return;
    document.querySelectorAll('.site-shell-nav [data-shell-page]').forEach(el=>el.classList.toggle('active',el.dataset.shellPage==='ranks'));
  }

  document.addEventListener('click',e=>{
    const ranks=e.target.closest('.site-shell-nav [data-shell-page="ranks"]');
    if(!ranks)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.href='/handbook.html#ranks';
  },true);

  const observer=new MutationObserver(()=>{cleanLegacy();syncActive()});
  observer.observe(document.body,{childList:true,subtree:true});
  cleanLegacy();syncActive();
  setTimeout(()=>{cleanLegacy();syncActive()},150);
  setTimeout(()=>{cleanLegacy();syncActive()},700);
})();