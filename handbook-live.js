(()=>{
  function markReady(){
    document.body.dataset.standaloneDataReady='1';
    window.dispatchEvent(new Event('afjrotc:standalone-data-ready'));
  }

  if(window.supabase){
    const hb=window.supabase.createClient('https://usoqblqosmnqsogddgtc.supabase.co','sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964');
    const map={mission:'AFJROTC Mission',cadet_responsibility:'Cadet Responsibility',cadet_code:'Cadet Code & Creed',lead_example:'Lead by Example',classroom:'Classroom Standards',hazing:'Hazing & Misuse of Authority',uniform_day:'Uniform Day',grooming:'Grooming & Appearance'};
    function replaceCard(title,body){const headings=[...document.querySelectorAll('.card h3')];const h=headings.find(x=>x.textContent.trim()===title);if(!h)return;const card=h.closest('.card');if(!card)return;h.textContent=title;[...card.children].filter(x=>x!==h).forEach(x=>x.remove());const p=document.createElement('p');p.textContent=body;card.appendChild(p)}
    async function load(){
      try{
        const {data,error}=await hb.from('handbook_sections').select('section_key,title,body');
        if(error){console.warn('Handbook sections',error);return}
        (data||[]).forEach(x=>{if(map[x.section_key])replaceCard(x.title||map[x.section_key],x.body||'')});
        const recognition=(data||[]).find(x=>x.section_key==='recognition');
        if(recognition){const section=[...document.querySelectorAll('.section h2')].find(x=>x.textContent.trim()==='Awards & Recognition')?.closest('.section');const p=section?.querySelector('.section-head p');if(p)p.textContent=recognition.body}
      }finally{markReady()}
    }
    load();
  }else markReady();

  function loadMobileShell(){
    if(document.querySelector('script[data-handbook-mobile-shell]'))return;
    const m=document.createElement('script');
    m.src='/mobile-shell.js?release=20260825-handbook-visible-menu-v2';
    m.async=false;
    m.dataset.handbookMobileShell='1';
    document.head.appendChild(m);
  }

  if(!window.__afjrotcUnifiedShell&&!document.querySelector('script[data-unified-site-shell]')){
    const s=document.createElement('script');
    s.src='/site-shell.js?release=20260824-shell-sync';
    s.async=false;
    s.dataset.unifiedSiteShell='1';
    s.addEventListener('load',()=>setTimeout(loadMobileShell,0),{once:true});
    document.head.appendChild(s);
  }else{
    setTimeout(loadMobileShell,0);
  }
  setTimeout(loadMobileShell,500);
  setTimeout(loadMobileShell,1200);

  if(!window.__afjrotcRanksRouteFix&&!document.querySelector('script[data-ranks-route-fix]')){
    const r=document.createElement('script');
    r.src='/ranks-direct-link.js?release=20260824-shell-sync';
    r.async=false;
    r.dataset.ranksRouteFix='1';
    document.head.appendChild(r);
  }
})();