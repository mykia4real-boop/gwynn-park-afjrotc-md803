(()=>{
  function ensure(){
    document.querySelectorAll('.public-nav').forEach(nav=>{
      const old=nav.querySelector('[data-public="uniform"]');
      if(old){
        if(old.textContent!=='Uniform of the Day') old.textContent='Uniform of the Day';
        old.dataset.shellIcon='◇';
      }
      if(!nav.querySelector('[data-uniform-guide]')){
        const guide=document.createElement('button');
        guide.type='button';
        guide.dataset.uniformGuide='1';
        guide.dataset.shellIcon='♜';
        guide.textContent='Uniform Guide';
        guide.addEventListener('click',()=>{window.location.href='/uniform.html'});
        if(old) old.insertAdjacentElement('afterend',guide); else nav.appendChild(guide);
      }
      if(![...nav.querySelectorAll('button')].some(b=>/Cadet Handbook/i.test(b.textContent||''))){
        const hb=document.createElement('button');
        hb.type='button';
        hb.dataset.shellIcon='▤';
        hb.textContent='Cadet Handbook';
        hb.addEventListener('click',()=>{window.location.href='/handbook.html'});
        const ranks=nav.querySelector('[data-public="ranks"]');
        if(ranks) ranks.insertAdjacentElement('afterend',hb); else nav.appendChild(hb);
      }
    });
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-public="uniform"]');
    if(!b)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.href='/uniform-day.html';
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensure();setTimeout(ensure,350);setTimeout(ensure,1000)},{once:true});else{ensure();setTimeout(ensure,350);setTimeout(ensure,1000)}
})();