(()=>{
  if(window.__finalShellV118)return;
  window.__finalShellV118=true;
  const ORDER=['home','announcements','calendar','uniform','board','resources','gallery'];
  const LABELS={home:'Dashboard',announcements:'Announcements',calendar:'Calendar',uniform:'Uniform',board:'Message Board',resources:'Resources',gallery:'Gallery'};

  const style=document.createElement('style');
  style.id='finalShellV118Styles';
  style.textContent=`
  @media(min-width:1024px){
    body.guest-shell .public-header{position:sticky!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:96px!important;min-height:96px!important;max-height:96px!important;display:grid!important;grid-template-columns:300px minmax(0,1fr) 106px!important;align-items:center!important;gap:20px!important;padding:0 28px!important;background:#082944!important;border:0!important;border-bottom:1px solid #284660!important;box-shadow:0 4px 14px rgba(0,0,0,.14)!important;overflow:visible!important;z-index:150!important;box-sizing:border-box!important}
    body.guest-shell .public-brand{display:flex!important;align-items:center!important;gap:12px!important;width:300px!important;min-width:300px!important;max-width:300px!important;height:auto!important;padding:0!important;margin:0!important;border:0!important;overflow:visible!important}
    body.guest-shell .public-brand .crest{width:54px!important;height:54px!important;min-width:54px!important;border:3px solid #ffd83d!important;border-radius:11px!important;color:#f4f7fb!important;background:transparent!important;font-size:18px!important;font-weight:900!important}
    body.guest-shell .public-brand>div:last-child{opacity:1!important;width:auto!important;overflow:visible!important;white-space:nowrap!important}
    body.guest-shell .public-brand strong{display:block!important;color:#ffd83d!important;font-size:20px!important;line-height:1.05!important;letter-spacing:.03em!important}
    body.guest-shell .public-brand small{display:block!important;color:#d3dee8!important;font-size:9px!important;line-height:1.2!important;letter-spacing:.08em!important;margin-top:5px!important}
    body.guest-shell .public-nav{display:none!important}
    body.guest-shell .guest-fixed-nav{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:4px!important;min-width:0!important;width:100%!important;overflow:hidden!important}
    body.guest-shell .guest-fixed-nav button{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;min-height:52px!important;padding:10px 11px!important;border:0!important;border-radius:10px!important;background:transparent!important;color:#f0f4f8!important;font-size:14px!important;font-weight:800!important;line-height:1.15!important;white-space:nowrap!important;cursor:pointer!important;flex:0 1 auto!important}
    body.guest-shell .guest-fixed-nav button.active,body.guest-shell .guest-fixed-nav button:hover{background:#235d91!important;color:#fff!important}
    body.guest-shell #signInBtn{display:flex!important;align-items:center!important;justify-content:center!important;width:106px!important;min-width:106px!important;max-width:106px!important;min-height:60px!important;margin:0!important;padding:10px 14px!important;border:0!important;border-radius:11px!important;background:#ffd83d!important;color:#071528!important;font-size:15px!important;font-weight:900!important;line-height:1.05!important;white-space:normal!important;text-align:center!important}
    body.guest-shell #adminPortalBtn,body.guest-shell .site-rail-toggle,body.guest-shell .cadet-dash-wrap{display:none!important}
    body.guest-shell #publicSite,body.guest-shell #publicFooter,body.guest-shell .site-alert-banner{margin-left:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}
    @media(max-width:1500px){
      body.guest-shell .public-header{grid-template-columns:280px minmax(0,1fr) 100px!important;gap:12px!important;padding:0 22px!important}
      body.guest-shell .public-brand{width:280px!important;min-width:280px!important;max-width:280px!important}
      body.guest-shell .public-brand strong{font-size:18px!important}
      body.guest-shell .guest-fixed-nav{gap:2px!important}
      body.guest-shell .guest-fixed-nav button{padding-left:8px!important;padding-right:8px!important;font-size:13px!important}
      body.guest-shell #signInBtn{width:100px!important;min-width:100px!important;max-width:100px!important;font-size:14px!important}
    }
    @media(max-width:1280px){
      body.guest-shell .public-header{grid-template-columns:245px minmax(0,1fr) 88px!important;gap:8px!important;padding:0 16px!important}
      body.guest-shell .public-brand{width:245px!important;min-width:245px!important;max-width:245px!important}
      body.guest-shell .public-brand strong{font-size:16px!important}
      body.guest-shell .public-brand small{font-size:8px!important}
      body.guest-shell .guest-fixed-nav button{padding-left:5px!important;padding-right:5px!important;font-size:11px!important}
      body.guest-shell #signInBtn{width:88px!important;min-width:88px!important;max-width:88px!important;font-size:12px!important}
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
    }catch(e){console.warn('v118 shell sync',e)}
  }
  sync();
  [200,600,1200,2500,5000].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',e=>{if(e.target.closest('[data-public]'))setTimeout(makeGuestNav,20)});
  if(typeof sb!=='undefined'&&sb?.auth)sb.auth.onAuthStateChange(()=>setTimeout(sync,0));
})();