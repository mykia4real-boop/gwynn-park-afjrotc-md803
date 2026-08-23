(()=>{
  if(window.__signedInTopDashV114)return;
  window.__signedInTopDashV114=true;

  const PUBLIC_KEYS=new Set(['home','announcements','calendar','board','community','uniform','handbook','resources','gallery']);
  const LABELS={
    'cadet-dashboard':'Cadet Dashboard',service:'Service Hours',flight:'My Flight',settings:'Settings','site-settings':'Settings',
    'drill-quiz':'30 Command Drill Quiz',groups:'My Groups',ranks:'Ranks'
  };
  let authSignedIn=false;

  const style=document.createElement('style');
  style.id='signedInTopDashV114Styles';
  style.textContent=`
    @media(min-width:900px){
      body.cadet-topdash{--account-panel-width:0px!important}
      body.cadet-topdash .public-header{position:sticky!important;inset:auto!important;top:0!important;width:100%!important;height:78px!important;min-height:78px!important;max-height:78px!important;display:flex!important;flex-direction:row!important;align-items:center!important;gap:12px!important;padding:0 clamp(18px,3vw,48px)!important;background:linear-gradient(90deg,#062642,#0a3154)!important;border:0!important;border-bottom:1px solid rgba(160,194,222,.25)!important;box-shadow:0 8px 24px rgba(0,0,0,.10)!important;overflow:visible!important;z-index:90!important}
      body.cadet-topdash .public-brand{display:flex!important;align-items:center!important;gap:10px!important;width:auto!important;min-width:205px!important;height:auto!important;padding:0!important;margin:0!important;border:0!important;overflow:visible!important;flex:0 0 auto!important}
      body.cadet-topdash .public-brand .crest{width:46px!important;height:46px!important;min-width:46px!important;border-width:3px!important}
      body.cadet-topdash .public-brand>div:last-child{opacity:1!important;width:auto!important;overflow:visible!important;white-space:nowrap!important}
      body.cadet-topdash .public-brand strong{font-size:17px!important} body.cadet-topdash .public-brand small{font-size:9px!important}
      body.cadet-topdash .public-nav{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-end!important;gap:2px!important;margin:0 0 0 auto!important;width:auto!important;max-height:none!important;overflow:visible!important;flex:0 1 auto!important}
      body.cadet-topdash .public-nav button{display:none!important;width:auto!important;min-height:40px!important;padding:9px 8px!important;border-radius:9px!important;font-size:11px!important;text-align:center!important;white-space:nowrap!important;overflow:visible!important;background:transparent!important;color:#edf5fb!important}
      body.cadet-topdash .public-nav button[data-top-public="1"]{display:inline-flex!important;align-items:center!important;justify-content:center!important}
      body.cadet-topdash .public-nav button::before{display:none!important;content:none!important}
      body.cadet-topdash .public-nav button.active,body.cadet-topdash .public-nav button:hover{background:#235d91!important;color:#fff!important}
      body.cadet-topdash .site-rail-toggle{display:none!important}
      body.cadet-topdash #publicSite,body.cadet-topdash #publicFooter,body.cadet-topdash .site-alert-banner{margin-left:0!important;width:auto!important}
      body.cadet-topdash .site-alert-banner{top:78px!important}
      body.cadet-topdash .cadet-dash-wrap{position:relative!important;display:block!important;flex:0 0 auto!important;margin-left:4px!important}
      body.cadet-topdash .cadet-dash-trigger{min-height:42px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:10px!important;padding:10px 14px!important;background:#ffd83d!important;color:#071528!important;font-size:12px!important;font-weight:900!important;cursor:pointer!important;white-space:nowrap!important}
      body.cadet-topdash .cadet-dash-trigger::after{content:'⌄';margin-left:8px}.cadet-dash-wrap.open .cadet-dash-trigger::after{content:'⌃'}
      body.cadet-topdash .cadet-dash-menu{display:none;position:absolute;right:0;top:calc(100% + 10px);width:280px;padding:10px;border:1px solid #29435f;border-radius:14px;background:#071b2d;box-shadow:0 18px 45px rgba(0,0,0,.28);z-index:120}
      body.cadet-topdash .cadet-dash-wrap.open .cadet-dash-menu{display:grid;gap:5px}
      body.cadet-topdash .cadet-dash-menu .dash-menu-title{padding:6px 8px 8px;color:#93abc0;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      body.cadet-topdash .cadet-dash-menu button{width:100%;min-height:42px;border:0;border-radius:10px;padding:10px 12px;background:transparent;color:#edf5fb;font-size:13px;font-weight:800;text-align:left;cursor:pointer}
      body.cadet-topdash .cadet-dash-menu button:hover{background:#173f6b}.cadet-dash-menu .admin-link{margin-top:5px;border-top:1px solid rgba(255,255,255,.12)!important;border-radius:0!important;padding-top:13px!important;color:#ffd83d!important}
      body.cadet-topdash #signInBtn{display:none!important}
      @media(max-width:1180px){body.cadet-topdash .public-nav button[data-public="gallery"],body.cadet-topdash .public-nav button[data-public="resources"],body.cadet-topdash .public-nav button[data-public="handbook"]{display:none!important}}
      @media(max-width:1030px){body.cadet-topdash .public-nav button[data-public="uniform"],body.cadet-topdash .public-nav button[data-public="board"],body.cadet-topdash .public-nav button[data-public="community"]{display:none!important}}
    }
  `;
  document.head.appendChild(style);

  const keyOf=btn=>(btn.dataset.public||'').trim().toLowerCase();
  const labelOf=btn=>LABELS[keyOf(btn)]||(btn.textContent||'Open').trim();

  function setup(){
    const header=document.querySelector('.public-header'); const nav=header?.querySelector('.public-nav');
    if(!header||!nav)return;
    document.body.classList.toggle('cadet-topdash',authSignedIn);

    nav.querySelectorAll('button[data-public]').forEach(btn=>{const k=keyOf(btn);const text=(btn.textContent||'').toLowerCase();btn.dataset.topPublic=(PUBLIC_KEYS.has(k)||text.includes('handbook')||text.includes('community'))?'1':'0'});

    let wrap=header.querySelector('.cadet-dash-wrap');
    if(!wrap){
      wrap=document.createElement('div'); wrap.className='cadet-dash-wrap';
      wrap.innerHTML='<button type="button" class="cadet-dash-trigger" aria-expanded="false">Open Dashboard</button><div class="cadet-dash-menu" role="menu"><div class="dash-menu-title">Cadet Tools</div></div>';
      header.insertBefore(wrap,document.getElementById('signInBtn')||null);
      wrap.querySelector('.cadet-dash-trigger').addEventListener('click',e=>{e.stopPropagation();const open=wrap.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open?'true':'false')});
      document.addEventListener('click',e=>{if(!wrap.contains(e.target)){wrap.classList.remove('open');wrap.querySelector('.cadet-dash-trigger')?.setAttribute('aria-expanded','false')}});
    }
    wrap.style.display=authSignedIn?'block':'none';
    if(!authSignedIn)return;

    const menu=wrap.querySelector('.cadet-dash-menu'); menu.querySelectorAll('button').forEach(b=>b.remove());
    [...nav.querySelectorAll('button[data-public]')].filter(btn=>btn.dataset.topPublic!=='1'&&!btn.classList.contains('hidden')).forEach(original=>{
      const clone=document.createElement('button');clone.type='button';clone.textContent=labelOf(original);clone.addEventListener('click',()=>{original.click();wrap.classList.remove('open')});menu.appendChild(clone);
    });
    const admin=document.getElementById('adminPortalBtn');
    if(admin&&!admin.classList.contains('hidden')){const b=document.createElement('button');b.type='button';b.className='admin-link';b.textContent='Admin Dashboard';b.addEventListener('click',()=>admin.click());menu.appendChild(b)}
  }

  async function syncAuth(){
    try{
      if(typeof sb==='undefined')return;
      const {data}=await sb.auth.getSession(); authSignedIn=!!data?.session?.user; setup();
      sb.auth.onAuthStateChange((_e,session)=>{authSignedIn=!!session?.user;setTimeout(setup,0)});
    }catch(e){console.warn('Top dash auth sync failed',e)}
  }

  setup(); syncAuth(); [250,700,1500,3000].forEach(ms=>setTimeout(()=>{syncAuth();setup()},ms));
})();