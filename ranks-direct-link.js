(()=>{
  if(window.__afjrotcRanksRouteFix)return;
  window.__afjrotcRanksRouteFix=true;

  const onRanksPage=()=>location.pathname.endsWith('/ranks.html');

  function makeRanksButton(nav,legacy=false){
    const b=document.createElement('button');
    b.type='button';
    if(legacy)b.dataset.public='ranks';
    else b.dataset.shellPage='ranks';
    b.className='ranks-direct-link';
    if(!legacy&&document.body.classList.contains('account-shell')){
      const icon=document.createElement('span');icon.className='shell-icon';icon.textContent='☆';
      const label=document.createElement('span');label.textContent='Ranks & Info';
      b.append(icon,label);
    }else b.textContent='Ranks & Info';
    return b;
  }

  function ensureRanksVisible(){
    document.querySelectorAll('.site-shell-nav').forEach(nav=>{
      let b=nav.querySelector('[data-shell-page="ranks"]');
      if(!b){b=makeRanksButton(nav,false);nav.appendChild(b)}
      if(onRanksPage())b.classList.add('active');
      else b.classList.remove('active');
    });

    document.querySelectorAll('.public-nav,#mobileNav').forEach(nav=>{
      let b=nav.querySelector('[data-public="ranks"],.ranks-direct-link');
      if(!b){b=makeRanksButton(nav,true);nav.appendChild(b)}
      b.classList.toggle('active',onRanksPage());
    });
  }

  document.addEventListener('click',e=>{
    const ranks=e.target.closest('[data-shell-page="ranks"],[data-public="ranks"],.ranks-direct-link');
    if(!ranks)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(!onRanksPage())location.href='/ranks.html';
  },true);

  const observer=new MutationObserver(()=>ensureRanksVisible());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  ensureRanksVisible();
  setTimeout(ensureRanksVisible,150);
  setTimeout(ensureRanksVisible,700);
  setTimeout(ensureRanksVisible,1600);
})();