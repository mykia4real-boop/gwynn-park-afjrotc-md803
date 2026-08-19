(()=>{
  function injectStyles(){
    if(document.getElementById('unifiedDashboardStyles'))return;
    const s=document.createElement('style');
    s.id='unifiedDashboardStyles';
    s.textContent=`
      #public-home{display:none!important}
      #cadetDashboardNav,#mobileCadetDashboard{display:none!important}
    `;
    document.head.appendChild(s);
  }

  function unifyNavigation(){
    document.querySelectorAll('[data-public="home"]').forEach(btn=>{
      btn.dataset.public='cadet-dashboard';
      btn.dataset.shellIcon='▦';
      if(btn.closest('.public-nav')||btn.closest('#mobileNav')) btn.textContent='My Dashboard';
    });
  }

  const originalShowPublic=showPublic;
  showPublic=function(page){
    return originalShowPublic(page==='home'?'cadet-dashboard':page);
  };

  const originalRenderCadetDashboard=renderCadetDashboard;
  renderCadetDashboard=function(){
    originalRenderCadetDashboard();
    const name=document.getElementById('cadetWelcomeName');
    const meta=document.getElementById('cadetWelcomeMeta');
    const acct=document.getElementById('cadetAccountBtn');
    if(!sessionUser){
      if(name)name.textContent='AFJROTC Dashboard';
      if(meta)meta.textContent='Gwynn Park High School AFJROTC';
      if(acct)acct.textContent='Sign In';
    }else if(acct){
      acct.textContent='My Account';
    }
    if(acct)acct.onclick=()=>document.getElementById('signInBtn')?.click();
  };

  injectStyles();
  unifyNavigation();
  renderCadetDashboard();

  if(!location.pathname.endsWith('/admin.html')){
    const active=document.querySelector('.public-page.active');
    if(!active||active.id==='public-home') showPublic('cadet-dashboard');
  }
})();
