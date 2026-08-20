(()=>{
  if(document.getElementById('mobileShellStyles'))return;
  const s=document.createElement('style');
  s.id='mobileShellStyles';
  s.textContent=`
    @media(max-width:1023px){
      :root{--site-mobile-rail:64px;--site-mobile-open:min(82vw,250px)}
      html,body{min-height:100%;overscroll-behavior-y:none}
      body{min-width:0;overflow-x:hidden}
      .public-header{position:fixed!important;inset:0 auto 0 0!important;width:var(--site-mobile-rail)!important;height:100vh!important;height:100dvh!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;padding:12px 8px!important;background:linear-gradient(180deg,#0b1b31,#0a2747)!important;border:0!important;border-right:1px solid #29435f!important;box-shadow:6px 0 22px rgba(15,23,42,.08)!important;overflow:visible!important;transition:width .22s ease!important;z-index:80!important}
      body.site-rail-open .public-header{width:var(--site-mobile-open)!important}
      .public-brand{display:flex!important;align-items:center!important;gap:8px!important;width:100%!important;min-width:0!important;padding:2px 0 12px!important;border-bottom:1px solid rgba(255,255,255,.12)!important;overflow:hidden!important}
      .public-brand .crest{width:42px!important;height:42px!important;min-width:42px!important;border-radius:50%!important;font-size:14px!important}
      .public-brand>div:last-child{opacity:0!important;width:0!important;overflow:hidden!important;white-space:nowrap!important;transition:opacity .16s ease,width .22s ease!important}
      body.site-rail-open .public-brand>div:last-child{opacity:1!important;width:165px!important}
      .public-nav{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:3px!important;width:100%!important;margin:10px 0 8px!important;max-height:calc(100dvh - 150px)!important;overflow-y:auto!important;overflow-x:hidden!important;flex:1 1 auto!important}
      .public-nav button{display:block!important;position:relative!important;width:100%!important;min-height:44px!important;border:0!important;border-radius:10px!important;padding:10px!important;text-align:left!important;color:#eef5fb!important;background:transparent!important;white-space:nowrap!important;overflow:hidden!important;font-size:0!important;font-weight:700!important}
      .public-nav button.hidden{display:none!important}
      .public-nav button::before{content:attr(data-shell-icon);display:inline-grid!important;place-items:center!important;width:28px!important;height:24px!important;font-size:19px!important;line-height:1!important;color:#fff!important;vertical-align:middle!important}
      body.site-rail-open .public-nav button{font-size:13px!important}
      body.site-rail-open .public-nav button::before{margin-right:8px!important}
      .public-nav button.active,.public-nav button:hover{background:#173f6b!important;color:#fff!important}
      .public-header>.sign-in{display:block!important;width:100%!important;min-height:42px!important;margin-top:6px!important;border-radius:10px!important;padding:8px!important;overflow:hidden!important;white-space:nowrap!important;font-size:0!important;flex:0 0 auto!important}
      .public-header>.sign-in::before{content:attr(data-shell-icon);font-size:18px!important}
      body.site-rail-open .public-header>.sign-in{font-size:12px!important}
      body.site-rail-open .public-header>.sign-in::before{margin-right:6px!important}
      .mobile-menu-btn,#mobileNav{display:none!important}
      #publicSite,#publicFooter,.site-alert-banner{margin-left:var(--site-mobile-rail)!important;transition:margin-left .22s ease!important}
      body.site-rail-open #publicSite,body.site-rail-open #publicFooter,body.site-rail-open .site-alert-banner{margin-left:var(--site-mobile-open)!important}
      #publicSite{width:auto!important;min-width:0!important;min-height:100dvh!important}
      .public-page{padding:18px 12px 28px!important}
      .site-rail-toggle{display:grid!important;position:absolute!important;top:94px!important;right:-17px!important;width:34px!important;height:64px!important;border:0!important;border-radius:0 11px 11px 0!important;background:#ffd83d!important;color:#071528!important;box-shadow:4px 6px 16px rgba(15,23,42,.16)!important;font-size:23px!important;font-weight:900!important;place-items:center!important;z-index:90!important}
      .admin-shell{min-height:100dvh!important}
      .admin-side{position:fixed!important;inset:0 auto 0 0!important;width:var(--site-mobile-rail)!important;height:100vh!important;height:100dvh!important;padding:12px 8px 74px!important;background:linear-gradient(180deg,#0b1b31,#0a2747)!important;border-right:1px solid #29435f!important;box-shadow:6px 0 22px rgba(15,23,42,.08)!important;overflow:visible!important;transition:width .22s ease!important;z-index:80!important}
      body.admin-rail-open .admin-side{width:var(--site-mobile-open)!important}
      .admin-side .brand{height:58px!important;padding:2px 0 12px!important;gap:8px!important;overflow:hidden!important;white-space:nowrap!important}
      .admin-side .brand .crest{width:42px!important;height:42px!important;min-width:42px!important;border-radius:50%!important}
      .admin-side .brand>div:last-child{opacity:0!important;width:0!important;overflow:hidden!important}
      body.admin-rail-open .admin-side .brand>div:last-child{opacity:1!important;width:165px!important}
      .admin-side nav{display:flex!important;flex-direction:column!important;gap:3px!important;margin-top:10px!important;max-height:calc(100dvh - 150px)!important;overflow-y:auto!important;overflow-x:hidden!important}
      .admin-side nav button{width:100%!important;min-height:44px!important;padding:10px!important;border-radius:10px!important;white-space:nowrap!important;overflow:hidden!important;font-size:0!important}
      .admin-side nav button::before{content:attr(data-shell-icon);display:inline-grid!important;place-items:center!important;width:28px!important;height:24px!important;font-size:19px!important;color:#fff!important;vertical-align:middle!important}
      body.admin-rail-open .admin-side nav button{font-size:13px!important}
      body.admin-rail-open .admin-side nav button::before{margin-right:8px!important}
      .admin-side .back-btn{position:absolute!important;left:8px!important;right:8px!important;bottom:12px!important;width:calc(100% - 16px)!important;margin:0!important;overflow:hidden!important;white-space:nowrap!important;font-size:0!important;border-radius:10px!important}
      .admin-side .back-btn::before{content:'←';font-size:18px!important}
      body.admin-rail-open .admin-side .back-btn{font-size:12px!important}
      body.admin-rail-open .admin-side .back-btn::before{margin-right:6px!important}
      .admin-main{margin-left:var(--site-mobile-rail)!important;transition:margin-left .22s ease!important;min-width:0!important;min-height:100dvh!important}
      body.admin-rail-open .admin-main{margin-left:var(--site-mobile-open)!important}
      .admin-rail-toggle{display:grid!important;position:absolute!important;top:94px!important;right:-17px!important;width:34px!important;height:64px!important;border:0!important;border-radius:0 11px 11px 0!important;background:#ffd83d!important;color:#071528!important;box-shadow:4px 6px 16px rgba(15,23,42,.16)!important;font-size:23px!important;font-weight:900!important;place-items:center!important;z-index:90!important}
      .admin-top{padding:12px!important}
    }
  `;
  document.head.appendChild(s);
})();