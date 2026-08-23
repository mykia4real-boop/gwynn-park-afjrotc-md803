(()=>{
  if(window.__signedInTopDashV113)return;
  window.__signedInTopDashV113=true;

  const PUBLIC_KEYS=new Set(['home','announcements','calendar','board','community','uniform','handbook','resources','gallery']);
  const LABELS={
    'cadet-dashboard':'Cadet Dashboard',
    service:'Service Hours',
    flight:'My Flight',
    settings:'Settings',
    'site-settings':'Settings',
    'drill-quiz':'30 Command Drill Quiz',
    groups:'My Groups',
    ranks:'Ranks'
  };

  const style=document.createElement('style');
  style.id='signedInTopDashV113Styles';
  style.textContent=`
    @media(min-width:1024px){
      body.account-shell{--account-panel-width:0px!important}
      body.account-shell .public-header{
        position:sticky!important;inset:auto!important;top:0!important;
        width:100%!important;height:78px!important;min-height:78px!important;max-height:78px!important;
        display:flex!important;flex-direction:row!important;align-items:center!important;
        gap:16px!important;padding:0 clamp(24px,3.2vw,54px)!important;
        background:linear-gradient(90deg,#062642,#0a3154)!important;
        border:0!important;border-bottom:1px solid rgba(160,194,222,.25)!important;
        box-shadow:0 8px 24px rgba(0,0,0,.10)!important;overflow:visible!important;z-index:90!important;
      }
      body.account-shell .public-brand{
        display:flex!important;align-items:center!important;gap:10px!important;
        width:auto!important;min-width:245px!important;height:auto!important;padding:0!important;margin:0!important;
        border:0!important;overflow:visible!important;flex:0 0 auto!important;
      }
      body.account-shell .public-brand .crest{width:46px!important;height:46px!important;min-width:46px!important;border-width:3px!important}
      body.account-shell .public-brand>div:last-child{opacity:1!important;width:auto!important;overflow:visible!important;white-space:nowrap!important}
      body.account-shell .public-brand strong{font-size:18px!important}
      body.account-shell .public-brand small{font-size:9px!important}
      body.account-shell .public-nav{
        display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-end!important;
        gap:3px!important;margin:0 0 0 auto!important;width:auto!important;max-height:none!important;overflow:visible!important;flex:0 1 auto!important;
      }
      body.account-shell .public-nav button{
        display:none!important;width:auto!important;min-height:40px!important;padding:9px 10px!important;border-radius:9px!important;
        font-size:12px!important;text-align:center!important;white-space:nowrap!important;overflow:visible!important;background:transparent!important;color:#edf5fb!important;
      }
      body.account-shell .public-nav button[data-top-public="1"]{display:inline-flex!important;align-items:center!important;justify-content:center!important}
      body.account-shell .public-nav button::before{display:none!important;content:none!important}
      body.account-shell .public-nav button.active,body.account-shell .public-nav button:hover{background:#235d91!important;color:#fff!important}
      body.account-shell .site-rail-toggle{display:none!important}
      body.account-shell #publicSite,body.account-shell #publicFooter,body.account-shell .site-alert-banner{margin-left:0!important;width:auto!important}
      body.account-shell .site-alert-banner{top:78px!important}
      body.account-shell .public-page{padding-top:30px!important}

      body.account-shell .cadet-dash-wrap{position:relative!important;display:block!important;flex:0 0 auto!important;margin-left:2px!important}
      body.account-shell .cadet-dash-trigger{
        min-height:42px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:10px!important;
        padding:10px 14px!important;background:#ffd83d!important;color:#071528!important;font-size:12px!important;font-weight:900!important;
        cursor:pointer!important;white-space:nowrap!important;box-shadow:none!important;
      }
      body.account-shell .cadet-dash-trigger::after{content:'⌄';margin-left:8px;font-size:12px}
      body.account-shell .cadet-dash-wrap.open .cadet-dash-trigger::after{content:'⌃'}
      body.account-shell .cadet-dash-menu{
        display:none;position:absolute;right:0;top:calc(100% + 10px);width:272px;padding:10px;
        border:1px solid #29435f;border-radius:14px;background:#071b2d;box-shadow:0 18px 45px rgba(0,0,0,.28);z-index:120;
      }
      body.account-shell .cadet-dash-wrap.open .cadet-dash-menu{display:grid;gap:5px}
      body.account-shell .cadet-dash-menu .dash-menu-title{padding:6px 8px 8px;color:#93abc0;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      body.account-shell .cadet-dash-menu button{
        width:100%;min-height:42px;border:0;border-radius:10px;padding:10px 12px;background:transparent;color:#edf5fb;
        font-size:13px;font-weight:800;text-align:left;cursor:pointer;
      }
      body.account-shell .cadet-dash-menu button:hover{background:#173f6b}
      body.account-shell .cadet-dash-menu .admin-link{margin-top:5px;border-top:1px solid rgba(255,255,255,.12);border-radius:0;padding-top:13px;color:#ffd83d}
      body.account-shell #signInBtn{display:none!important}

      @media(max-width:1280px){
        body.account-shell .public-header{padding-left:20px!important;padding-right:20px!important;gap:10px!important}
        body.account-shell .public-brand{min-width:205px!important}
        body.account-shell .public-brand strong{font-size:16px!important}
        body.account-shell .public-nav button[data-top-public="1"]{padding-left:7px!important;padding-right:7px!important;font-size:11px!important}
      }
      @media(max-width:1120px){
        body.account-shell .public-nav button[data-public="gallery"],
        body.account-shell .public-nav button[data-public="resources"]{display:none!important}
      }
    }
  `;
  document.head.appendChild(style);

  function keyOf(btn){return (btn.dataset.public||'').trim().toLowerCase()}
  function labelOf(btn){const k=keyOf(btn);return LABELS[k]||(btn.textContent||'Open').trim()}

  function setup(){
    const header=document.querySelector('.public-header');
    const nav=header?.querySelector('.public-nav');
    if(!header||!nav)return;

    nav.querySelectorAll('button[data-public]').forEach(btn=>{
      const k=keyOf(btn);
      const text=(btn.textContent||'').toLowerCase();
      const isPublic=PUBLIC_KEYS.has(k)||text.includes('handbook')||text.includes('community');
      btn.dataset.topPublic=isPublic?'1':'0';
    });

    let wrap=header.querySelector('.cadet-dash-wrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='cadet-dash-wrap';
      wrap.innerHTML='<button type="button" class="cadet-dash-trigger" aria-expanded="false">Open Dashboard</button><div class="cadet-dash-menu" role="menu"><div class="dash-menu-title">Cadet Tools</div></div>';
      const sign=document.getElementById('signInBtn');
      header.insertBefore(wrap,sign||null);

      wrap.querySelector('.cadet-dash-trigger').addEventListener('click',e=>{
        e.stopPropagation();
        const open=wrap.classList.toggle('open');
        e.currentTarget.setAttribute('aria-expanded',open?'true':'false');
      });
      document.addEventListener('click',e=>{if(!wrap.contains(e.target)){wrap.classList.remove('open');wrap.querySelector('.cadet-dash-trigger')?.setAttribute('aria-expanded','false')}});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'){wrap.classList.remove('open');wrap.querySelector('.cadet-dash-trigger')?.setAttribute('aria-expanded','false')}});
    }

    const menu=wrap.querySelector('.cadet-dash-menu');
    if(!menu)return;
    menu.querySelectorAll('button').forEach(b=>b.remove());

    const extras=[...nav.querySelectorAll('button[data-public]')].filter(btn=>btn.dataset.topPublic!=='1'&&!btn.classList.contains('hidden'));
    extras.forEach(original=>{
      const clone=document.createElement('button');
      clone.type='button';
      clone.textContent=labelOf(original);
      clone.dataset.forPublic=keyOf(original);
      clone.addEventListener('click',()=>{original.click();wrap.classList.remove('open');wrap.querySelector('.cadet-dash-trigger')?.setAttribute('aria-expanded','false')});
      menu.appendChild(clone);
    });

    const admin=document.getElementById('adminPortalBtn');
    if(admin&&!admin.classList.contains('hidden')&&getComputedStyle(admin).display!=='none'){
      const b=document.createElement('button');
      b.type='button';b.className='admin-link';b.textContent='Admin Dashboard';
      b.addEventListener('click',()=>{admin.click();wrap.classList.remove('open')});
      menu.appendChild(b);
    }

    const signedIn=document.body.classList.contains('account-shell');
    wrap.style.display=signedIn?'block':'none';
  }

  setup();
  [150,500,1000,1800,3000].forEach(ms=>setTimeout(setup,ms));
  const obs=new MutationObserver(()=>{clearTimeout(window.__topDashTimer);window.__topDashTimer=setTimeout(setup,80)});
  obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
})();
