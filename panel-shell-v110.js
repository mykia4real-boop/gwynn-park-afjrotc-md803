(()=>{
  if(document.getElementById('panelShellV110Styles'))return;

  const style=document.createElement('style');
  style.id='panelShellV110Styles';
  style.textContent=`
    /* v111 — signed-in users get the full professional panel; guests always get a top bar */
    body.account-shell{--account-panel-width:286px}
    body.guest-shell #adminPortalBtn{display:none!important}

    @media(min-width:1024px){
      body.account-shell .public-header{width:var(--account-panel-width)!important;padding:24px 18px 20px!important;background:linear-gradient(180deg,#062642 0%,#0a3154 100%)!important;border-right:1px solid rgba(160,194,222,.24)!important;box-shadow:10px 0 30px rgba(0,0,0,.13)!important}
      body.account-shell .public-brand{gap:14px!important;padding:2px 4px 20px!important;border-bottom:1px solid rgba(255,255,255,.16)!important}
      body.account-shell .public-brand .crest{width:58px!important;height:58px!important;min-width:58px!important;border:4px solid #ffd83d!important;border-radius:50%!important;color:#ffd83d!important;font-size:18px!important}
      body.account-shell .public-brand>div:last-child{opacity:1!important;width:180px!important}
      body.account-shell .public-brand strong{font-size:21px!important;letter-spacing:.02em!important}
      body.account-shell .public-brand small{font-size:10px!important;letter-spacing:.06em!important;margin-top:4px!important}
      body.account-shell .public-nav{gap:7px!important;margin:22px 0 14px!important;max-height:calc(100vh - 210px)!important}
      body.account-shell .public-nav button{min-height:52px!important;padding:13px 14px!important;border-radius:13px!important;font-size:15px!important;font-weight:800!important;color:#eaf2f8!important}
      body.account-shell .public-nav button::before{margin-right:12px!important;font-size:20px!important}
      body.account-shell .public-nav button.active,body.account-shell .public-nav button:hover{background:#235d91!important;color:#fff!important}
      body.account-shell .public-header>.sign-in{min-height:48px!important;padding:11px 13px!important;border-radius:12px!important;font-size:13px!important;background:#ffd83d!important;color:#071528!important;border:0!important}
      body.account-shell .public-header>.sign-in::before{margin-right:8px!important}
      body.account-shell .site-rail-toggle{display:none!important}
      body.account-shell #publicSite,body.account-shell #publicFooter,body.account-shell .site-alert-banner{margin-left:var(--account-panel-width)!important}
      body.account-shell .public-page{padding-top:38px!important}

      body.guest-shell .public-header{position:sticky!important;inset:auto!important;top:0!important;width:100%!important;height:82px!important;min-height:82px!important;max-height:82px!important;display:flex!important;flex-direction:row!important;align-items:center!important;gap:18px!important;padding:0 4%!important;background:linear-gradient(90deg,#062642,#0a3154)!important;border:0!important;border-bottom:1px solid #29435f!important;box-shadow:0 7px 22px rgba(0,0,0,.08)!important;overflow:visible!important}
      body.guest-shell .public-brand{width:auto!important;min-width:255px!important;height:auto!important;padding:0!important;border:0!important;gap:11px!important;overflow:visible!important}
      body.guest-shell .public-brand .crest{width:48px!important;height:48px!important;min-width:48px!important;border-radius:50%!important}
      body.guest-shell .public-brand>div:last-child{opacity:1!important;width:auto!important;overflow:visible!important}
      body.guest-shell .public-brand strong{font-size:19px!important}
      body.guest-shell .public-nav{display:flex!important;flex-direction:row!important;align-items:center!important;gap:4px!important;margin:0 0 0 auto!important;width:auto!important;max-height:none!important;overflow:visible!important}
      body.guest-shell .public-nav button{width:auto!important;min-height:42px!important;padding:10px 12px!important;border-radius:9px!important;font-size:13px!important;text-align:center!important;overflow:visible!important}
      body.guest-shell .public-nav button::before{display:none!important;content:none!important}
      body.guest-shell .public-header>#signInBtn{display:block!important;width:auto!important;min-height:42px!important;margin:0!important;padding:10px 15px!important;border-radius:10px!important;font-size:13px!important;overflow:visible!important}
      body.guest-shell .public-header>#signInBtn::before{display:none!important;content:none!important}
      body.guest-shell .site-rail-toggle{display:none!important}
      body.guest-shell #publicSite,body.guest-shell #publicFooter,body.guest-shell .site-alert-banner{margin-left:0!important}
      body.guest-shell .site-alert-banner{top:82px!important}
    }

    @media(max-width:1023px){
      body.account-shell{--site-mobile-rail:68px;--site-mobile-open:min(92vw,330px)}
      body.account-shell .public-header{background:linear-gradient(180deg,#062642 0%,#0a3154 100%)!important;border-right:1px solid rgba(160,194,222,.24)!important}
      body.account-shell.site-rail-open .public-header{padding:18px 14px!important}
      body.account-shell.site-rail-open .public-brand{gap:13px!important;padding-bottom:18px!important}
      body.account-shell.site-rail-open .public-brand .crest{width:54px!important;height:54px!important;min-width:54px!important;border-width:4px!important;border-radius:50%!important}
      body.account-shell.site-rail-open .public-brand>div:last-child{width:205px!important}
      body.account-shell.site-rail-open .public-brand strong{font-size:20px!important}
      body.account-shell.site-rail-open .public-nav{gap:6px!important;margin-top:18px!important}
      body.account-shell.site-rail-open .public-nav button{min-height:52px!important;padding:13px!important;border-radius:13px!important;font-size:15px!important}
      body.account-shell.site-rail-open .public-nav button::before{margin-right:11px!important}
      body.account-shell .public-nav button.active{background:#235d91!important}
      body.account-shell .site-rail-toggle{background:#ffd83d!important;color:#073252!important}

      body.guest-shell .public-header{position:sticky!important;inset:auto!important;top:0!important;width:100%!important;height:78px!important;min-height:78px!important;max-height:78px!important;display:flex!important;flex-direction:row!important;align-items:center!important;gap:9px!important;padding:0 14px!important;background:linear-gradient(90deg,#062642,#0a3154)!important;border:0!important;border-bottom:1px solid #29435f!important;box-shadow:0 6px 20px rgba(0,0,0,.08)!important;overflow:visible!important}
      body.guest-shell .public-brand{display:flex!important;align-items:center!important;gap:9px!important;width:auto!important;min-width:0!important;height:auto!important;padding:0!important;border:0!important;overflow:visible!important;flex:1 1 auto!important}
      body.guest-shell .public-brand .crest{width:44px!important;height:44px!important;min-width:44px!important;border-radius:50%!important;font-size:13px!important}
      body.guest-shell .public-brand>div:last-child{opacity:1!important;width:auto!important;overflow:hidden!important;white-space:nowrap!important}
      body.guest-shell .public-brand strong{font-size:16px!important}
      body.guest-shell .public-brand small{font-size:8px!important}
      body.guest-shell .public-nav{display:none!important}
      body.guest-shell .site-rail-toggle{display:none!important}
      body.guest-shell .mobile-menu-btn{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;flex:0 0 42px!important;border:0!important;border-radius:11px!important;background:#ffd83d!important;color:#073252!important;font-size:0!important;font-weight:900!important;padding:0!important}
      body.guest-shell .mobile-menu-btn::before{content:'☰';font-size:20px!important;line-height:1!important}
      body.guest-shell .public-header>#signInBtn{display:block!important;width:auto!important;min-height:40px!important;margin:0!important;padding:9px 11px!important;border-radius:10px!important;font-size:11px!important;overflow:visible!important;flex:0 0 auto!important}
      body.guest-shell .public-header>#signInBtn::before{display:none!important;content:none!important}
      body.guest-shell #adminPortalBtn{display:none!important}
      body.guest-shell #mobileNav:not(.hidden){display:grid!important;position:fixed!important;left:0!important;right:0!important;top:78px!important;z-index:75!important;grid-template-columns:1fr 1fr!important;gap:8px!important;padding:14px!important;background:#082944!important;border-bottom:1px solid #29435f!important;box-shadow:0 12px 24px rgba(0,0,0,.18)!important}
      body.guest-shell #mobileNav button{border:1px solid rgba(255,255,255,.1)!important;background:#103b60!important;color:#eef5fb!important;border-radius:10px!important;padding:12px!important;font-weight:800!important}
      body.guest-shell #publicSite,body.guest-shell #publicFooter,body.guest-shell .site-alert-banner{margin-left:0!important}
      body.guest-shell #publicSite{width:100%!important;min-height:calc(100dvh - 78px)!important}
      body.guest-shell .public-page{padding:20px 14px 32px!important}
      body.guest-shell .site-alert-banner{top:78px!important}
    }
  `;
  document.head.appendChild(style);

  function applyMode(session){
    const signedIn=!!session?.user;
    document.body.classList.toggle('account-shell',signedIn);
    document.body.classList.toggle('guest-shell',!signedIn);
    if(signedIn){
      if(localStorage.getItem('afjrotcRailPreferenceSet')!=='1')document.body.classList.add('site-rail-open');
    }else{
      document.body.classList.remove('site-rail-open');
      document.getElementById('adminPortalBtn')?.classList.add('hidden');
      document.getElementById('mobileNav')?.classList.add('hidden');
      document.getElementById('mobileMenuBtn')?.setAttribute('aria-expanded','false');
    }
  }

  async function syncAuth(){
    try{
      if(typeof sb==='undefined')return applyMode(null);
      const {data}=await sb.auth.getSession();
      applyMode(data?.session||null);
      sb.auth.onAuthStateChange((_event,session)=>setTimeout(()=>applyMode(session),0));
    }catch(err){
      console.warn('Panel shell auth sync failed',err);
      applyMode(null);
    }
  }

  document.addEventListener('click',e=>{if(e.target.closest('.site-rail-toggle'))localStorage.setItem('afjrotcRailPreferenceSet','1')});
  syncAuth();
  setTimeout(syncAuth,500);
  setTimeout(syncAuth,1600);
})();
