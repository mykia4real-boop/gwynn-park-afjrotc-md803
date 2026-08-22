(()=>{
  const ADMIN_ROLES=['command_staff','instructor'];
  const canAdmin=()=>!!currentProfile&&ADMIN_ROLES.includes(currentProfile.role);

  openAdmin=async function(){
    if(!sessionUser){
      if(typeof showGate==='function')showGate('Sign in with a Command Staff or Instructor account to continue.',true);
      return;
    }
    if(!canAdmin()){
      if(typeof showGate==='function')showGate('This account does not have access to the Admin Control Center.',false);
      else alert('You do not have admin access.');
      return;
    }

    const {data,error}=await sb.from('profiles')
      .select('id,full_name,email,role,flight,position,created_at')
      .order('created_at',{ascending:true});

    if(error){
      console.error('Admin profile load failed',error);
      if(typeof showGate==='function')showGate('Admin access was confirmed, but the dashboard data could not load. Refresh and try again.',false);
      else alert('Could not load the Admin Control Center: '+error.message);
      return;
    }

    profiles=data||[];
    document.getElementById('adminAccessGate')?.remove();
    if(typeof renderAdmin==='function')renderAdmin();
    document.getElementById('publicSite')?.classList.add('hidden');
    document.getElementById('publicFooter')?.classList.add('hidden');
    document.querySelector('.public-header')?.classList.add('hidden');
    document.getElementById('adminApp')?.classList.remove('hidden');
    if(typeof showAdminPage==='function')showAdminPage('dashboard');
  };

  const oldRefresh=typeof refreshAll==='function'?refreshAll:null;
  if(oldRefresh){
    refreshAll=async function(reopenAdmin=false){
      await oldRefresh(false);
      if(reopenAdmin&&canAdmin())await openAdmin();
    };
  }
})();