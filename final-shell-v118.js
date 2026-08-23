(()=>{
  if(window.__finalShellV120)return;
  window.__finalShellV120=true;
  const ORDER=['home','announcements','calendar','uniform','board','resources','gallery'];
  const LABELS={home:'Dashboard',announcements:'Announcements',calendar:'Calendar',uniform:'Uniform',board:'Message Board',resources:'Resources',gallery:'Gallery'};

  const style=document.createElement('style');
  style.id='finalShellV120Styles';
  style.textContent=`
  @media(min-width:1024px){
    body.guest-shell .public-header{
      position:sticky!important;top:0!important;left:0!important;right:0!important;
      width:100%!important;height:82px!important;min-height:82px!important;max-height:82px!important;
      display:grid!important;grid-template-columns:292px minmax(0,1fr) 94px!important;
      align-items:center!important;gap:16px!important;padding:0 26px!important;
      background:#041a2d!important;
      border:0!important;border-bottom:1px solid rgba(137,174,203,.18)!important;
      box-shadow:0 6px 18px rgba(0,0,0,.16)!important;
      overflow:visible!important;z-index:150!important;box-sizing:border-box!important;
    }
    body.guest-shell .public-brand{
      display:flex!important;align-items:center!important;gap:12px!important;
      width:292px!important;min-width:292px!important;max-width:292px!important;height:auto!important;
      padding:0!important;margin:0!important;border:0!important;overflow:visible!important;
    }
    body.guest-shell .public-brand .crest{
      width:50px!important;height:50px!important;min-width:50px!important;
      border:2px solid #f4cc3b!important;border-radius:10px!important;
      color:#f4f7fb!important;background:transparent!important;font-size:17px!important;font-weight:900!important;
    }
    body.guest-shell .public-brand>div:last-child{opacity:1!important;width:auto!important;overflow:visible!important;white-space:nowrap!important}
    body.guest-shell .public-brand strong{display:block!important;color:#ffd83d!important;font-size:18px!important;line-height:1.05!important;letter-spacing:.035em!important}
    body.guest-shell .public-brand small{display:block!important;color:#aebdca!important;font-size:8px!important;line-height:1.2!important;letter-spacing:.12em!important;margin-top:5px!important}
    body.guest-shell .public-nav{display:none!important}
    body.guest-shell .guest-fixed-nav{
      display:flex!important;align-items:center!important;justify-content:space-between!important;
      gap:2px!important;min-width:0!important;width:100%!important;overflow:hidden!important;
    }
    body.guest-shell .guest-fixed-nav button{
      display:inline-flex!important;align-items:center!important;justify-content:center!important;
      min-width:0!important;min-height:44px!important;padding:9px 10px!important;
      border:1px solid transparent!important;border-radius:8px!important;background:transparent!important;
      color:#dce7f0!important;font-size:13px!important;font-weight:750!important;line-height:1.1!important;
      white-space:nowrap!important;cursor:pointer!important;flex:0 1 auto!important;
      transition:background .16s ease,color .16s ease,border-color .16s ease!important;
    }
    body.guest-shell .guest-fixed-nav button.active{
      background:#113b61!important;color:#fff!important;border-color:#1b4f79!important;
    }
    body.guest-shell .guest-fixed-nav button:hover{
      background:#0d304f!important;color:#fff!important;border-color:#16476f!important;
    }
    body.guest-shell #signInBtn{
      display:flex!important;align-items:center!important;justify-content:center!important;
      width:94px!important;min-width:94px!important;max-width:94px!important;min-height:48px!important;
      margin:0!important;padding:9px 14px!important;border:0!important;border-radius:9px!important;
      background:#ffd83d!important;color:#071528!important;font-size:14px!important;font-weight:900!important;line-height:1!important;
      white-space:nowrap!important;text-align:center!important;box-shadow:0 3px 10px rgba(0,0,0,.14)!important;
    }
    body.guest-shell #adminPortalBtn,body.guest-shell .site-rail-toggle,body.guest-shell .cadet-dash-wrap{display:none!important}
    body.guest-shell #publicSite,body.guest-shell #publicFooter,body.guest-shell .site-alert-banner{margin-left:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}

    @media(max-width:1500px){
      body.guest-shell .public-header{grid-template-columns:265px minmax(0,1fr) 90px!important;gap:10px!important;padding:0 20px!important}
      body.guest-shell .public-brand{width:265px!important;min-width:265px!important;max-width:265px!important}
      body.guest-shell .public-brand strong{font-size:17px!important}
      body.guest-shell .guest-fixed-nav button{padding-left:7px!important;padding-right:7px!important;font-size:12px!important}
      body.guest-shell #signInBtn{width:90px!important;min-width:90px!important;max-width:90px!important;font-size:13px!important}
    }
    @media(max-width:1280px){
      body.guest-shell .public-header{grid-template-columns:230px minmax(0,1fr) 84px!important;gap:7px!important;padding:0 14px!important}
      body.guest-shell .public-brand{width:230px!important;min-width:230px!important;max-width:230px!important;gap:9px!important}
      body.guest-shell .public-brand .crest{width:46px!important;height:46px!important;min-width:46px!important}
      body.guest-shell .public-brand strong{font-size:15px!important}
      body.guest-shell .public-brand small{font-size:7px!important}
      body.guest-shell .guest-fixed-nav button{padding-left:4px!important;padding-right:4px!important;font-size:10.5px!important;min-height:40px!important}
      body.guest-shell #signInBtn{width:84px!important;min-width:84px!important;max-width:84px!important;min-height:44px!important;font-size:12px!important}
    }
  }
  `;
  document.head.appendChild(style);

  function makeGuestNav(){
    const header=document.querySelector('.public-header');
    const original=header?.querySelector('.public-nav');
    if(!header||!original)return;
    let fixed=header.querySelector('.guest-fixed-nav');
    if(!fixed){
      fixed=document.createElement('nav');
      fixed.className='guest-fixed-nav';
      fixed.setAttribute('aria-label','Public navigation');
      ORDER.forEach(key=>{
        const btn=document.createElement('button');
        btn.type='button';btn.dataset.fixedPublic=key;btn.textContent=LABELS[key];
        btn.addEventListener('click',()=>original.querySelector(`button[data-public="${key}"]`)?.click());
        fixed.appendChild(btn);
      });
      const sign=document.getElementById('signInBtn');
      header.insertBefore(fixed,sign||null);
    }
    const current=original.querySelector('button.active[data-public]')?.dataset.public||'home';
    fixed.querySelectorAll('button[data-fixed-public]').forEach(b=>b.classList.toggle('active',b.dataset.fixedPublic===current));
  }

  function removeGuestNav(){document.querySelector('.guest-fixed-nav')?.remove()}

  async function sync(){
    try{
      if(typeof sb==='undefined'||!sb?.auth){setTimeout(sync,120);return}
      const {data}=await sb.auth.getSession();
      const signedIn=!!data?.session?.user;
      document.body.classList.toggle('account-shell',signedIn);
      document.body.classList.toggle('guest-shell',!signedIn);
      if(signedIn){removeGuestNav();return}
      const brand=document.querySelector('.public-brand');
      if(brand){const c=brand.querySelector('.crest');if(c)c.textContent='803';const s=brand.querySelector('strong');if(s)s.textContent='MD-803 AFJROTC';const sm=brand.querySelector('small');if(sm)sm.textContent='GWYNN PARK HIGH SCHOOL'}
      const sign=document.getElementById('signInBtn');if(sign){sign.textContent='Sign In';sign.classList.remove('hidden')}
      makeGuestNav();
    }catch(e){console.warn('v120 shell sync',e)}
  }
  sync();
  [200,600,1200,2500,5000].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{if(e.target.closest('[data-public]'))setTimeout(makeGuestNav,20)});
  if(typeof sb!=='undefined'&&sb?.auth)sb.auth.onAuthStateChange(()=>setTimeout(sync,0));
})();