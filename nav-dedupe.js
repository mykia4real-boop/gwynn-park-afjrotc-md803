(()=>{
  const normalize=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  function clean(){
    document.querySelectorAll('.public-nav').forEach(nav=>{
      const seen=new Set();
      [...nav.querySelectorAll('button,a')].forEach(el=>{
        const label=normalize(el.textContent);
        if(!label)return;
        if(seen.has(label))el.remove();
        else seen.add(label);
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{setTimeout(clean,1400);setTimeout(clean,2400)},{once:true});
  else{setTimeout(clean,1400);setTimeout(clean,2400)}
  window.addEventListener('pageshow',()=>setTimeout(clean,250));
})();