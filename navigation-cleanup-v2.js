(()=>{
  const selector='[data-public="cadet-dashboard"],#cadetDashboardNav,#mobileCadetDashboard';

  function hideLegacyDashboard(root=document){
    if(root?.matches?.(selector)){
      root.classList.add('hidden');
      root.hidden=true;
    }
    root?.querySelectorAll?.(selector).forEach(el=>{
      el.classList.add('hidden');
      el.hidden=true;
    });
    document.querySelectorAll('[data-public="home"]').forEach(el=>{el.textContent='Home';});
  }

  if(!document.getElementById('legacyDashboardCleanupStyles')){
    const s=document.createElement('style');
    s.id='legacyDashboardCleanupStyles';
    s.textContent='[data-public="cadet-dashboard"],#cadetDashboardNav,#mobileCadetDashboard{display:none!important}';
    document.head.appendChild(s);
  }

  hideLegacyDashboard();
  const observer=new MutationObserver(records=>{
    records.forEach(record=>record.addedNodes.forEach(node=>{
      if(node.nodeType===1) hideLegacyDashboard(node);
    }));
  });
  observer.observe(document.body,{subtree:true,childList:true});
  window.addEventListener('pageshow',()=>hideLegacyDashboard());
})();