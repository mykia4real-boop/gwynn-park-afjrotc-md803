(()=>{
  function apply(){
    document.querySelectorAll('.public-nav').forEach(nav=>{
      const old=nav.querySelector('[data-public="uniform"]');
      if(old){
        old.textContent='Uniform of the Day';
        old.dataset.shellIcon='◇';
        old.onclick=()=>location.href='/uniform-day.html';
        if(!nav.querySelector('[data-uniform-guide]')){
          const guide=document.createElement('button');
          guide.type='button';
          guide.dataset.uniformGuide='1';
          guide.dataset.shellIcon='♜';
          guide.textContent='Uniform Guide';
          guide.onclick=()=>location.href='/uniform.html';
          old.insertAdjacentElement('afterend',guide);
        }
      }
    });
  }
  apply();
  setTimeout(apply,200);setTimeout(apply,700);setTimeout(apply,1500);
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();