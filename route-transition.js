(()=>{
  if(window.__afjrotcRouteTransition)return;
  window.__afjrotcRouteTransition=true;

  const body=document.body;
  const style=document.createElement('style');
  style.id='afjrotcRouteTransitionStyles';
  style.textContent=`
    body.standalone-loading,body.route-leaving{overflow:hidden!important;background:#07111d!important}
    body.standalone-loading>*:not(script),body.route-leaving>*:not(script){visibility:hidden!important}
    body.standalone-loading::before,body.route-leaving::before{content:'AFJROTC';position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:#07111d;color:#ffd83d;font:900 22px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;letter-spacing:.08em;visibility:visible!important}
    body.standalone-loading::after,body.route-leaving::after{content:'GWYNN PARK HIGH SCHOOL';position:fixed;left:0;right:0;top:calc(50% + 28px);z-index:2147483647;text-align:center;color:#9fb0c2;font:800 9px/1.2 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;letter-spacing:.14em;visibility:visible!important}
  `;
  document.head.appendChild(style);

  const path=()=>location.pathname.replace(/\/+$/,'')||'/';
  const samePath=url=>url.pathname.replace(/\/+$/,'')===path();
  let leaving=false;

  function navigate(url){
    if(leaving)return;
    leaving=true;
    body.classList.add('route-leaving');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{location.href=url.href}));
  }

  function shellDestination(key){
    const k=({community:'board','my-flight':'flight',dashboard:'home'}[key]||key||'home');
    if(k==='uniform-guide')return new URL('/uniform.html',location.origin);
    if(k==='handbook')return new URL('/handbook.html',location.origin);
    if(k==='ranks')return new URL('/handbook.html#ranks',location.origin);
    if(path()==='/uniform.html'||path()==='/handbook.html')return new URL('/?open='+encodeURIComponent(k),location.origin);
    return null;
  }

  document.addEventListener('click',e=>{
    if(e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const shell=e.target.closest?.('.site-shell-nav [data-shell-page]');
    if(shell){
      const url=shellDestination(shell.dataset.shellPage);
      if(url&&!samePath(url)){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();navigate(url);return;
      }
    }
    const a=e.target.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    let url;try{url=new URL(a.href,location.href)}catch(_){return}
    if(url.origin!==location.origin||samePath(url))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();navigate(url);
  },true);

  if(body.classList.contains('standalone-loading')){
    let dataReady=body.dataset.standaloneDataReady==='1';
    let revealTimer=0;
    const ready=()=>{
      const shellReady=!body.classList.contains('shell-loading')&&(body.classList.contains('account-shell')||body.classList.contains('guest-shell'));
      if(!shellReady||!dataReady)return false;
      clearTimeout(revealTimer);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        body.classList.remove('standalone-loading');
        body.classList.add('standalone-ready');
      }));
      return true;
    };
    window.addEventListener('afjrotc:standalone-data-ready',()=>{dataReady=true;body.dataset.standaloneDataReady='1';ready()});
    const observer=new MutationObserver(()=>{if(ready())observer.disconnect()});
    observer.observe(body,{attributes:true,attributeFilter:['class','data-standalone-data-ready']});
    revealTimer=setTimeout(()=>{dataReady=true;body.dataset.standaloneDataReady='1';ready()},3000);
    ready();
  }
})();