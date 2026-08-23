(()=>{
  if(document.getElementById('desktopLayoutV112Styles')) return;

  const style=document.createElement('style');
  style.id='desktopLayoutV112Styles';
  style.textContent=`
    /* v112 — desktop guest header / overflow cleanup */
    html,body{max-width:100%;overflow-x:hidden}
    #publicSite,#publicFooter{max-width:100%;box-sizing:border-box}

    @media (min-width:1024px){
      body.guest-shell .public-header{
        position:sticky!important;
        top:0!important;
        left:0!important;
        right:0!important;
        width:100%!important;
        max-width:100vw!important;
        height:auto!important;
        min-height:0!important;
        max-height:none!important;
        box-sizing:border-box!important;
        display:flex!important;
        flex-wrap:wrap!important;
        align-items:center!important;
        gap:0 16px!important;
        padding:13px clamp(20px,3vw,54px) 11px!important;
        overflow:visible!important;
      }

      body.guest-shell .public-brand{
        order:1!important;
        flex:0 1 auto!important;
        width:auto!important;
        min-width:245px!important;
        max-width:420px!important;
        margin:0!important;
      }

      body.guest-shell .public-header>#signInBtn{
        order:2!important;
        flex:0 0 auto!important;
        margin:0 0 0 auto!important;
        white-space:nowrap!important;
      }

      body.guest-shell .public-nav{
        order:3!important;
        flex:0 0 100%!important;
        width:100%!important;
        max-width:100%!important;
        margin:11px 0 0!important;
        padding:8px 0 0!important;
        border-top:1px solid rgba(255,255,255,.12)!important;
        display:grid!important;
        grid-template-columns:repeat(6,minmax(0,1fr))!important;
        gap:5px!important;
        overflow:visible!important;
      }

      body.guest-shell .public-nav button{
        width:100%!important;
        min-width:0!important;
        min-height:38px!important;
        padding:8px 7px!important;
        border-radius:8px!important;
        font-size:12px!important;
        line-height:1.15!important;
        white-space:normal!important;
        overflow-wrap:anywhere!important;
        text-align:center!important;
      }

      body.guest-shell #publicSite,
      body.guest-shell #publicFooter,
      body.guest-shell .site-alert-banner{
        width:100%!important;
        max-width:100%!important;
        margin-left:0!important;
        box-sizing:border-box!important;
      }

      body.guest-shell .public-page{
        width:100%!important;
        max-width:100%!important;
        box-sizing:border-box!important;
      }

      body.guest-shell .site-alert-banner{top:0!important}
    }

    @media (min-width:1400px){
      body.guest-shell .public-nav{
        grid-template-columns:repeat(12,minmax(0,1fr))!important;
        gap:4px!important;
      }
      body.guest-shell .public-nav button{
        font-size:11px!important;
        padding:8px 4px!important;
      }
    }

    @media (min-width:1720px){
      body.guest-shell .public-header{
        flex-wrap:nowrap!important;
        gap:18px!important;
        padding-top:0!important;
        padding-bottom:0!important;
        min-height:82px!important;
      }
      body.guest-shell .public-brand{flex:0 0 auto!important}
      body.guest-shell .public-nav{
        order:2!important;
        flex:1 1 auto!important;
        width:auto!important;
        margin:0 0 0 auto!important;
        padding:0!important;
        border-top:0!important;
        display:flex!important;
        justify-content:flex-end!important;
        gap:3px!important;
      }
      body.guest-shell .public-nav button{
        width:auto!important;
        min-height:42px!important;
        padding:9px 8px!important;
        font-size:11px!important;
        white-space:nowrap!important;
      }
      body.guest-shell .public-header>#signInBtn{
        order:3!important;
        margin-left:4px!important;
      }
    }
  `;
  document.head.appendChild(style);
})();
