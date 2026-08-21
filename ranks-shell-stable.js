(()=>{
  function ensureRanksShell(){
    const site=document.getElementById('publicSite');
    if(!site)return false;

    let page=document.getElementById('public-ranks');
    if(!page){
      page=document.createElement('section');
      page.id='public-ranks';
      page.className='public-page';
      const settings=document.getElementById('public-site-settings');
      if(settings)site.insertBefore(page,settings); else site.appendChild(page);
    }

    const addButton=(nav,id)=>{
      if(!nav||document.getElementById(id))return;
      const b=document.createElement('button');
      b.id=id;
      b.dataset.public='ranks';
      b.textContent='Ranks & Info';
      try{ if(typeof sessionUser==='undefined'||!sessionUser)b.classList.add('hidden'); }catch(_){ b.classList.add('hidden'); }
      nav.appendChild(b);
    };

    addButton(document.querySelector('.public-nav'),'ranksNavBtn');
    addButton(document.getElementById('mobileNav'),'mobileRanksNavBtn');
    return true;
  }

  ensureRanksShell();
  setTimeout(ensureRanksShell,100);
  setTimeout(ensureRanksShell,500);
})();