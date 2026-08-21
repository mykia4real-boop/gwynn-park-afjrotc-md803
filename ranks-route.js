(()=>{
  const isRanksTarget=(el)=>{
    const b=el?.closest?.('button,a,[data-public]');
    if(!b)return null;
    const label=(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    const byData=b.dataset?.public==='ranks';
    const byId=/rank/i.test(b.id||'');
    const byLabel=label==='ranks & info'||label==='ranks and info'||label.includes('ranks & info');
    return (byData||byId||byLabel)?b:null;
  };
  const go=()=>{ window.location.assign('/ranks.html'); };
  document.addEventListener('click',e=>{
    const b=isRanksTarget(e.target);
    if(!b)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    go();
  },true);
  const hardWire=()=>{
    document.querySelectorAll('button,a,[data-public]').forEach(b=>{
      const label=(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(b.dataset?.public==='ranks'||/rank/i.test(b.id||'')||label==='ranks & info'||label==='ranks and info'){
        b.dataset.public='ranks';
        if(b.tagName==='A')b.setAttribute('href','/ranks.html');
      }
    });
  };
  hardWire();
  setTimeout(hardWire,100);
  setTimeout(hardWire,500);
  setTimeout(hardWire,1200);
})();