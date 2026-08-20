(()=>{
  let started=false;
  function rename(){document.querySelectorAll('button[data-public="cadet-dashboard"]').forEach(b=>b.textContent='My Profile')}
  function boot(){
    rename();
    if(started||!window.sb||!window.sessionUser)return;
    started=true;
    const s=document.createElement('script');
    s.src='profile-dashboard.js?v=57-auth';
    s.onload=rename;
    document.body.appendChild(s);
  }
  rename();
  const timer=setInterval(()=>{boot();if(started)clearInterval(timer)},150);
  setTimeout(()=>clearInterval(timer),15000);
  document.addEventListener('click',e=>{if(e.target.closest('[data-public="cadet-dashboard"]'))setTimeout(boot,0)});
})();