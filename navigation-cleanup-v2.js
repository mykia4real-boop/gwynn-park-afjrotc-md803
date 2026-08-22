(()=>{
  function apply(){
    document.querySelectorAll('[data-public="cadet-dashboard"],#cadetDashboardNav,#mobileCadetDashboard').forEach(el=>{
      el.classList.add('hidden');
      el.setAttribute('hidden','');
      el.style.setProperty('display','none','important');
    });
    document.querySelectorAll('[data-public="home"]').forEach(el=>{el.textContent='Home';});
  }

  if(!document.getElementById('legacyDashboardCleanupStyles')){
    const s=document.createElement('style');
    s.id='legacyDashboardCleanupStyles';
    s.textContent='[data-public="cadet-dashboard"],#cadetDashboardNav,#mobileCadetDashboard{display:none!important}';
    document.head.appendChild(s);
  }

  apply();
  const observer=new MutationObserver(apply);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
  window.addEventListener('pageshow',apply);
  setTimeout(apply,100);
  setTimeout(apply,500);
  setTimeout(apply,1500);
})();