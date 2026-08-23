(()=>{
  if(window.__cadetShellStability)return;
  window.__cadetShellStability=true;
  let signedIn=false;

  const style=document.createElement('style');
  style.id='cadetShellStabilityStyles';
  style.textContent=`
  @media(min-width:1024px){
    body[data-cadet-shell="1"]{--cadet-panel:350px!important}
    body[data-cadet-shell="1"] .public-header{
      position:fixed!important;inset:0 auto 0 0!important;width:var(--cadet-panel)!important;height:100vh!important;min-height:100vh!important;max-height:100vh!important;
      display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;padding:18px 16px 18px!important;background:#061f35!important;
      border:0!important;border-right:1px solid rgba(143,178,207,.2)!important;box-shadow:8px 0 26px rgba(0,0,0,.16)!important;z-index:500!important;box-sizing:border-box!important;overflow:hidden!important
    }
    body[data-cadet-shell="1"] .public-brand{display:flex!important;align-items:center!important;gap:12px!important;width:100%!important;min-width:0!important;padding:2px 0 18px!important;margin:0!important;border-bottom:1px solid rgba(255,255,255,.12)!important;overflow:hidden!important;flex:0 0 auto!important}
    body[data-cadet-shell="1"] .public-brand .crest{width:54px!important;height:54px!important;min-width:54px!important;border:2px solid #ffd83d!important;border-radius:50%!important;color:#f4f7fb!important;background:transparent!important;font-size:16px!important}
    body[data-cadet-shell="1"] .public-brand>div:last-child{width:auto!important;opacity:1!important;overflow:hidden!important;white-space:nowrap!important}
    body[data-cadet-shell="1"] .public-brand strong{display:block!important;color:#ffd83d!important;font-size:20px!important}
    body[data-cadet-shell="1"] .public-brand small{display:block!important;color:#c1ccd7!important;font-size:9px!important;margin-top:3px!important;letter-spacing:.06em!important}
    body[data-cadet-shell="1"] .public-nav{display:none!important}
    body[data-cadet-shell="1"] .site-shell-nav{display:flex!important;flex:1 1 auto!important;flex-direction:column!important;align-items:stretch!important;gap:4px!important;margin:16px 0 10px!important;padding-right:2px!important;overflow-y:auto!important;overflow-x:hidden!important}
    body[data-cadet-shell="1"] .site-shell-nav button{display:flex!important;align-items:center!important;width:100%!important;min-height:44px!important;padding:10px 12px!important;border:0!important;border-radius:10px!important;background:transparent!important;color:#e8f0f6!important;font-size:13px!important;font-weight:800!important;text-align:left!important;white-space:nowrap!important;cursor:pointer!important}
    body[data-cadet-shell="1"] .site-shell-nav button:hover,body[data-cadet-shell="1"] .site-shell-nav button.active{background:#205a89!important;color:#fff!important}
    body[data-cadet-shell="1"] #publicSite,body[data-cadet-shell="1"] #publicFooter,body[data-cadet-shell="1"] .site-alert-banner{margin-left:var(--cadet-panel)!important;width:auto!important;max-width:none!important;box-sizing:border-box!important}
    body[data-cadet-shell="1"] #publicSite{min-height:100vh!important}
  }
  `;
  document.head.appendChild(style);

  function enforce(){
    if(!signedIn)return;
    document.body.dataset.cadetShell='1';
    document.body.classList.add('account-shell');
    document.body.classList.remove('guest-shell','site-rail-open','admin-rail-open');
    const nav=document.querySelector('.public-header .site-shell-nav');
    if(nav)nav.style.removeProperty('display');
  }

  async function init(){
    try{
      const client=(typeof sb!=='undefined'&&sb?.auth)?sb:(window.__afjrotcShellClient?.auth?window.__afjrotcShellClient:null);
      if(!client){setTimeout(init,100);return}
      const {data}=await client.auth.getSession();
      signedIn=!!data?.session?.user;
      if(signedIn)enforce();
      client.auth.onAuthStateChange((_event,session)=>{signedIn=!!session?.user;if(signedIn)enforce();else{delete document.body.dataset.cadetShell}});
    }catch(e){console.warn('Cadet shell stability',e)}
  }

  document.addEventListener('click',e=>{
    if(!signedIn)return;
    const target=e.target.closest('[data-shell-page],[data-public]');
    if(!target)return;
    enforce();
    setTimeout(enforce,0);
    setTimeout(enforce,80);
    setTimeout(enforce,300);
  },true);

  const observer=new MutationObserver(()=>{
    if(signedIn&&(!document.body.classList.contains('account-shell')||document.body.classList.contains('guest-shell')))enforce();
  });
  observer.observe(document.body,{attributes:true,attributeFilter:['class']});
  init();
})();