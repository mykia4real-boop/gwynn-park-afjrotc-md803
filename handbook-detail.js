(()=>{
  function openHandbook(){window.location.href='/handbook.html'}
  function addHandbookNav(){
    document.querySelectorAll('.public-nav').forEach(nav=>{
      let existing=[...nav.querySelectorAll('button,a')].find(el=>/Cadet Handbook|Handbook/i.test(el.textContent||''));
      if(existing){existing.onclick=e=>{e.preventDefault();openHandbook()};return;}
      const btn=document.createElement('button');btn.type='button';btn.dataset.public='handbook';btn.textContent='Cadet Handbook';btn.addEventListener('click',openHandbook);nav.appendChild(btn);
    });
    document.querySelectorAll('nav,.nav-links,.sidebar-nav,#sideNav').forEach(nav=>{
      if(nav.classList.contains('public-nav'))return;
      const existing=[...nav.querySelectorAll('button,a')].find(el=>/Cadet Handbook|Handbook/i.test(el.textContent||''));
      if(existing){existing.addEventListener('click',e=>{e.preventDefault();openHandbook()});}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(addHandbookNav,700));else setTimeout(addHandbookNav,700);
  setTimeout(addHandbookNav,1400);
  window.MD803Handbook={show:openHandbook,open:openHandbook};
})();