(()=>{
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

    if(container.firstElementChild!==home)container.prepend(home);
    if(home.nextElementSibling!==dash)home.after(dash);

    home.textContent='Home';
    home.dataset.shellIcon='⌂';
    home.classList.remove('hidden');
    home.removeAttribute('hidden');
    home.style.removeProperty('display');

    dash.textContent='My Dashboard';
    dash.dataset.shellIcon='▦';
    dash.classList.remove('hidden');
    dash.removeAttribute('hidden');
    dash.style.removeProperty('display');
    dash.id=isMobile?'mobileCadetDashboard':'cadetDashboardNav';

    home.onclick=e=>{
      e.preventDefault();
      if(typeof showPublic==='function')showPublic('home');
      if(isMobile)document.getElementById('mobileNav')?.classList.add('hidden');
    };
    dash.onclick=e=>{
      e.preventDefault();
      if(typeof sessionUser!=='undefined'&&sessionUser){
        if(typeof showPublic==='function')showPublic('cadet-dashboard');
      }else{
        document.getElementById('signInBtn')?.click();
      }
      if(isMobile)document.getElementById('mobileNav')?.classList.add('hidden');
    };
  }

  function ensureNav(){
    setup(document.querySelector('.public-nav'),false);
    setup(document.getElementById('mobileNav'),true);
    document.getElementById('public-home')?.style.removeProperty('display');
    document.getElementById('public-cadet-dashboard')?.style.removeProperty('display');
  }

  ensureNav();
  setTimeout(ensureNav,300);
  setTimeout(ensureNav,1200);
  window.addEventListener('pageshow',ensureNav);
})();