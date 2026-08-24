(()=>{
  if(window.__afjrotcUiStability)return;
  window.__afjrotcUiStability=true;

  const body=document.body;
  const publicSite=document.getElementById('publicSite');
  let stablePage=document.querySelector('.public-page.active')?.id?.replace(/^public-/,'')||'home';
  let enforcing=false;
  let releaseTimer=0;

  const style=document.createElement('style');
  style.id='afjrotcUiStabilityStyles';
  style.textContent=`
    body.site-booting{min-height:100vh;background:#07111d!important;overflow:hidden!important}
    body.site-booting>#publicSite,
    body.site-booting>#publicFooter,
    body.site-booting>.public-header,
    body.site-booting>.site-alert-banner,
    body.site-booting>#adminApp{visibility:hidden!important;opacity:0!important}
    body.site-booting::before{content:'AFJROTC';position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:#07111d;color:#ffd83d;font:900 22px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:.08em}
    body.site-booting::after{content:'GWYNN PARK HIGH SCHOOL';position:fixed;left:0;right:0;top:calc(50% + 28px);z-index:2147483647;text-align:center;color:#9fb0c2;font:800 9px/1.2 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:.14em}
    body.page-switching .public-page{animation:none!important;transition:none!important}
    body.page-switching .public-page:not(.active){display:none!important}
    body.page-switching .public-page.active{display:block!important}
    body.page-switching #publicSite{overflow-anchor:none}
    html.page-switching-html{scroll-behavior:auto!important}
  `;
  document.head.appendChild(style);

  function targetFor(page){return document.getElementById('public-'+page)}
  function readActive(){return document.querySelector('.public-page.active')?.id?.replace(/^public-/,'')||stablePage||'home'}

  function enforce(page=stablePage){
    const target=targetFor(page)||targetFor(readActive())||document.querySelector('.public-page');
    if(!target)return;
    const key=target.id.replace(/^public-/,'');
    stablePage=key;
    body.dataset.stablePage=key;
    enforcing=true;
    document.querySelectorAll('.public-page').forEach(p=>p.classList.toggle('active',p===target));
    enforcing=false;
  }

  function beginSwitch(page){
    if(targetFor(page))stablePage=page;
    body.dataset.stablePage=stablePage;
    body.classList.add('page-switching');
    document.documentElement.classList.add('page-switching-html');
    clearTimeout(releaseTimer);
  }

  function endSwitch(){
    clearTimeout(releaseTimer);
    releaseTimer=setTimeout(()=>{
      enforce(stablePage);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        body.classList.remove('page-switching');
        document.documentElement.classList.remove('page-switching-html');
      }));
    },0);
  }

  const originalShow=window.showPublic;
  if(typeof originalShow==='function'){
    window.showPublic=function(page){
      if(!targetFor(page))return originalShow.apply(this,arguments);
      beginSwitch(page);
      enforce(page);
      let result;
      try{result=originalShow.apply(this,arguments)}finally{enforce(page);endSwitch()}
      return result;
    };
  }

  document.addEventListener('click',e=>{
    const shell=e.target.closest?.('.site-shell-nav [data-shell-page]');
    if(shell&&targetFor(shell.dataset.shellPage))beginSwitch(shell.dataset.shellPage);
    const legacy=e.target.closest?.('[data-public]');
    if(legacy&&targetFor(legacy.dataset.public))beginSwitch(legacy.dataset.public);
  },true);

  if(publicSite){
    const observer=new MutationObserver(()=>{
      if(enforcing)return;
      const active=[...document.querySelectorAll('.public-page.active')];
      if(active.length!==1){enforce(stablePage);return}
      const key=active[0].id.replace(/^public-/,'');
      if(key!==stablePage&&body.classList.contains('page-switching'))enforce(stablePage);
      else{stablePage=key;body.dataset.stablePage=key}
    });
    observer.observe(publicSite,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  }

  function revealWhenReady(){
    const reveal=()=>{
      if(body.classList.contains('shell-loading'))return false;
      stablePage=readActive();
      enforce(stablePage);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        body.classList.remove('site-booting');
        body.classList.add('site-stable-ready');
      }));
      return true;
    };
    if(reveal())return;
    const observer=new MutationObserver(()=>{if(reveal())observer.disconnect()});
    observer.observe(body,{attributes:true,attributeFilter:['class']});
    setTimeout(()=>{if(!body.classList.contains('shell-loading'))reveal()},1200);
  }

  revealWhenReady();
})();