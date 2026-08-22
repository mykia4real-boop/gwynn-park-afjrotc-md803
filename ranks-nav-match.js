(()=>{
  if(!location.pathname.endsWith('/ranks.html')) return;
  const nav=document.querySelector('.public-header .public-nav');
  if(!nav) return;

  const add=(label,icon,target,id)=>{
    if(id && document.getElementById(id)) return;
    const b=document.createElement('button');
    b.type='button';
    if(id) b.id=id;
    b.dataset.shellIcon=icon;
    b.textContent=label;
    b.addEventListener('click',()=>{location.href=target});
    nav.appendChild(b);
  };

  /* Match the lower section of the current main-site panel. */
  add('Cadet Handbook','▤','/handbook.html','ranksExtraHandbook');
  add('Uniform Guide','♜','/uniform.html','ranksExtraUniformGuide');
  add('Settings','⚙','/?open=site-settings','settingsNavBtn');
  add('Cadet Directory','•','/?open=cadet-directory','cadetDirectoryNav');
  add('Chain of Command','⌁','/?open=chain-command','chainCommandNav');

  /* Ranks must be the active item, regardless of hover/old active classes. */
  nav.querySelectorAll('button,a').forEach(el=>el.classList.remove('active'));
  const rank=[...nav.querySelectorAll('button,a')].find(el=>/ranks\s*(?:&|and)\s*info/i.test(el.textContent||''));
  if(rank){rank.classList.add('rank-active');rank.style.background='#173f6b';rank.style.color='#fff'}

  /* Restore the exact sidebar scroll position from the page the user came from. */
  requestAnimationFrame(()=>{
    const saved=Number(sessionStorage.getItem('afjrotcNavScrollTop')||0);
    if(Number.isFinite(saved)) nav.scrollTop=saved;
  });
})();