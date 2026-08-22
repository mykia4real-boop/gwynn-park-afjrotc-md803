(()=>{
  function ensure(){
    document.querySelectorAll('.public-nav').forEach(nav=>{
      const uniform=nav.querySelector('[data-public="uniform"]');
      if(uniform){uniform.textContent='Cadet Dashboard';uniform.dataset.shellIcon='▦';}

      const handbookMatches=[...nav.querySelectorAll('button,a')].filter(el=>/Cadet Handbook/i.test((el.textContent||'').trim()));
      let handbook=handbookMatches[0]||null;
      handbookMatches.slice(1).forEach(el=>el.remove());

      if(!handbook){
        handbook=document.createElement('button');
        handbook.type='button';
        handbook.dataset.shellIcon='▤';
        handbook.textContent='Cadet Handbook';
        handbook.addEventListener('click',()=>location.href='/handbook.html');
        const ranks=[...nav.querySelectorAll('button,a')].find(el=>/Ranks\s*(?:&|and)\s*Info/i.test(el.textContent||'')||el.dataset?.public==='ranks');
        if(ranks) ranks.insertAdjacentElement('afterend',handbook); else nav.appendChild(handbook);
      }else{
        handbook.dataset.shellIcon='▤';
        if(handbook.tagName==='A') handbook.href='/handbook.html';
      }

      const guideMatches=[...nav.querySelectorAll('button,a')].filter(el=>el.dataset?.uniformGuide!==undefined||/Uniform Guide/i.test((el.textContent||'').trim()));
      let guide=guideMatches[0]||null;
      guideMatches.slice(1).forEach(el=>el.remove());
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