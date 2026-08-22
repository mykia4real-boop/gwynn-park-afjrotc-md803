(()=>{
  function clean(){
    document.querySelectorAll('.public-nav,#mobileNav').forEach(nav=>{
      [...nav.querySelectorAll('button,a')].forEach(el=>{
        const text=(el.textContent||'').trim().toLowerCase();
        if(el.dataset?.public==='ranks'||text==='ranks & info'||text==='ranks and info'||el.classList.contains('ranks-direct-link')) el.remove();
      });
    });
  }
  clean();
  setTimeout(clean,100);setTimeout(clean,500);setTimeout(clean,1200);
})();