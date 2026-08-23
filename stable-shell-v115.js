(()=>{
  if(window.__stableShellV115)return;
  window.__stableShellV115=true;

  const style=document.createElement('style');
  style.id='stableShellV115Styles';
  style.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    body{--stable-panel:286px}

    @media(min-width:1024px){
      /* PUBLIC / SIGNED-OUT: one clean top bar */
      body.guest-shell .public-header{
        position:sticky!important;inset:auto!important;top:0!important;
        width:100%!important;height:82px!important;min-height:82px!important;max-height:82px!important;
        display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;
        gap:18px!important;padding:0 clamp(28px,4vw,62px)!important;
        background:linear-gradient(90deg,#062642,#0a3154)!important;
        border:0!important;border-bottom:1px solid #29435f!important;box-shadow:0 7px 22px rgba(0,0,0,.08)!important;
        overflow:visible!important;z-index:90!important;box-sizing:border-box!important;
      }
      body.guest-shell .public-brand{width:auto!important;min-width:255px!important;max-width:320px!important;height:auto!important;padding:0!important;margin:0!important;border:0!important;gap:11px!important;flex:0 0 auto!important;overflow:visible!important}
      body.guest-shell .public-brand .crest{width:48px!important;height:48px!important;min-width:48px!important;border-radius:12px!important}
      body.guest-shell .public-brand>div:last-child{opacity:1!important;width:auto!important;overflow:visible!important;white-space:nowrap!important}
      body.guest-shell .public-brand strong{font-size:19px!important}
      body.guest-shell .public-nav{display:flex!important;flex:1 1 auto!important;flex-direction:row!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;margin:0!important;width:auto!important;max-height:none!important;overflow:visible!important}
      body.guest-shell .public-nav button{width:auto!important;min-width:0!important;min-height:42px!important;padding:10px 12px!important;border-radius:9px!important;font-size:13px!important;line-height:1.1!important;text-align:center!important;white-space:nowrap!important;overflow:visible!important}
      body.guest-shell .public-nav button::before{display:none!important;content:none!important}
      body.guest-shell .public-header>#signInBtn{display:block!important;width:auto!important;min-height:46px!important;margin:0!important;padding:10px 18px!important;border-radius:11px!important;font-size:13px!important;flex:0 0 auto!important;white-space:nowrap!important}
      body.guest-shell .public-header>#signInBtn::before{display:none!important;content:none!important}
      body.guest-shell .site-rail-toggle,body.guest-shell #adminPortalBtn{display:none!important}
      body.guest-shell #publicSite,body.guest-shell #publicFooter,body.guest-shell .site-alert-banner{margin-left:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}

      /* SIGNED-IN CADET: fixed full side panel */
      body.account-shell .public-header{
        position:fixed!important;inset:0 auto 0 0!important;top:0!important;left:0!important;
        width:var(--stable-panel)!important;height:100vh!important;min-height:100vh!important;max-height:100vh!important;
        display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;
        padding:24px 18px 20px!important;background:linear-gradient(180deg,#062642 0%,#0a3154 100%)!important;
        border:0!important;border-right:1px solid rgba(160,194,222,.24)!important;box-shadow:10px 0 30px rgba(0,0,0,.13)!important;
        overflow:visible!important;z-index:90!important;box-sizing:border-box!important;
      }
      body.account-shell .public-brand{display:flex!important;align-items:center!important;gap:14px!important;width:100%!important;min-width:0!important;height:auto!important;padding:2px 4px 20px!important;margin:0!important;border-bottom:1px solid rgba(255,255,255,.16)!important;overflow:hidden!important;flex:0 0 auto!important}
      body.account-shell .public-brand .crest{width:58px!important;height:58px!important;min-width:58px!important;border:4px solid #ffd83d!important;border-radius:14px!important;color:#ffd83d!important;font-size:18px!important}
      body.account-shell .public-brand>div:last-child{opacity:1!important;width:180px!important;overflow:hidden!important;white-space:nowrap!important}
      body.account-shell .public-brand strong{font-size:21px!important}.account-shell .public-brand small{font-size:10px!important}
      body.account-shell .public-nav{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:7px!important;margin:22px 0 14px!important;width:100%!important;max-height:calc(100vh - 210px)!important;overflow-y:auto!important;overflow-x:hidden!important;flex:1 1 auto!important}
      body.account-shell .public-nav button{display:block!important;width:100%!important;min-height:52px!important;padding:13px 14px!important;border-radius:13px!important;font-size:15px!important;font-weight:800!important;text-align:left!important;white-space:nowrap!important;overflow:hidden!important;color:#eaf2f8!important}
      body.account-shell .public-nav button.hidden{display:none!important}
      body.account-shell .public-nav button::before{display:inline-grid!important;content:attr(data-shell-icon)!important;place-items:center!important;width:30px!important;margin-right:12px!important;font-size:20px!important}
      body.account-shell .public-nav button.active,body.account-shell .public-nav button:hover{background:#235d91!important;color:#fff!important}
      body.account-shell .public-header>.sign-in{display:block!important;width:100%!important;min-height:48px!important;padding:11px 13px!important;border-radius:12px!important;font-size:13px!important;background:#ffd83d!important;color:#071528!important;border:0!important;flex:0 0 auto!important}
      body.account-shell .site-rail-toggle{display:none!important}
      body.account-shell #publicSite,body.account-shell #publicFooter,body.account-shell .site-alert-banner{margin-left:var(--stable-panel)!important;width:auto!important;max-width:none!important;box-sizing:border-box!important}
      body.account-shell #publicSite{min-height:100vh!important}

      /* ADMIN: same panel size/look as cadet shell */
      .admin-side{
        position:fixed!important;inset:0 auto 0 0!important;width:var(--stable-panel)!important;height:100vh!important;
        padding:24px 18px 88px!important;background:linear-gradient(180deg,#062642 0%,#0a3154 100%)!important;
        border-right:1px solid rgba(160,194,222,.24)!important;box-shadow:10px 0 30px rgba(0,0,0,.13)!important;
        overflow:visible!important;z-index:90!important;box-sizing:border-box!important;
      }
      .admin-side .brand{display:flex!important;align-items:center!important;gap:14px!important;height:auto!important;padding:2px 4px 20px!important;border-bottom:1px solid rgba(255,255,255,.16)!important;overflow:hidden!important}
      .admin-side .brand .crest{width:58px!important;height:58px!important;min-width:58px!important;border-radius:14px!important}
      .admin-side .brand>div:last-child{opacity:1!important;width:180px!important;overflow:hidden!important;white-space:nowrap!important}
      .admin-side nav{display:flex!important;flex-direction:column!important;gap:7px!important;margin-top:22px!important;max-height:calc(100vh - 205px)!important;overflow-y:auto!important;overflow-x:hidden!important}
      .admin-side nav button{display:block!important;width:100%!important;min-height:52px!important;padding:13px 14px!important;border-radius:13px!important;font-size:15px!important;font-weight:800!important;text-align:left!important;white-space:nowrap!important;overflow:hidden!important;color:#eaf2f8!important}
      .admin-side nav button::before{display:inline-grid!important;content:attr(data-shell-icon)!important;place-items:center!important;width:30px!important;margin-right:12px!important;font-size:20px!important}
      .admin-side nav button.active,.admin-side nav button:hover{background:#235d91!important;color:#fff!important}
      .admin-side .back-btn{left:18px!important;right:18px!important;bottom:18px!important;width:calc(100% - 36px)!important;min-height:48px!important;font-size:13px!important;border-radius:12px!important}
      .admin-side .back-btn::before{margin-right:8px!important}
      .admin-rail-toggle{display:none!important}
      .admin-main{margin-left:var(--stable-panel)!important;width:auto!important;max-width:none!important;box-sizing:border-box!important}

      /* Remove experimental dropdown shell completely */
      .cadet-dash-wrap{display:none!important}
    }

    @media(max-width:1023px){
      .cadet-dash-wrap{display:none!important}
    }
  `;
  document.head.appendChild(style);

  function cleanExperimental(){
    document.querySelectorAll('.cadet-dash-wrap').forEach(x=>x.remove());
    document.body.classList.remove('admin-rail-open');
  }
  cleanExperimental();
  [100,400,900,1600,3000].forEach(ms=>setTimeout(cleanExperimental,ms));
})();
