(()=>{
  function ensureNav(){
    const desktop=document.querySelector('.public-nav');
    const mobile=document.getElementById('mobileNav');

    const setup=(container,isMobile=false)=>{
      if(!container)return;
      let home=container.querySelector('[data-public="home"]');
      let dash=container.querySelector('[data-public="cadet-dashboard"]');

      if(!home){
        home=document.createElement('button');
        home.dataset.public='home';
        container.prepend(home);
      }
      home.textContent='Home';
      home.dataset.shellIcon='⌂';
      home.classList.remove('hidden');

      if(!dash){
        dash=document.createElement('button');
        dash.dataset.public='cadet-dashboard';
        if(home.nextSibling)container.insertBefore(dash,home.nextSibling); else container.appendChild(dash);
      }
      dash.textContent='My Dashboard';
      dash.dataset.shellIcon='▦';
      dash.classList.remove('hidden');
      if(isMobile){dash.id='mobileCadetDashboard';} else {dash.id='cadetDashboardNav';}

      home.onclick=(e)=>{e.preventDefault(); if(typeof showPublic==='function')showPublic('home');};
      dash.onclick=(e)=>{
        e.preventDefault();
        if(typeof sessionUser!=='undefined' && sessionUser){
          if(typeof showPublic==='function')showPublic('cadet-dashboard');
        }else{
          document.getElementById('signInBtn')?.click();
        }
      };
    };

    setup(desktop,false);
    setup(mobile,true);

    const home=document.getElementById('public-home');
    const dashPage=document.getElementById('public-cadet-dashboard');
    if(home)home.style.display='';
    if(dashPage)dashPage.style.display='';
  }

  ensureNav();
  setTimeout(ensureNav,100);
  setTimeout(ensureNav,500);
  setTimeout(ensureNav,1200);
})();
