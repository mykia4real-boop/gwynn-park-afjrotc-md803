(()=>{
  if(window.__messageBoardFixV124)return;
  window.__messageBoardFixV124=true;

  const style=document.createElement('style');
  style.id='messageBoardFixV124Styles';
  style.textContent=`
    #public-board .board53-banner{
      background:#0b2a45!important;
      border:1px solid #245276!important;
      color:#e8f1f8!important;
      box-shadow:0 8px 24px rgba(0,0,0,.12)!important;
    }
    #public-board .board53-banner strong{color:#ffd83d!important}
    #public-board .board53-banner span{color:#c6d6e4!important}
    #public-board .board53-banner>span{color:#ffd83d!important}
  `;
  document.head.appendChild(style);

  const initials=name=>String(name||'Cadet').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'C';
  let running=false;
  let queued=false;

  async function applyNames(){
    if(running){queued=true;return}
    if(typeof sb==='undefined'||typeof posts==='undefined')return;
    const ids=[...new Set((posts||[]).map(p=>p.author_id).filter(Boolean))];
    if(!ids.length)return;
    running=true;
    try{
      const {data,error}=await sb.rpc('public_profile_names',{profile_ids:ids});
      if(error){console.warn('Could not load public cadet names',error);return}
      const names={};
      (data||[]).forEach(row=>{names[row.id]=row.full_name||'Cadet'});
      document.querySelectorAll('[data-board-post]').forEach(card=>{
        const post=(posts||[]).find(p=>String(p.id)===String(card.dataset.boardPost));
        if(!post)return;
        const name=names[post.author_id]||'Cadet';
        const metaSpans=[...card.querySelectorAll('.board53-meta span')];
        const byline=metaSpans.find(el=>/^Posted by\s/i.test((el.textContent||'').trim()));
        if(byline)byline.textContent=`Posted by ${name}`;
        const avatar=card.querySelector('.board53-avatar');
        if(avatar)avatar.textContent=initials(name);
      });
    }finally{
      running=false;
      if(queued){queued=false;setTimeout(applyNames,0)}
    }
  }

  const board=document.getElementById('public-board');
  if(board){
    const observer=new MutationObserver(()=>applyNames());
    observer.observe(board,{childList:true,subtree:true});
  }

  [200,600,1200,2500].forEach(ms=>setTimeout(applyNames,ms));
})();