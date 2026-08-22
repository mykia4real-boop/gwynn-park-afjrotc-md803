(()=>{
  const DESKTOP='(min-width:1024px)';
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
        .public-header .public-nav>.panel-lock-item{box-sizing:border-box!important;position:relative!important;width:100%!important;min-height:46px!important;height:46px!important;margin:0!important;border:0!important;border-radius:11px!important;padding:11px 12px!important;background:transparent!important;color:#e8eef6!important;text-align:left!important;text-decoration:none!important;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif!important;font-size:0!important;font-weight:700!important;line-height:24px!important;letter-spacing:0!important;white-space:nowrap!important;overflow:hidden!important;display:flex!important;align-items:center!important;gap:0!important;flex:0 0 46px!important;appearance:none!important}
        .public-header .public-nav>.panel-lock-item .panel-lock-icon{display:inline-grid!important;place-items:center!important;width:30px!important;height:24px!important;min-width:30px!important;margin:0!important;font-size:20px!important;font-weight:700!important;line-height:24px!important;color:#f7fbff!important;flex:0 0 30px!important}
        .public-header .public-nav>.panel-lock-item .panel-lock-label{display:none!important;font-size:14px!important;font-weight:700!important;line-height:24px!important;margin-left:10px!important}
        body.site-rail-open .public-header .public-nav>.panel-lock-item .panel-lock-label{display:inline!important}
        .public-header .public-nav>.panel-lock-item:hover,.public-header .public-nav>.panel-lock-item.active,.public-header .public-nav>.panel-lock-item.panel-lock-active{background:#173f6b!important;color:#fff!important}
        .public-header>.sign-in{order:50!important}
        .public-header>.site-rail-toggle{order:99!important}
      }
      @media(max-width:1023px){
        #mobileNav .panel-lock-mobile{font-family:inherit!important;font-size:14px!important;font-weight:700!important}
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

  function makeItem(item,existing){
    let el=existing;
    if(!el){
      el=document.createElement('button');
      el.type='button';
      if(['home','announcements','calendar','resources','service','gallery','flight'].includes(item.key)){
        el.dataset.public=item.key;
        el.addEventListener('click',()=>location.href='/?open='+encodeURIComponent(item.key));
      }else if(item.key==='community'){
        el.dataset.public='community';
        el.addEventListener('click',()=>location.href='/?open=community');
      }else if(item.key==='uniform'){
        el.addEventListener('click',()=>location.href='/uniform-day.html');
      }else if(item.key==='uniform-guide'){
        el.dataset.uniformGuide='1';
        el.addEventListener('click',()=>location.href='/uniform.html');
      }else if(item.key==='handbook'){
        el.addEventListener('click',()=>location.href='/handbook.html');
      }else if(item.key==='ranks'){
        el.addEventListener('click',()=>location.href='/ranks.html');
      }
    }
    el.classList.add('panel-lock-item');
    el.classList.remove('ranks-direct-link','rank-active');
    el.removeAttribute('style');
    el.dataset.panelKey=item.key;
    el.dataset.shellIcon=item.icon;
    if(el.tagName==='A'){
      el.removeAttribute('target');
      if(item.key==='ranks')el.href='/ranks.html';
      else if(item.key==='uniform-guide')el.href='/uniform.html';
      else if(item.key==='handbook')el.href='/handbook.html';
      else if(item.key==='uniform')el.href='/uniform-day.html';
      else el.href='/?open='+encodeURIComponent(item.key);
    }
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
    const active=document.querySelector('.public-page.active');
    const id=(active?.id||'').replace(/^public-/,'');
    if(id==='board'||id==='groups'||id==='community')return 'community';
    return id||new URLSearchParams(location.search).get('open')||'home';
  }

  let normalizing=false;
  function normalize(){
    if(normalizing)return;
    const nav=document.querySelector('.public-header .public-nav');
    if(!nav)return;
    normalizing=true;
    try{
      addStyles();
      const buckets=new Map();
      [...nav.children].forEach(el=>{
        const key=classify(el);
        if(!key||key.startsWith('legacy-')){el.remove();return;}
        if(!ITEMS.some(i=>i.key===key)){el.remove();return;}
        if(buckets.has(key)){el.remove();return;}
        buckets.set(key,el);
      });
      const frag=document.createDocumentFragment();
      const active=activeKey();
      ITEMS.forEach(item=>{
        const el=makeItem(item,buckets.get(item.key));
        el.classList.toggle('panel-lock-active',item.key===active);
        frag.appendChild(el);
      });
      nav.replaceChildren(frag);
      const admin=document.getElementById('adminPortalBtn');
      if(admin){admin.dataset.shellIcon='◆';admin.style.order='50'}
      const acct=document.getElementById('signInBtn');
      if(acct){acct.dataset.shellIcon='●';acct.style.order='51'}
    }finally{normalizing=false}
  }

  addStyles();
  normalize();
  const observer=new MutationObserver(()=>queueMicrotask(normalize));
  const start=()=>{const header=document.querySelector('.public-header');if(header)observer.observe(header,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-public','style']});normalize()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  [100,300,700,1200,2000,3500].forEach(ms=>setTimeout(normalize,ms));
  window.addEventListener('pageshow',normalize);
})();