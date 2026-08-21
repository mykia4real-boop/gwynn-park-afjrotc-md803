(()=>{
  const STYLE_ID='ranksDirectNavStyle';
  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .public-nav a.ranks-direct-link{position:relative;width:100%;min-height:46px;border:0;border-radius:11px;padding:11px 12px;text-align:left;color:#e8eef6;background:transparent;white-space:nowrap;overflow:hidden;font-size:14px;font-weight:800;text-decoration:none;display:flex;align-items:center;gap:10px;box-sizing:border-box}
      .public-nav a.ranks-direct-link::before{content:'☆';display:inline-grid;place-items:center;width:30px;height:24px;font-size:20px;color:#f7fbff;flex:0 0 auto}
      .public-nav a.ranks-direct-link:hover,.public-nav a.ranks-direct-link.active{background:#173f6b;color:#fff}
      @media(min-width:1024px){body:not(.site-rail-open) .public-nav a.ranks-direct-link{font-size:0}body:not(.site-rail-open) .public-nav a.ranks-direct-link::before{margin-right:0}}
      #mobileNav a.ranks-direct-link{display:block;padding:12px 14px;color:inherit;text-decoration:none;font-weight:800}
    `;
    document.head.appendChild(s);
  }
  function isRanks(el){
    if(!el)return false;
    const text=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    return el.dataset?.public==='ranks'||/rank/i.test(el.id||'')||text==='ranks & info'||text==='ranks and info';
  }
  function replaceOne(el){
    if(!el||el.matches?.('a.ranks-direct-link'))return;
    const a=document.createElement('a');
    a.href='/ranks.html';
    a.className='ranks-direct-link'+(el.classList?.contains('active')?' active':'');
    a.textContent='Ranks & Info';
    if(el.id)a.id=el.id+'Direct';
    el.replaceWith(a);
  }
  function wire(){
    ensureStyle();
    document.querySelectorAll('.public-nav button,.public-nav a,#mobileNav button,#mobileNav a').forEach(el=>{if(isRanks(el))replaceOne(el)});
  }
  wire();
  new MutationObserver(wire).observe(document.documentElement,{childList:true,subtree:true});
})();