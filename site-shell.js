(()=>{
  if(window.__siteShellFinal)return;
  window.__siteShellFinal=true;

  const PUBLIC=[
    ['home','Dashboard'],['announcements','Announcements'],['calendar','Calendar'],['uniform','Uniform'],['board','Message Board'],['resources','Resources'],['gallery','Gallery']
  ];
  const CADET=[
    ['home','Home','⌂'],['cadet-dashboard','Cadet Dashboard','▦'],['announcements','Announcements','◉'],['calendar','Calendar','▣'],['uniform-day','Uniform of the Day','◇'],['board','Community','□'],['uniform-guide','Uniform Guide','◇'],['handbook','Cadet Handbook','▤'],['resources','Resources','▤'],['service','Service Hours','◷'],['drill-quiz','Drill Quiz','◆'],['gallery','Gallery','▧'],['flight','My Flight','✈'],['ranks','Ranks & Info','☆']
  ];

  const style=document.createElement('style');
  style.id='siteShellFinalStyles';
  style.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    body.shell-loading .public-header{visibility:hidden!important}
    .site-shell-nav{display:none}

    @media(min-width:1024px){
      body.guest-shell .public-header{
        position:sticky!important;top:0!important;left:0!important;right:0!important;
        width:100%!important;height:76px!important;min-height:76px!important;max-height:76px!important;
        display:grid!important;grid-template-columns:270px minmax(0,1fr) 92px!important;align-items:center!important;
        gap:12px!important;padding:0 18px!important;background:#041827!important;
        border:0!important;border-bottom:1px solid rgba(142,174,201,.16)!important;
        box-shadow:0 5px 18px rgba(0,0,0,.16)!important;z-index:200!important;box-sizing:border-box!important;overflow:visible!important
      }
      body.guest-shell .public-brand{display:flex!important;align-items:center!important;gap:10px!important;width:270px!important;min-width:270px!important;max-width:270px!important;padding:0!important;margin:0!important;border:0!important;overflow:visible!important}
      body.guest-shell .public-brand .crest{width:48px!important;height:48px!important;min-width:48px!important;border:2px solid #ffd83d!important;border-radius:10px!important;background:transparent!important;color:#f5f8fb!important;font-size:17px!important}
      body.guest-shell .public-brand>div:last-child{width:auto!important;opacity:1!important;overflow:visible!important;white-space:nowrap!important}
      body.guest-shell .public-brand strong{display:block!important;color:#ffd83d!important;font-size:17px!important;letter-spacing:.03em!important;line-height:1!important}
      body.guest-shell .public-brand small{display:block!important;color:#aebdca!important;font-size:8px!important;letter-spacing:.11em!important;margin-top:5px!important}
      body.guest-shell .public-nav{display:none!important}
      body.guest-shell .site-shell-nav{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:3px!important;min-width:0!important;width:100%!important}
      body.guest-shell .site-shell-nav button{border:1px solid transparent!important;background:transparent!important;color:#dbe6ef!important;border-radius:8px!important;min-height:40px!important;padding:8px 9px!important;font-size:12px!important;font-weight:800!important;white-space:nowrap!important;cursor:pointer!important;flex:0 1 auto!important}
      body.guest-shell .site-shell-nav button:hover{background:#0d304d!important;color:#fff!important}
      body.guest-shell .site-shell-nav button.active{background:#123b5f!important;border-color:#1f527b!important;color:#fff!important}
      body.guest-shell #signInBtn{display:flex!important;align-items:center!important;justify-content:center!important;width:92px!important;min-width:92px!important;min-height:46px!important;margin:0!important;padding:9px 12px!important;border:0!important;border-radius:9px!important;background:#ffd83d!important;color:#061523!important;font-size:13px!important;font-weight:900!important;white-space:nowrap!important;cursor:pointer!important}
      body.guest-shell #adminPortalBtn{display:none!important}
      body.guest-shell #publicSite,body.guest-shell #publicFooter,body.guest-shell .site-alert-banner{margin-left:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}

      body.account-shell{--cadet-panel:286px}
      body.account-shell .public-header{
        position:fixed!important;inset:0 auto 0 0!important;width:var(--cadet-panel)!important;height:100vh!important;min-height:100vh!important;max-height:100vh!important;
        display:flex!important;flex-direction:column!important;align-items:stretch!important;padding:22px 14px 18px!important;
        background:#061d31!important;border:0!important;border-right:1px solid rgba(143,178,207,.2)!important;
        box-shadow:8px 0 26px rgba(0,0,0,.16)!important;z-index:200!important;box-sizing:border-box!important;overflow:hidden!important
      }
      body.account-shell .public-brand{display:flex!important;align-items:center!important;gap:12px!important;width:100%!important;min-width:0!important;padding:2px 2px 18px!important;margin:0!important;border-bottom:1px solid rgba(255,255,255,.12)!important;overflow:hidden!important}
      body.account-shell .public-brand .crest{width:52px!important;height:52px!important;min-width:52px!important;border:2px solid #ffd83d!important;border-radius:50%!important;color:#f4f7fb!important;background:transparent!important;font-size:16px!important}
      body.account-shell .public-brand>div:last-child{width:190px!important;opacity:1!important;overflow:hidden!important;white-space:nowrap!important}
      body.account-shell .public-brand strong{display:block!important;color:#ffd83d!important;font-size:20px!important}
      body.account-shell .public-brand small{display:block!important;color:#c1ccd7!important;font-size:9px!important;margin-top:3px!important;letter-spacing:.06em!important}
      body.account-shell .public-nav{display:none!important}
      body.account-shell .site-shell-nav{display:flex!important;flex:1 1 auto!important;flex-direction:column!important;align-items:stretch!important;gap:4px!important;margin:16px 0 12px!important;padding-right:2px!important;overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:thin!important}
      body.account-shell .site-shell-nav button{display:flex!important;align-items:center!important;width:100%!important;min-height:44px!important;padding:10px 11px!important;border:0!important;border-radius:10px!important;background:transparent!important;color:#e8f0f6!important;font-size:13px!important;font-weight:800!important;text-align:left!important;white-space:nowrap!important;cursor:pointer!important}
      body.account-shell .site-shell-nav button .shell-icon{display:inline-grid!important;place-items:center!important;width:27px!important;min-width:27px!important;margin-right:8px!important;font-size:16px!important;color:#dce8f2!important}
      body.account-shell .site-shell-nav button:hover,body.account-shell .site-shell-nav button.active{background:#16466f!important;color:#fff!important}
      body.account-shell .public-header>.sign-in,body.account-shell #adminPortalBtn{flex:0 0 auto!important;width:100%!important;min-height:46px!important;margin:0!important;padding:10px 12px!important;border:0!important;border-radius:10px!important;background:#ffd83d!important;color:#071528!important;font-size:13px!important;font-weight:900!important;cursor:pointer!important}
      body.account-shell #publicSite,body.account-shell #publicFooter,body.account-shell .site-alert-banner{margin-left:var(--cadet-panel)!important;width:auto!important;max-width:none!important;box-sizing:border-box!important}
      body.account-shell #publicSite{min-height:100vh!important}
      .site-rail-toggle,.cadet-dash-wrap{display:none!important}
    }

    @media(max-width:1023px){
      body.guest-shell .site-shell-nav,body.account-shell .site-shell-nav{display:none!important}
      body.guest-shell .public-nav,body.account-shell .public-nav{display:none!important}
      body .public-header{position:sticky!important;top:0!important;width:100%!important;height:72px!important;min-height:72px!important;display:flex!important;flex-direction:row!important;align-items:center!important;gap:9px!important;padding:0 12px!important;background:#041827!important;border-bottom:1px solid rgba(142,174,201,.16)!important;z-index:200!important;box-sizing:border-box!important}
      body .public-brand{display:flex!important;align-items:center!important;gap:9px!important;flex:1 1 auto!important;min-width:0!important;padding:0!important;border:0!important}
      body .public-brand .crest{width:42px!important;height:42px!important;min-width:42px!important;border-radius:9px!important;border:2px solid #ffd83d!important}
      body .public-brand strong{font-size:15px!important}body .public-brand small{font-size:7px!important}
      body .mobile-menu-btn{display:grid!important;place-items:center!important;width:40px!important;height:40px!important;border:0!important;border-radius:9px!important;background:#123b5f!important;color:#fff!important;font-size:11px!important}
      body #signInBtn{min-height:40px!important;padding:8px 10px!important;border-radius:9px!important}
      body #publicSite,body #publicFooter,body .site-alert-banner{margin-left:0!important;width:100%!important}
      body #mobileNav:not(.hidden){display:grid!important;position:fixed!important;top:72px!important;left:0!important;right:0!important;z-index:199!important;grid-template-columns:1fr 1fr!important;gap:8px!important;padding:12px!important;background:#061d31!important;border-bottom:1px solid rgba(142,174,201,.18)!important}
      body #mobileNav button{border:1px solid rgba(255,255,255,.1)!important;background:#0d304d!important;color:#eef5fb!important;border-radius:9px!important;padding:11px!important;font-weight:800!important}
    }
  `;
  document.head.appendChild(style);

  function routePublic(key){
    if(key==='uniform-guide'){location.href='/uniform.html';return}
    if(key==='uniform-day'){location.href='/uniform-day.html';return}
    if(key==='handbook'){location.href='/handbook.html';return}
    const original=document.querySelector(`.public-nav button[data-public="${CSS.escape(key)}"]`);
    if(original){original.click();setActive(key);return}
    location.href='/?open='+encodeURIComponent(key);
  }

  function setActive(key){
    document.querySelectorAll('.site-shell-nav button[data-shell-page]').forEach(b=>b.classList.toggle('active',b.dataset.shellPage===key));
  }

  function currentPage(){return document.querySelector('.public-page.active')?.id?.replace(/^public-/,'')||'home'}

  function ensureNav(signedIn){
    const header=document.querySelector('.public-header');
    if(!header)return;
    let nav=header.querySelector('.site-shell-nav');
    if(!nav){nav=document.createElement('nav');nav.className='site-shell-nav';nav.setAttribute('aria-label',signedIn?'Cadet navigation':'Public navigation');const sign=document.getElementById('signInBtn');header.insertBefore(nav,sign||null)}
    nav.innerHTML='';
    const items=signedIn?CADET:PUBLIC;
    items.forEach(([key,label,icon])=>{
      const b=document.createElement('button');b.type='button';b.dataset.shellPage=key;
      if(signedIn&&icon){const i=document.createElement('span');i.className='shell-icon';i.textContent=icon;b.appendChild(i);const t=document.createElement('span');t.textContent=label;b.appendChild(t)}else b.textContent=label;
      b.addEventListener('click',()=>routePublic(key));nav.appendChild(b);
    });
    setActive(currentPage());
  }

  function setBrand(signedIn){
    const brand=document.querySelector('.public-brand');if(!brand)return;
    const crest=brand.querySelector('.crest'),strong=brand.querySelector('strong'),small=brand.querySelector('small');
    if(signedIn){if(crest)crest.textContent='GP';if(strong)strong.textContent='AFJROTC';if(small)small.textContent='GWYNN PARK HIGH SCHOOL'}
    else{if(crest)crest.textContent='803';if(strong)strong.textContent='MD-803 AFJROTC';if(small)small.textContent='GWYNN PARK HIGH SCHOOL'}
  }

  function applySession(session){
    const signedIn=!!session?.user;
    document.body.classList.toggle('account-shell',signedIn);document.body.classList.toggle('guest-shell',!signedIn);
    document.body.classList.remove('site-rail-open','admin-rail-open');
    setBrand(signedIn);ensureNav(signedIn);
    const sign=document.getElementById('signInBtn');if(sign&&!signedIn){sign.textContent='Sign In';sign.classList.remove('hidden')}
    document.body.classList.remove('shell-loading');
  }

  async function init(){
    document.body.classList.add('shell-loading');
    try{
      if(typeof sb==='undefined'||!sb?.auth){applySession(null);return}
      const {data}=await sb.auth.getSession();applySession(data?.session||null);
      sb.auth.onAuthStateChange((_e,session)=>setTimeout(()=>applySession(session),0));
    }catch(e){console.warn('Site shell auth sync failed',e);applySession(null)}
  }

  document.addEventListener('click',e=>{
    const p=e.target.closest('[data-public]')?.dataset.public;
    if(p)setTimeout(()=>setActive(p),0);
  });
  const oldShow=window.showPublic;
  if(typeof oldShow==='function')window.showPublic=function(page){oldShow(page);setActive(page)};
  init();
})();