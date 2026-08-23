(()=>{
  if(window.__panelControlOrderFix)return;
  window.__panelControlOrderFix=true;

  const style=document.createElement('style');
  style.id='panelControlOrderStyles';
  style.textContent=`
    @media(min-width:1024px){
      body.account-shell{--cadet-panel:286px!important}
      body.account-shell .public-header{padding:18px 14px 16px!important}
      body.account-shell .site-shell-nav{order:2!important;flex:1 1 auto!important;margin:14px 0 10px!important;min-height:0!important;overflow-y:auto!important}
      body.account-shell #signInBtn,
      body.account-shell #adminPortalBtn{order:3!important;flex:0 0 auto!important;width:100%!important;margin:6px 0 0!important;min-height:46px!important;border-radius:10px!important}
      body.account-shell #signInBtn{background:#103b60!important;color:#eef5fb!important;border:1px solid rgba(255,255,255,.10)!important}
      body.account-shell #adminPortalBtn{background:#ffd83d!important;color:#071528!important;border:0!important}
      body.account-shell .public-brand{order:1!important}
      body.account-shell #publicSite,body.account-shell #publicFooter,body.account-shell .site-alert-banner{margin-left:286px!important}
      body.account-shell .public-header .mobile-menu-btn{display:none!important}
    }
  `;
  document.head.appendChild(style);

  function reorder(){
    if(!document.body.classList.contains('account-shell'))return;
    const header=document.querySelector('.public-header');
    const nav=header?.querySelector('.site-shell-nav');
    const sign=document.getElementById('signInBtn');
    const admin=document.getElementById('adminPortalBtn');
    if(!header||!nav)return;

    header.appendChild(nav);
    if(sign){
      sign.classList.remove('shell-admin-button');
      header.appendChild(sign);
    }
    if(admin){
      admin.classList.remove('hidden');
      admin.textContent='Admin Control Center';
      admin.onclick=()=>location.href='/admin.html';
      header.appendChild(admin);
    }
  }

  reorder();
  [100,350,800,1500].forEach(ms=>setTimeout(reorder,ms));
  document.addEventListener('click',()=>setTimeout(reorder,0));
})();