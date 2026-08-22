(()=>{
  if(!location.pathname.endsWith('/ranks.html')) return;
  const nav=document.querySelector('.public-header .public-nav');
  if(!nav) return;

  const add=(label,icon,target,id)=>{
    if(id && document.getElementById(id)) return;
    const existing=[...nav.querySelectorAll('button,a')].find(el=>(el.textContent||'').trim().toLowerCase()===label.toLowerCase());
    if(existing) return;
    const b=document.createElement('button');
    b.type='button';
    if(id) b.id=id;
    b.dataset.shellIcon=icon;
    b.textContent=label;
    b.addEventListener('click',()=>{location.href=target});
    nav.appendChild(b);
  };

  add('Settings','⚙','/?open=site-settings','settingsNavBtn');

  ['Cadet Directory','Chain of Command'].forEach(label=>{
    [...nav.querySelectorAll('button,a')].filter(el=>(el.textContent||'').trim().toLowerCase()===label.toLowerCase()).forEach(el=>el.remove());
  });

  ['Cadet Handbook','Uniform Guide'].forEach(label=>{
    const matches=[...nav.querySelectorAll('button,a')].filter(el=>(el.textContent||'').trim().toLowerCase()===label.toLowerCase());
    matches.slice(1).forEach(el=>el.remove());
  });

  nav.querySelectorAll('button,a').forEach(el=>el.classList.remove('active'));
  const rank=[...nav.querySelectorAll('button,a')].find(el=>/ranks\s*(?:&|and)\s*info/i.test(el.textContent||''));
  if(rank){rank.classList.add('rank-active');rank.style.background='#173f6b';rank.style.color='#fff'}

  requestAnimationFrame(()=>{
    const saved=Number(sessionStorage.getItem('afjrotcNavScrollTop')||0);
    if(Number.isFinite(saved)) nav.scrollTop=saved;
  });
})();