(()=>{
  function injectStyles(){
    if(document.getElementById('dashboardSeparationStyles'))return;
    const s=document.createElement('style');
    s.id='dashboardSeparationStyles';
    s.textContent=`
      #public-home{display:none}
      #public-home.active{display:block!important}
      #public-cadet-dashboard{display:none}
      #public-cadet-dashboard.active{display:block!important}
      #cadetDashboardNav,#mobileCadetDashboard{display:flex!important}
    `;
    document.head.appendChild(s);
  }

  function labelNavigation(){
    document.querySelectorAll('[data-public="home"]').forEach(btn=>{
      btn.dataset.shellIcon='⌂';
      if(btn.closest('.public-nav')||btn.closest('#mobileNav')) btn.textContent='Home';
    });
    document.querySelectorAll('[data-public="cadet-dashboard"]').forEach(btn=>{
      btn.dataset.shellIcon='▦';
      if(btn.closest('.public-nav')||btn.closest('#mobileNav')) btn.textContent='My Dashboard';
    });
  }

  function setDefaultPage(){
    if(location.pathname.endsWith('/admin.html'))return;
    const active=document.querySelector('.public-page.active');
    if(!active){
      try{showPublic('home')}catch(_){ }
    }
  }

  const originalRenderCadetDashboard=typeof renderCadetDashboard==='function'?renderCadetDashboard:null;
  if(originalRenderCadetDashboard){
    renderCadetDashboard=function(){
      originalRenderCadetDashboard();
      const acct=document.getElementById('cadetAccountBtn');
      if(acct){
        acct.textContent=sessionUser?'My Account':'Sign In';
        acct.onclick=()=>document.getElementById('signInBtn')?.click();
      }
    };
  }

  injectStyles();
  labelNavigation();
  if(originalRenderCadetDashboard) renderCadetDashboard();
  setDefaultPage();

  const observer=new MutationObserver(()=>labelNavigation());
  observer.observe(document.body,{childList:true,subtree:true});
})();
