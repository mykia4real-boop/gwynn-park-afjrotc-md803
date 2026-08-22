(()=>{
  const ADMIN_ROLES=['command_staff','admin','instructor'];
  const canManage=()=>!!currentProfile&&ADMIN_ROLES.includes(currentProfile.role);

  if(typeof openAdmin==='function'){
    const originalOpenAdmin=openAdmin;
    openAdmin=async function(){
      if(!currentProfile||!canManage()){
        alert('You do not have admin access.');
        return;
      }
      if(currentProfile.role!=='command_staff') return originalOpenAdmin();
      const actualRole=currentProfile.role;
      currentProfile.role='admin';
      try{return await originalOpenAdmin();}
      finally{currentProfile.role=actualRole;}
    };
  }

  if(typeof refreshAll==='function'){
    const originalRefreshAll=refreshAll;
    refreshAll=async function(reopenAdmin=false){
      await originalRefreshAll(false);
      if(reopenAdmin&&canManage()) await openAdmin();
    };
  }

  if(typeof renderAdmin==='function'){
    const originalRenderAdmin=renderAdmin;
    renderAdmin=function(){
      originalRenderAdmin();
      document.querySelectorAll('select[data-role-user]').forEach(select=>{
        const profile=(profiles||[]).find(p=>p.id===select.dataset.roleUser);
        const options=[
          ['cadet','Cadet'],
          ['class_leader','Class Leader'],
          ['command_staff','Command Staff'],
          ['instructor','Instructor']
        ];
        select.innerHTML=options.map(([value,label])=>`<option value="${value}"${profile?.role===value?' selected':''}>${label}</option>`).join('');
      });
    };
  }
})();