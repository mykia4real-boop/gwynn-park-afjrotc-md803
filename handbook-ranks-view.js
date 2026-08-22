(()=>{
  if(!location.pathname.endsWith('/handbook.html')) return;

  function setup(){
    const ranks=document.getElementById('ranks');
    const home=document.getElementById('hbHome');
    const reader=document.getElementById('hbReader');
    const hero=document.querySelector('.hb-hero-copy');
    if(!ranks||!home) return;

    ranks.dataset.handbookRanks='1';

    if(!document.getElementById('hbRanksViewStyles')){
      const s=document.createElement('style');
      s.id='hbRanksViewStyles';
      s.textContent=`
        .hb-ranks-top-btn{margin-left:8px!important;background:#ffd43b!important;color:#071d38!important;border-color:#ffd43b!important;cursor:pointer}
        body.hb-ranks-open #hbHome>header,
        body.hb-ranks-open #hbHome>.hb-hero,
        body.hb-ranks-open #hbHome>.hb-search,
        body.hb-ranks-open #hbHome>.hb-content,
        body.hb-ranks-open #hbHome>.hb-official{display:none!important}
        body.hb-ranks-open #hbHome{display:block!important}
        body.hb-ranks-open #ranks{display:block!important;margin-top:0!important}
        .hb-ranks-view-head{display:none;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
        body.hb-ranks-open .hb-ranks-view-head{display:flex}
        .hb-ranks-back{border:0;border-radius:11px;padding:11px 14px;background:#edf3f8;color:#0b1f3a;font-weight:800;cursor:pointer}
        .hb-ranks-view-head strong{font-size:14px;color:#64748b}
        @media(max-width:600px){.hb-ranks-top-btn{display:block;margin:10px 0 0!important}.hb-ranks-view-head{align-items:flex-start;flex-direction:column}}
      `;
      document.head.appendChild(s);
    }

    if(!ranks.querySelector('.hb-ranks-view-head')){
      const head=document.createElement('div');
      head.className='hb-ranks-view-head';
      head.innerHTML='<button type="button" class="hb-ranks-back">← Back to Handbook</button><strong>Cadet Handbook · Ranks & Info</strong>';
      ranks.prepend(head);
      head.querySelector('.hb-ranks-back').addEventListener('click',closeRanks);
    }

    if(hero&&!document.getElementById('hbRanksTopBtn')){
      const btn=document.createElement('button');
      btn.id='hbRanksTopBtn';
      btn.type='button';
      btn.className='hb-ranks-top-btn';
      btn.textContent='Ranks & Info';
      btn.addEventListener('click',openRanks);
      hero.appendChild(btn);
    }

    document.querySelectorAll('.hb-card,[data-title]').forEach(el=>{
      const title=(el.dataset.title||el.textContent||'').trim();
      if(/Ranks\s*(?:&|and)\s*Info|Ranks\s*&\s*AFJROTC/i.test(title)){
        el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openRanks()},true);
      }
    });

    if(location.hash==='#ranks') openRanks(false);
  }

  function openRanks(updateHash=true){
    const reader=document.getElementById('hbReader');
    reader?.classList.remove('show');
    document.body.classList.add('hb-ranks-open');
    if(updateHash) history.replaceState(null,'',location.pathname+'#ranks');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function closeRanks(){
    document.body.classList.remove('hb-ranks-open');
    history.replaceState(null,'',location.pathname);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();