(()=>{
  function apply(){
    if(document.getElementById('homeContrastFixStyles')) return;
    const s=document.createElement('style');
    s.id='homeContrastFixStyles';
    s.textContent=`
      /* Keep light homepage sections readable even when later theme rules load. */
      #public-home .gp-home-main > .gp-home-section > .gp-home-section-head h2,
      #public-home .gp-home-main > .gp-home-section > .gp-home-section-head p,
      #public-home .gp-home-announcements > .card h3,
      #public-home .gp-home-announcements > .card p,
      #public-home .gp-home-announcements > .card .announcement-author {
        color:#0b1f35!important;
        opacity:1!important;
        text-shadow:none!important;
      }
      #public-home .gp-home-main > .gp-home-section > .gp-home-section-head p,
      #public-home .gp-home-announcements > .card p,
      #public-home .gp-home-announcements > .card .announcement-author {
        color:#455a70!important;
      }
      #public-home .gp-home-announcements > .card {
        background:#fff!important;
        color:#0b1f35!important;
      }
      #public-home .gp-home-main > .gp-home-section > .gp-home-section-head .gp-home-link {
        background:#0b2947!important;
        color:#fff!important;
        border-radius:8px!important;
        padding:9px 13px!important;
      }

      /* Quick Links use navy cards, so force high-contrast light text. */
      #public-home .gp-home-quick button {
        background:linear-gradient(135deg,#102b46,#123652)!important;
        border:1px solid #294a66!important;
        color:#fff!important;
        opacity:1!important;
        text-shadow:none!important;
      }
      #public-home .gp-home-quick button b {
        color:#fff!important;
        opacity:1!important;
        text-shadow:none!important;
      }
      #public-home .gp-home-quick button span {
        color:#d7e3ee!important;
        opacity:1!important;
        text-shadow:none!important;
      }
      #public-home .gp-home-quick button:hover,
      #public-home .gp-home-quick button:focus-visible {
        background:linear-gradient(135deg,#153858,#17466b)!important;
        border-color:#3b6281!important;
      }

      /* Preserve white text inside navy cards. */
      #public-home .gp-home-panel,
      #public-home .gp-home-panel h2,
      #public-home .gp-home-panel h3,
      #public-home .gp-home-panel p,
      #public-home .gp-home-uniform,
      #public-home .gp-home-uniform h3,
      #public-home .gp-home-uniform p,
      #public-home .gp-home-uniform small {
        color:#f7fbff!important;
      }
    `;
    document.head.appendChild(s);
  }
  apply();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  setTimeout(apply,1200);
})();
