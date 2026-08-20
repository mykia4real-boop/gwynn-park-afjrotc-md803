(()=>{
  function ensure(){
    document.querySelectorAll('.public-nav').forEach(nav=>{
      const uniform=nav.querySelector('[data-public="uniform"]');
      if(uniform){uniform.textContent='Uniform of the Day';uniform.dataset.shellIcon='◇';}

      let handbook=[...nav.querySelectorAll('button')].find(b=>/Cadet Handbook/i.test(b.textContent||''));
      if(!handbook){
        handbook=document.createElement('button');
        handbook.type='button';
        handbook.dataset.shellIcon='▤';
        handbook.textContent='Cadet Handbook';
        handbook.addEventListener('click',()=>location.href='/handbook.html');
        const ranks=nav.querySelector('[data-public="ranks"]');
        if(ranks) ranks.insertAdjacentElement('afterend',handbook); else nav.appendChild(handbook);
      }

      let guide=nav.querySelector('[data-uniform-guide]');
      if(!guide){
        guide=document.createElement('button');
        guide.type='button';
        guide.dataset.uniformGuide='1';
        guide.dataset.shellIcon='♜';
        guide.textContent='Uniform Guide';
        guide.addEventListener('click',()=>location.href='/uniform.html');
      }
      handbook.insertAdjacentElement('afterend',guide);
    });
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-public="uniform"]');
    if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();location.href='/uniform-day.html';
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensure();setTimeout(ensure,300)},{once:true});else{ensure();setTimeout(ensure,300)}
})();