(()=>{
  let syncing=false;
  function ensureNav(){
    if(syncing)return;
    syncing=true;
    try{
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
        home.style.removeProperty('display');

        if(!dash){
          dash=document.createElement('button');
          dash.dataset.public='cadet-dashboard';
          if(home.nextSibling)container.insertBefore(dash,home.nextSibling); else container.appendChild(dash);
        }
        dash.textContent='My Dashboard';
        dash.dataset.shellIcon='▦';
        dash.classList.remove('hidden');
        dash.style.setProperty('display','flex','important');
        if(isMobile){dash.id='mobileCadetDashboard';} else {dash.id='cadetDashboardNav';}

        home.onclick=(e)=>{e.preventDefault();e.stopPropagation();if(typeof showPublic==='function')showPublic('home');};
        dash.onclick=(e)=>{
          e.preventDefault();e.stopPropagation();
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
      if(home)home.style.removeProperty('display');
      if(dashPage)dashPage.style.removeProperty('display');
    }finally{
      syncing=false;
    }
  }

  ensureNav();
  [100,300,700,1200,2000,3500].forEach(ms=>setTimeout(ensureNav,ms));
  const observer=new MutationObserver(()=>queueMicrotask(ensureNav));
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
  window.addEventListener('pageshow',ensureNav);
})();
