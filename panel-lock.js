(()=>{
  const ITEMS=[
    {key:'home',label:'Home',icon:'⌂'},
    {key:'announcements',label:'Announcements',icon:'◉'},
    {key:'calendar',label:'Calendar',icon:'▣'},
    {key:'uniform',label:'Uniform of the Day',icon:'◇'},
    {key:'community',label:'Community',icon:'◎'},
    {key:'uniform-guide',label:'Uniform Guide',icon:'♜'},
    {key:'handbook',label:'Cadet Handbook',icon:'▤'},
    {key:'resources',label:'Resources',icon:'▤'},
    {key:'service',label:'Service Hours',icon:'◷'},
    {key:'gallery',label:'Gallery',icon:'▧'},
    {key:'flight',label:'My Flight',icon:'✈'},
    {key:'ranks',label:'Ranks & Info',icon:'☆'}
  ];

  function addStyles(){
    if(document.getElementById('panelLockStyles'))return;
    const s=document.createElement('style');
    s.id='panelLockStyles';
    s.textContent=`
      @media(min-width:1024px){
        .public-header .public-nav{display:flex!important;flex-direction:column!important;gap:4px!important;align-items:stretch!important}
        .public-header .public-nav>.panel-lock-item{box-sizing:border-box!important;position:relative!important;width:100%!important;min-height:46px!important;height:46px!important;margin:0!important;border:0!important;border-radius:11px!important;padding:11px 12px!important;background:transparent!important;color:#e8eef6!important;text-align:left!important;text-decoration:none!important;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif!important;font-size:0!important;font-weight:700!important;line-height:24px!important;letter-spacing:0!important;white-space:nowrap!important;overflow:hidden!important;display:flex!important;align-items:center!important;gap:0!important;flex:0 0 46px!important;appearance:none!important;pointer-events:auto!important}
        .public-header .public-nav>.panel-lock-item .panel-lock-icon{display:inline-grid!important;place-items:center!important;width:30px!important;height:24px!important;min-width:30px!important;margin:0!important;font-size:20px!important;font-weight:700!important;line-height:24px!important;color:#f7fbff!important;flex:0 0 30px!important}
        .public-header .public-nav>.panel-lock-item .panel-lock-label{display:none!important;font-size:14px!important;font-weight:700!important;line-height:24px!important;margin-left:10px!important}
        body.site-rail-open .public-header .public-nav>.panel-lock-item .panel-lock-label{display:inline!important}
        .public-header .public-nav>.panel-lock-item:hover,.public-header .public-nav>.panel-lock-item.active,.public-header .public-nav>.panel-lock-item.panel-lock-active{background:#173f6b!important;color:#fff!important}
        .public-header>.sign-in{order:50!important}
        .public-header>.site-rail-toggle{order:99!important}
      }
    `;
    document.head.appendChild(s);
  }

  function classify(el){
    const d=(el.dataset?.public||'').toLowerCase();
    const txt=(el.textContent||'').trim().toLowerCase();
    if(el.dataset?.uniformGuide!==undefined || /uniform guide/.test(txt))return 'uniform-guide';
    if(/cadet handbook/.test(txt))return 'handbook';
    if(d==='board'||d==='groups'||d==='community'||txt==='community'||txt==='message board')return 'community';
    if(d==='cadet-dashboard'||txt==='my dashboard')return 'legacy-dashboard';
    if(d==='drill-quiz'||txt==='drill quiz')return 'legacy-drill';
    if(d==='site-settings'||txt==='settings')return 'legacy-settings';
    if(d==='uniform'||txt==='uniform of the day')return 'uniform';
    if(d==='service'||/service hours/.test(txt))return 'service';
    if(d==='flight'||txt==='my flight')return 'flight';
    if(d==='ranks'||/ranks\s*(?:&|and)\s*info/.test(txt))return 'ranks';
    if(d)return d;
    return null;
  }

  function destination(key){
    if(key==='uniform')return '/uniform-day.html';
    if(key==='uniform-guide')return '/uniform.html';
    if(key==='handbook')return '/handbook.html';
    if(key==='ranks')return '/ranks.html';
    return '/?open='+encodeURIComponent(key);
  }

  function makeItem(item,existing){
    let el=existing;
    if(!el){el=document.createElement('button');el.type='button'}
    el.classList.add('panel-lock-item');
    el.classList.remove('ranks-direct-link','rank-active');
    el.dataset.panelKey=item.key;
    el.dataset.shellIcon=item.icon;
    if(['home','announcements','calendar','community','resources','service','gallery','flight'].includes(item.key))el.dataset.public=item.key;
    if(item.key==='uniform-guide')el.dataset.uniformGuide='1';
    el.onclick=(e)=>{e.preventDefault();e.stopPropagation();location.href=destination(item.key)};
    if(el.tagName==='A')el.href=destination(item.key);
    el.innerHTML=`<span class="panel-lock-icon" aria-hidden="true">${item.icon}</span><span class="panel-lock-label">${item.label}</span>`;
    el.setAttribute('aria-label',item.label);
    return el;
  }

  function activeKey(){
    const p=location.pathname;
    if(p.endsWith('/ranks.html'))return 'ranks';
    if(p.endsWith('/uniform-day.html'))return 'uniform';
    if(p.endsWith('/uniform.html'))return 'uniform-guide';
    if(p.endsWith('/handbook.html'))return 'handbook';
    return new URLSearchParams(location.search).get('open')||'home';
  }

  function normalize(){
    const nav=document.querySelector('.public-header .public-nav');
    if(!nav)return;
    addStyles();
    const buckets=new Map();
    [...nav.children].forEach(el=>{
      const key=classify(el);
      if(!key||key.startsWith('legacy-')||!ITEMS.some(i=>i.key===key)){el.remove();return}
      if(buckets.has(key)){el.remove();return}
      buckets.set(key,el);
    });
    const active=activeKey();
    const frag=document.createDocumentFragment();
    ITEMS.forEach(item=>{
      const el=makeItem(item,buckets.get(item.key));
      el.classList.toggle('panel-lock-active',item.key===active);
      frag.appendChild(el);
    });
    nav.replaceChildren(frag);
    const admin=document.getElementById('adminPortalBtn');if(admin){admin.dataset.shellIcon='◆';admin.style.order='50'}
    const acct=document.getElementById('signInBtn');if(acct){acct.dataset.shellIcon='●';acct.style.order='51'}
  }

  const start=()=>{normalize();setTimeout(normalize,250);setTimeout(normalize,900)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('pageshow',()=>setTimeout(normalize,50));
})();