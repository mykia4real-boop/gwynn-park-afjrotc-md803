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

  function ensureHandbookMenu(){
    const header=document.querySelector('.public-header');
    if(!header)return false;

    let btn=document.getElementById('mobileMenuBtn');
    if(!btn){
      btn=document.createElement('button');
      btn.id='mobileMenuBtn';
      btn.className='mobile-menu-btn';
      btn.type='button';
      btn.textContent='Menu';
      btn.setAttribute('aria-expanded','false');
      const sign=document.getElementById('signInBtn');
      sign&&sign.parentElement===header?header.insertBefore(btn,sign):header.appendChild(btn);
    }

    btn.style.setProperty('pointer-events','auto','important');
    if(window.innerWidth<=1023){
      btn.style.setProperty('display','inline-flex','important');
      btn.style.setProperty('visibility','visible','important');
      btn.style.setProperty('opacity','1','important');
    }

    if(!window.__afjrotcShellMobileMenuV4&&!document.querySelector('script[data-handbook-menu-controller]')){
      const m=document.createElement('script');
      m.src='/mobile-menu-fix.js?release=20260825-handbook-self-heal-v3';
      m.async=false;
      m.dataset.handbookMenuController='1';
      document.head.appendChild(m);
    }
    return true;
  }

  function retryMenu(){
    if(ensureHandbookMenu())return;
    setTimeout(retryMenu,180);
  }

  if(!window.__afjrotcUnifiedShell&&!document.querySelector('script[data-unified-site-shell]')){
    const s=document.createElement('script');
    s.src='/site-shell.js?release=20260824-shell-sync';
    s.async=false;
    s.dataset.unifiedSiteShell='1';
    s.addEventListener('load',()=>setTimeout(retryMenu,0),{once:true});
    document.head.appendChild(s);
  }else{
    setTimeout(retryMenu,0);
  }
  setTimeout(ensureHandbookMenu,500);
  setTimeout(ensureHandbookMenu,1200);
  setTimeout(ensureHandbookMenu,2500);
  window.addEventListener('resize',ensureHandbookMenu,{passive:true});

  if(!window.__afjrotcRanksRouteFix&&!document.querySelector('script[data-ranks-route-fix]')){
    const r=document.createElement('script');
    r.src='/ranks-direct-link.js?release=20260824-shell-sync';
    r.async=false;
    r.dataset.ranksRouteFix='1';
    document.head.appendChild(r);
  }
})();