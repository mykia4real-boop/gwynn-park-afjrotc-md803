(()=>{
  let scheduled=false;

  function setup(container,isMobile=false){
    if(!container)return;

    let home=container.querySelector('[data-public="home"]');
    let dash=container.querySelector('[data-public="cadet-dashboard"]');

    if(!home){
      home=document.createElement('button');
      home.dataset.public='home';
      container.prepend(home);
    }
    if(!dash){
      dash=document.createElement('button');
      dash.dataset.public='cadet-dashboard';
      home.after(dash);
    }

    // Keep these two entries permanently first in the navigation.
    if(container.firstElementChild!==home) container.prepend(home);
    if(home.nextElementSibling!==dash) home.after(dash);

    home.textContent='Home';
    home.dataset.shellIcon='⌂';
    home.classList.remove('hidden');
    home.removeAttribute('hidden');

    dash.textContent='My Dashboard';
    dash.dataset.shellIcon='▦';
    dash.classList.remove('hidden');
    dash.removeAttribute('hidden');
    dash.id=isMobile?'mobileCadetDashboard':'cadetDashboardNav';

    if(!home.dataset.navBound){
      home.dataset.navBound='1';
      home.addEventListener('click',e=>{
        e.preventDefault();
        if(typeof showPublic==='function')showPublic('home');
        if(isMobile)document.getElementById('mobileNav')?.classList.add('hidden');
      });
    }

    if(!dash.dataset.navBound){
      dash.dataset.navBound='1';
      dash.addEventListener('click',e=>{
        e.preventDefault();
        if(typeof sessionUser!=='undefined'&&sessionUser){
          if(typeof showPublic==='function')showPublic('cadet-dashboard');
        }else{
          document.getElementById('signInBtn')?.click();
        }
        if(isMobile)document.getElementById('mobileNav')?.classList.add('hidden');
      });
    }
  }

  function ensureNav(){
    scheduled=false;
    setup(document.querySelector('.public-nav'),false);
    setup(document.getElementById('mobileNav'),true);
    document.getElementById('public-home')?.style.removeProperty('display');
    document.getElementById('public-cadet-dashboard')?.style.removeProperty('display');
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(ensureNav);
  }

  ensureNav();
  [150,500,1200,2500].forEach(ms=>setTimeout(ensureNav,ms));
  // Observe only DOM additions/removals. Watching style/class changes caused a feedback loop
  // that could make the site feel unclickable.
  new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});
  window.addEventListener('pageshow',ensureNav);
})();