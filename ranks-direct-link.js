(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .public-nav a.ranks-direct-link{position:relative;width:100%;min-height:46px;border:0;border-radius:11px;padding:11px 12px;text-align:left;color:#e8eef6;background:transparent;white-space:nowrap;overflow:hidden;font-weight:800;text-decoration:none;display:flex;align-items:center;gap:10px}
    .public-nav a.ranks-direct-link:hover,.public-nav a.ranks-direct-link.active{background:#173f6b;color:#fff}
    .public-nav a.ranks-direct-link .rank-link-icon{display:inline-grid;place-items:center;width:30px;height:24px;font-size:20px;color:#f7fbff;flex:0 0 auto}
    #mobileNav a.ranks-direct-link{display:block;width:100%;padding:12px 14px;text-decoration:none;font-weight:800;color:inherit}
    @media(min-width:1024px){body:not(.site-rail-open) .public-nav a.ranks-direct-link{font-size:0}body.site-rail-open .public-nav a.ranks-direct-link{font-size:14px}}
  `;
  document.head.appendChild(style);

  function replaceIn(nav,mobile=false){
    if(!nav)return;
    [...nav.querySelectorAll('button,a')].forEach(el=>{
      const text=(el.textContent||'').trim().toLowerCase();
      if(el.dataset?.public==='ranks'||text==='ranks & info'||text==='ranks and info'){
        if(el.matches('a.ranks-direct-link'))return;
        const a=document.createElement('a');
        a.href='/ranks.html';
        a.className='ranks-direct-link';
        a.setAttribute('aria-label','Ranks & Info');
        a.innerHTML=mobile?'Ranks & Info':'<span class="rank-link-icon">☆</span><span>Ranks & Info</span>';
        el.replaceWith(a);
      }
    });
    if(!nav.querySelector('a.ranks-direct-link')){
      const a=document.createElement('a');
      a.href='/ranks.html';
      a.className='ranks-direct-link';
      a.setAttribute('aria-label','Ranks & Info');
      a.innerHTML=mobile?'Ranks & Info':'<span class="rank-link-icon">☆</span><span>Ranks & Info</span>';
      nav.appendChild(a);
    }
  }

  function sync(){replaceIn(document.querySelector('.public-nav'),false);replaceIn(document.getElementById('mobileNav'),true)}
  sync();
  const observer=new MutationObserver(sync);
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(sync,100);setTimeout(sync,500);setTimeout(sync,1200);
})();