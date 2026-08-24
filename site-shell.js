(()=>{
  if(window.__afjrotcUnifiedShell)return;
  window.__afjrotcUnifiedShell=true;

  const SUPABASE_URL='https://usoqblqosmnqsogddgtc.supabase.co';
  const SUPABASE_KEY='sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964';
  const PUBLIC=[
    ['home','Dashboard'],['announcements','Announcements'],['calendar','Calendar'],['uniform','Uniform'],['board','Message Board'],['resources','Resources'],['gallery','Gallery']
  ];
  const CADET=[
    ['home','Home','⌂'],['cadet-dashboard','Cadet Dashboard','▦'],['announcements','Announcements','◉'],['calendar','Calendar','▣'],['board','Community','□'],['uniform-guide','Uniform Guide','◇'],['handbook','Cadet Handbook','▤'],['resources','Resources','▤'],['service','Service Hours','◷'],['gallery','Gallery','▧'],['flight','My Flight','✈'],['ranks','Ranks & Info','☆']
  ];
  const INSTRUCTOR=[
    ['home','Home','⌂'],['announcements','Announcements','◉'],['calendar','Calendar','▣'],['board','Community','□'],['uniform-guide','Uniform Guide','◇'],['handbook','Cadet Handbook','▤'],['resources','Resources','▤'],['gallery','Gallery','▧']
  ];
  const ELEVATED=new Set(['command_staff','admin','instructor']);
  let currentSignedIn=false,currentRole='guest',currentName='';

  const isHandbook=()=>location.pathname.endsWith('/handbook.html');
  const isUniformGuide=()=>location.pathname.endsWith('/uniform.html');
  const isStandalone=()=>isHandbook()||isUniformGuide();
  const normalizeKey=key=>({community:'board','my-flight':'flight',dashboard:'home'}[key]||key||'home');

  const style=document.createElement('style');
  style.id='afjrotcUnifiedShellStyles';
  style.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    body.shell-loading .public-header{visibility:hidden!important}
    .public-header .public-nav,#mobileNav,.site-rail-toggle{display:none!important}
    .site-shell-nav{display:none}
    body.afjrotc-standalone .sidebar{display:none!important}
    body.afjrotc-standalone .shell{min-height:100vh!important}
    @media(min-width:1024px){
      body.guest-shell .public-header{position:sticky!important;top:0!important;width:100%!important;height:76px!important;min-height:76px!important;display:grid!important;grid-template-columns:270px minmax(0,1fr) 92px!important;align-items:center!important;gap:12px!important;padding:0 18px!important;background:#041827!important;border:0!important;border-bottom:1px solid rgba(142,174,201,.16)!important;box-shadow:0 5px 18px rgba(0,0,0,.16)!important;z-index:500!important;box-sizing:border-box!important}
      body.guest-shell .public-brand{display:flex!important;align-items:center!important;gap:10px!important;width:270px!important;padding:0!important;margin:0!important;border:0!important}
      body.guest-shell .public-brand .crest{width:48px!important;height:48px!important;min-width:48px!important;border:2px solid #ffd83d!important;border-radius:10px!important;background:transparent!important;color:#f5f8fb!important;font-size:17px!important;display:grid!important;place-items:center!important;font-weight:900!important}
      body.guest-shell .public-brand strong{display:block!important;color:#ffd83d!important;font-size:17px!important;letter-spacing:.03em!important;line-height:1!important}
      body.guest-shell .public-brand small{display:block!important;color:#aebdca!important;font-size:8px!important;letter-spacing:.11em!important;margin-top:5px!important}
      body.guest-shell .site-shell-nav{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:3px!important;min-width:0!important;width:100%!important}
      body.guest-shell .site-shell-nav button{border:1px solid transparent!important;background:transparent!important;color:#dbe6ef!important;border-radius:8px!important;min-height:40px!important;padding:8px 9px!important;font-size:12px!important;font-weight:800!important;white-space:nowrap!important;cursor:pointer!important}
      body.guest-shell .site-shell-nav button:hover{background:#0d304d!important;color:#fff!important}
      body.guest-shell .site-shell-nav button.active{background:#123b5f!important;border-color:#1f527b!important;color:#fff!important}
      body.guest-shell #signInBtn{display:flex!important;align-items:center!important;justify-content:center!important;width:92px!important;min-width:92px!important;min-height:46px!important;margin:0!important;padding:9px 12px!important;border:0!important;border-radius:9px!important;background:#ffd83d!important;color:#061523!important;font-size:13px!important;font-weight:900!important;cursor:pointer!important}
      body.guest-shell #adminPortalBtn{display:none!important}
      body.guest-shell #publicSite,body.guest-shell #publicFooter,body.guest-shell .site-alert-banner{margin-left:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}
      body.guest-shell.afjrotc-standalone .main{margin-left:0!important;width:100%!important}

      body.account-shell{--cadet-panel:286px!important}
      body.account-shell .public-header{position:fixed!important;inset:0 auto 0 0!important;width:286px!important;height:100vh!important;min-height:100vh!important;max-height:100vh!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;padding:18px 14px 16px!important;background:#061f35!important;border:0!important;border-right:1px solid rgba(143,178,207,.2)!important;box-shadow:8px 0 26px rgba(0,0,0,.16)!important;z-index:500!important;box-sizing:border-box!important;overflow:hidden!important}
      body.account-shell .public-brand{order:1!important;display:flex!important;align-items:center!important;gap:12px!important;width:100%!important;padding:2px 0 18px!important;margin:0!important;border-bottom:1px solid rgba(255,255,255,.12)!important;flex:0 0 auto!important}
      body.account-shell .public-brand .crest{width:54px!important;height:54px!important;min-width:54px!important;border:2px solid #ffd83d!important;border-radius:50%!important;color:#f4f7fb!important;background:transparent!important;font-size:16px!important;display:grid!important;place-items:center!important;font-weight:900!important}
      body.account-shell .public-brand strong{display:block!important;color:#ffd83d!important;font-size:20px!important;letter-spacing:.02em!important}
      body.account-shell .public-brand small{display:block!important;color:#c1ccd7!important;font-size:9px!important;margin-top:3px!important;letter-spacing:.06em!important}
      body.account-shell .site-shell-nav{order:2!important;display:flex!important;flex:1 1 auto!important;min-height:0!important;flex-direction:column!important;align-items:stretch!important;gap:4px!important;margin:14px 0 10px!important;overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:thin!important}
      body.account-shell .site-shell-nav button{display:flex!important;align-items:center!important;width:100%!important;min-height:44px!important;padding:10px 12px!important;border:0!important;border-radius:10px!important;background:transparent!important;color:#e8f0f6!important;font-size:13px!important;font-weight:800!important;text-align:left!important;white-space:nowrap!important;cursor:pointer!important}
      body.account-shell .site-shell-nav button .shell-icon{display:inline-grid!important;place-items:center!important;width:28px!important;min-width:28px!important;margin-right:9px!important;font-size:16px!important;color:#dce8f2!important}
      body.account-shell .site-shell-nav button:hover,body.account-shell .site-shell-nav button.active{background:#205a89!important;color:#fff!important}
      body.account-shell #signInBtn{order:3!important;flex:0 0 auto!important;width:100%!important;min-height:46px!important;margin:6px 0 0!important;border-radius:10px!important;background:#103b60!important;color:#eef5fb!important;border:1px solid rgba(255,255,255,.10)!important;font-weight:900!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      body.account-shell #adminPortalBtn{order:4!important;flex:0 0 auto!important;width:100%!important;min-height:46px!important;margin:6px 0 0!important;border-radius:10px!important;background:#ffd83d!important;color:#071528!important;border:0!important;font-weight:900!important}
      body.account-shell #publicSite,body.account-shell #publicFooter,body.account-shell .site-alert-banner{margin-left:286px!important;width:auto!important;max-width:none!important;box-sizing:border-box!important}
      body.account-shell.afjrotc-standalone .main{margin-left:286px!important;width:auto!important;min-height:100vh!important}
      body.account-shell #publicSite{min-height:100vh!important}
      body.account-shell .guide-page{padding-left:56px!important;padding-right:56px!important}
      body.account-shell .public-header .mobile-menu-btn,.cadet-dash-wrap{display:none!important}
    }
    @media(max-width:1023px){
      body .public-header{position:sticky!important;top:0!important;width:100%!important;height:72px!important;min-height:72px!important;display:flex!important;flex-direction:row!important;align-items:center!important;gap:9px!important;padding:0 12px!important;background:#041827!important;border:0!important;border-bottom:1px solid rgba(142,174,201,.16)!important;z-index:500!important;box-sizing:border-box!important}
      body .public-brand{display:flex!important;align-items:center!important;gap:9px!important;flex:1 1 auto!important;min-width:0!important;padding:0!important;border:0!important}
      body .public-brand .crest{width:42px!important;height:42px!important;min-width:42px!important;border-radius:9px!important;border:2px solid #ffd83d!important;display:grid!important;place-items:center!important;color:#fff!important;font-weight:900!important}
      body .public-brand strong{display:block!important;color:#ffd83d!important}
      body .public-brand small{display:block!important;color:#aebdca!important;font-size:8px!important}
      body .site-shell-nav{display:none!important}
      body #signInBtn{display:flex!important;align-items:center!important;justify-content:center!important;min-width:86px!important;max-width:42vw!important;min-height:42px!important;padding:8px 11px!important;border:0!important;border-radius:9px!important;background:#ffd83d!important;color:#061523!important;font-size:12px!important;font-weight:900!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      body #adminPortalBtn{display:none!important}
      body #publicSite,body #publicFooter,body .site-alert-banner{margin-left:0!important;width:100%!important}
      body.afjrotc-standalone .main{margin-left:0!important;width:100%!important}
    }
  `;
  document.head.appendChild(style);

  function ensureHeader(){
    if(isStandalone())document.body.classList.add('afjrotc-standalone');
    if(isHandbook())document.querySelectorAll('.sidebar').forEach(x=>x.remove());
    let header=document.querySelector('.public-header');
    if(!header){
      header=document.createElement('header');
      header.className='public-header';
      document.body.prepend(header);
    }
    let brand=header.querySelector('.public-brand');
    if(!brand){
      brand=document.createElement('div');brand.className='brand public-brand';
      brand.innerHTML='<div class="crest">GP</div><div><strong>AFJROTC</strong><small>GWYNN PARK HIGH SCHOOL</small></div>';
      header.prepend(brand);
    }
    let nav=header.querySelector('.site-shell-nav');
    if(!nav){nav=document.createElement('nav');nav.className='site-shell-nav';nav.dataset.authoritativeShell='1';header.appendChild(nav)}
    let sign=document.getElementById('signInBtn');
    if(!sign){sign=document.createElement('button');sign.id='signInBtn';sign.className='sign-in';sign.type='button';sign.dataset.shellGenerated='1';sign.textContent='Sign In';header.appendChild(sign)}
    let admin=document.getElementById('adminPortalBtn');
    if(!admin){admin=document.createElement('button');admin.id='adminPortalBtn';admin.className='sign-in hidden';admin.type='button';admin.dataset.shellGenerated='1';admin.textContent='Admin Control Center';admin.onclick=()=>location.href='/admin.html';header.appendChild(admin)}
    document.querySelectorAll('.public-header').forEach((h,i)=>{if(i>0)h.style.display='none'});
    return header;
  }

  function pathnameKey(){if(isUniformGuide())return'uniform-guide';if(isHandbook())return'handbook';return null}
  function currentPage(){return pathnameKey()||normalizeKey(document.querySelector('.public-page.active')?.id?.replace(/^public-/,'')||new URLSearchParams(location.search).get('open')||'home')}
  function navForRole(signedIn,role){if(!signedIn)return PUBLIC;if(role==='instructor')return INSTRUCTOR;return CADET}
  function allowedKeys(signedIn,role){return new Set(navForRole(signedIn,role).map(x=>x[0]))}
  function setActive(key){const k=normalizeKey(key);document.querySelectorAll('.site-shell-nav button[data-shell-page]').forEach(b=>b.classList.toggle('active',b.dataset.shellPage===k))}

  function route(rawKey){
    const key=normalizeKey(rawKey);
    if(key==='uniform-guide'){location.href='/uniform.html';return}
    if(key==='handbook'){location.href='/handbook.html';return}
    if(isStandalone()){location.href='/?open='+encodeURIComponent(key);return}
    const allowed=allowedKeys(currentSignedIn,currentRole);
    if(!allowed.has(key)){route('home');return}
    try{
      if(typeof showPublic==='function'&&document.getElementById('public-'+key)){showPublic(key);setActive(key);return}
    }catch(e){}
    const original=document.querySelector(`.public-nav button[data-public="${CSS.escape(key)}"]`);
    if(original){original.click();setActive(key);return}
    location.href='/?open='+encodeURIComponent(key);
  }

  function ensureNav(signedIn,role){
    const header=ensureHeader();
    let nav=header.querySelector('.site-shell-nav');
    header.querySelectorAll('.site-shell-nav').forEach((x,i)=>{if(i>0)x.remove()});
    nav.innerHTML='';
    navForRole(signedIn,role).forEach(([key,label,icon])=>{
      const b=document.createElement('button');b.type='button';b.dataset.shellPage=key;
      if(signedIn){const i=document.createElement('span');i.className='shell-icon';i.textContent=icon;const t=document.createElement('span');t.textContent=label;b.append(i,t)}else b.textContent=label;
      b.onclick=e=>{e.preventDefault();route(key)};nav.appendChild(b);
    });
    setActive(currentPage());
  }

  function setBrand(signedIn){
    const brand=ensureHeader().querySelector('.public-brand');
    const crest=brand?.querySelector('.crest'),strong=brand?.querySelector('strong'),small=brand?.querySelector('small');
    if(signedIn){if(crest)crest.textContent='GP';if(strong)strong.textContent='AFJROTC';if(small)small.textContent='GWYNN PARK HIGH SCHOOL'}
    else{if(crest)crest.textContent='803';if(strong)strong.textContent='MD-803 AFJROTC';if(small)small.textContent='GWYNN PARK HIGH SCHOOL'}
  }

  function orderControls(signedIn,role,name){
    const header=ensureHeader(),nav=header.querySelector('.site-shell-nav'),sign=document.getElementById('signInBtn'),admin=document.getElementById('adminPortalBtn');
    if(nav)header.appendChild(nav);
    if(sign){
      header.appendChild(sign);sign.classList.remove('hidden');
      if(sign.dataset.shellGenerated==='1')sign.onclick=()=>location.href=signedIn?'/?account=1':'/?signin=1';
      if(!signedIn)sign.textContent='Sign In';else if(sign.dataset.shellGenerated==='1')sign.textContent=name||'My Account';
    }
    if(admin){
      header.appendChild(admin);
      const show=signedIn&&ELEVATED.has(role);
      admin.classList.toggle('hidden',!show);
      if(show&&role==='instructor')admin.textContent='Admin Control Center';
    }
  }

  function getClient(){
    try{if(typeof sb!=='undefined'&&sb?.auth)return sb}catch(e){}
    if(window.__afjrotcShellClient?.auth)return window.__afjrotcShellClient;
    if(window.supabase?.createClient){window.__afjrotcShellClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);return window.__afjrotcShellClient}
    return null;
  }

  function applyRequestedRoute(){
    if(isStandalone())return;
    const params=new URLSearchParams(location.search),raw=params.get('open');
    if(!raw)return;
    const key=normalizeKey(raw),allowed=allowedKeys(currentSignedIn,currentRole);
    if(!allowed.has(key)){route('home');return}
    try{if(typeof showPublic==='function'&&document.getElementById('public-'+key)){showPublic(key);setActive(key)}}catch(e){}
  }

  function openRequestedAccount(){
    if(isStandalone())return;
    const params=new URLSearchParams(location.search),signin=params.get('signin')==='1',account=params.get('account')==='1';
    if((signin&&!currentSignedIn)||(account&&currentSignedIn)){
      const sign=document.getElementById('signInBtn');
      if(sign)setTimeout(()=>sign.click(),120);
    }
  }

  async function applySession(session){
    const signedIn=!!session?.user;let role=null,name='';
    if(signedIn){
      try{const client=getClient();const {data}=await client.from('profiles').select('role,full_name').eq('id',session.user.id).single();role=data?.role||'cadet';name=data?.full_name||''}catch(e){role='cadet'}
    }
    currentSignedIn=signedIn;currentRole=role||'guest';currentName=name;
    document.body.classList.toggle('account-shell',signedIn);document.body.classList.toggle('guest-shell',!signedIn);
    document.body.classList.remove('site-rail-open','admin-rail-open');document.body.dataset.userRole=role||'guest';
    if(role==='instructor'&&currentPage()==='cadet-dashboard'&&!isStandalone()){route('home');return}
    setBrand(signedIn);ensureNav(signedIn,role);orderControls(signedIn,role,name);applyRequestedRoute();document.body.classList.remove('shell-loading');openRequestedAccount();
  }

  function sanitize(){
    const header=ensureHeader();
    document.querySelectorAll('.public-header .public-nav,#mobileNav,.site-rail-toggle').forEach(x=>{x.style.setProperty('display','none','important')});
    if(isHandbook())document.querySelectorAll('.sidebar').forEach(x=>x.remove());
    header.querySelectorAll('.site-shell-nav').forEach((x,i)=>{if(i>0)x.remove()});
    const desired=navForRole(currentSignedIn,currentRole),nav=header.querySelector('.site-shell-nav');
    if(nav&&nav.querySelectorAll('[data-shell-page]').length!==desired.length)ensureNav(currentSignedIn,currentRole);
  }

  async function init(){
    document.body.classList.add('shell-loading');ensureHeader();
    try{
      const client=getClient();if(!client){setTimeout(init,80);return}
      const {data}=await client.auth.getSession();await applySession(data?.session||null);
      if(!window.__afjrotcShellAuthListener){window.__afjrotcShellAuthListener=true;client.auth.onAuthStateChange((_e,s)=>applySession(s))}
    }catch(e){console.warn('Site shell auth sync failed',e);applySession(null)}
  }

  document.addEventListener('click',e=>{const p=e.target.closest('[data-public]')?.dataset.public;if(p)setTimeout(()=>setActive(normalizeKey(p)),0)});
  try{const oldShow=showPublic;if(typeof oldShow==='function')window.showPublic=function(page){oldShow(page);setActive(normalizeKey(page))}}catch(e){}
  let cleanTimer=null;
  const observer=new MutationObserver(()=>{clearTimeout(cleanTimer);cleanTimer=setTimeout(sanitize,40)});
  observer.observe(document.body,{childList:true,subtree:true});
  init();
})();