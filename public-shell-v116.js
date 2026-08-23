(()=>{
  if(window.__publicShellV116)return;
  window.__publicShellV116=true;

  const PUBLIC_KEYS=new Set(['home','announcements','calendar','uniform','board','resources','gallery']);

  const style=document.createElement('style');
  style.id='publicShellV116Styles';
  style.textContent=`
    /* v116: exact public desktop header + darker homepage */
    @media(min-width:1024px){
      body.guest-shell .public-header{
        position:sticky!important;inset:auto!important;top:0!important;
        width:100%!important;height:78px!important;min-height:78px!important;max-height:78px!important;
        display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;
        gap:18px!important;padding:0 clamp(34px,4vw,62px)!important;
        background:#082944!important;border:0!important;border-bottom:1px solid #284660!important;
        box-shadow:0 4px 14px rgba(0,0,0,.14)!important;overflow:visible!important;z-index:120!important;
        box-sizing:border-box!important;
      }
      body.guest-shell .public-brand{
        display:flex!important;align-items:center!important;gap:12px!important;
        width:auto!important;min-width:292px!important;max-width:292px!important;height:auto!important;
        padding:0!important;margin:0!important;border:0!important;overflow:visible!important;flex:0 0 292px!important;
      }
      body.guest-shell .public-brand .crest{
        width:54px!important;height:54px!important;min-width:54px!important;
        border:3px solid #ffd83d!important;border-radius:11px!important;
        color:#f4f7fb!important;background:transparent!important;font-size:18px!important;font-weight:900!important;
      }
      body.guest-shell .public-brand>div:last-child{opacity:1!important;width:auto!important;overflow:visible!important;white-space:nowrap!important}
      body.guest-shell .public-brand strong{display:block!important;color:#ffd83d!important;font-size:20px!important;line-height:1.05!important;letter-spacing:.03em!important}
      body.guest-shell .public-brand small{display:block!important;color:#d3dee8!important;font-size:9px!important;line-height:1.2!important;letter-spacing:.08em!important;margin-top:5px!important}

      body.guest-shell .public-nav{
        display:flex!important;flex:1 1 auto!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;
        gap:4px!important;margin:0!important;padding:0!important;width:auto!important;max-width:none!important;max-height:none!important;
        overflow:visible!important;min-width:0!important;
      }
      body.guest-shell .public-nav button[data-public]{display:none!important}
      body.guest-shell .public-nav button[data-public="home"],
      body.guest-shell .public-nav button[data-public="announcements"],
      body.guest-shell .public-nav button[data-public="calendar"],
      body.guest-shell .public-nav button[data-public="uniform"],
      body.guest-shell .public-nav button[data-public="board"],
      body.guest-shell .public-nav button[data-public="resources"],
      body.guest-shell .public-nav button[data-public="gallery"]{
        display:inline-flex!important;align-items:center!important;justify-content:center!important;
        width:auto!important;min-width:0!important;min-height:50px!important;padding:10px 13px!important;
        border:0!important;border-radius:10px!important;background:transparent!important;color:#f0f4f8!important;
        font-size:14px!important;font-weight:800!important;line-height:1.15!important;text-align:center!important;white-space:nowrap!important;
        overflow:visible!important;box-shadow:none!important;
      }
      body.guest-shell .public-nav button::before{display:none!important;content:none!important}
      body.guest-shell .public-nav button.active,
      body.guest-shell .public-nav button:hover{background:#235d91!important;color:#fff!important}

      body.guest-shell .public-header>#signInBtn{
        display:flex!important;align-items:center!important;justify-content:center!important;
        width:106px!important;min-width:106px!important;max-width:106px!important;min-height:58px!important;
        margin:0!important;padding:10px 14px!important;border:0!important;border-radius:11px!important;
        background:#ffd83d!important;color:#071528!important;font-size:15px!important;font-weight:900!important;line-height:1.05!important;
        white-space:normal!important;text-align:center!important;flex:0 0 106px!important;
      }
      body.guest-shell .public-header>#signInBtn::before{display:none!important;content:none!important}
      body.guest-shell #adminPortalBtn,
      body.guest-shell .site-rail-toggle,
      body.guest-shell .cadet-dash-wrap{display:none!important}
      body.guest-shell #publicSite,
      body.guest-shell #publicFooter,
      body.guest-shell .site-alert-banner{margin-left:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}

      @media(max-width:1240px){
        body.guest-shell .public-header{padding-left:22px!important;padding-right:22px!important;gap:10px!important}
        body.guest-shell .public-brand{min-width:250px!important;max-width:250px!important;flex-basis:250px!important}
        body.guest-shell .public-brand strong{font-size:17px!important}
        body.guest-shell .public-nav button[data-public]{padding-left:8px!important;padding-right:8px!important;font-size:12px!important}
        body.guest-shell .public-header>#signInBtn{width:90px!important;min-width:90px!important;max-width:90px!important;flex-basis:90px!important;font-size:13px!important}
      }
    }

    /* darker homepage, matching the rest of the site */
    #public-home{background:#07111d!important;color:#e8eef5!important}
    #public-home .gp-home-hero{background:linear-gradient(135deg,#07111d 0%,#111d2a 100%)!important;border-bottom:1px solid #22384b!important}
    #public-home .gp-home-main{background:#07111d!important}
    #public-home .gp-home-stat,
    #public-home .gp-home-panel,
    #public-home .gp-home-announcements>.card,
    #public-home .gp-home-quick button{
      background:#0d2236!important;border-color:#29435f!important;color:#eaf1f7!important;box-shadow:none!important;
    }
    #public-home .gp-home-stat span,
    #public-home .gp-home-section-head p,
    #public-home .gp-home-announcements .card p,
    #public-home .gp-home-announcements .announcement-author,
    #public-home .gp-home-quick span{color:#9eb0c0!important}
    #public-home .gp-home-stat b,
    #public-home .gp-home-section-head h2,
    #public-home .gp-home-announcements .card h3,
    #public-home .gp-home-quick b{color:#f1f5f9!important}
    #public-home .gp-home-link{color:#d9e8f5!important}
    #public-home .gp-home-events .event{border-color:#29435f!important;color:#dce7f0!important}
    #public-home .gp-home-uniform{background:linear-gradient(135deg,#0b1b2b,#132b42)!important;border:1px solid #29435f!important}
    #public-home .gp-home-footer{background:#06101a!important;border-top:1px solid #22384b!important;color:#9eb0c0!important}
  `;
  document.head.appendChild(style);

  function normalizePublicHeader(){
    const header=document.querySelector('.public-header');
    const nav=header?.querySelector('.public-nav');
    const brand=header?.querySelector('.public-brand');
    if(!header||!nav||!brand)return;

    const crest=brand.querySelector('.crest');
    const strong=brand.querySelector('strong');
    const small=brand.querySelector('small');
    if(crest)crest.textContent='803';
    if(strong)strong.textContent='MD-803 AFJROTC';
    if(small)small.textContent='GWYNN PARK HIGH SCHOOL';

    const labels={home:'Dashboard',announcements:'Announcements',calendar:'Calendar',uniform:'Uniform',board:'Message Board',resources:'Resources',gallery:'Gallery'};
    const order=['home','announcements','calendar','uniform','board','resources','gallery'];
    order.forEach(key=>{
      const btn=nav.querySelector(`button[data-public="${key}"]`);
      if(btn){btn.textContent=labels[key];nav.appendChild(btn)}
    });

    nav.querySelectorAll('button[data-public]').forEach(btn=>{
      const key=(btn.dataset.public||'').trim();
      if(document.body.classList.contains('guest-shell')){
        if(PUBLIC_KEYS.has(key)) btn.classList.remove('hidden');
      }
    });

    const sign=document.getElementById('signInBtn');
    if(sign&&document.body.classList.contains('guest-shell'))sign.textContent='Sign In';
  }

  normalizePublicHeader();
  [100,350,800,1400,2500,4000].forEach(ms=>setTimeout(normalizePublicHeader,ms));
  const observer=new MutationObserver(()=>{
    clearTimeout(window.__publicShellV116Timer);
    window.__publicShellV116Timer=setTimeout(normalizePublicHeader,70);
  });
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
})();
