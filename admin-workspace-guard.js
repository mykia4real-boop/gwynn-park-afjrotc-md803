(()=>{
  if(window.__adminWorkspaceGuard)return;window.__adminWorkspaceGuard=true;
  const $=id=>document.getElementById(id);
  const commandParts=()=>document.querySelectorAll('.command-head,.stats-grid,.dashboard-grid,.bottom-grid');
  const workspaces=['cadetWorkspace','contentWorkspace','taskWorkspace','siteWorkspace'];
  function hideAll(){workspaces.forEach(id=>$(id)?.classList.add('hidden'));commandParts().forEach(x=>x.classList.add('hidden'))}
  function showOnly(target){
    hideAll();
    if(target==='command'){commandParts().forEach(x=>x.classList.remove('hidden'));return}
    const map={cadets:'cadetWorkspace',content:'contentWorkspace',tasks:'taskWorkspace',site:'siteWorkspace'};
    $(map[target]||'')?.classList.remove('hidden');
  }
  function targetFromClick(e){
    if(e.target.closest('[data-task-site-management]'))return'site';
    const b=e.target.closest('.admin-nav [data-section]');if(!b)return null;
    const k=b.dataset.section;return ['command','cadets','content','tasks'].includes(k)?k:null;
  }
  document.addEventListener('click',e=>{const target=targetFromClick(e);if(!target)return;setTimeout(()=>showOnly(target),0);setTimeout(()=>showOnly(target),120)},true);
  window.enforceAdminWorkspace=showOnly;
})();