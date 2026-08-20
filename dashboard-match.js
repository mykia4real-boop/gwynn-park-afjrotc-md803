(()=>{
  if(document.getElementById('dashboardMatchStyles'))return;
  const s=document.createElement('style');
  s.id='dashboardMatchStyles';
  s.textContent=`
    #public-home,#admin-dashboard{font-weight:650}
    #public-home h1,#public-home h2,#public-home h3,#public-home b,#public-home strong,#public-home button,#public-home .public-panel-title,#admin-dashboard h1,#admin-dashboard h2,#admin-dashboard h3,#admin-dashboard b,#admin-dashboard strong,#admin-dashboard button,#admin-dashboard .panel-title{font-weight:850!important}
    #public-home p,#public-home small,#public-home span,#admin-dashboard p,#admin-dashboard small,#admin-dashboard span,#admin-dashboard label{font-weight:650}
    #adminPortalBtn,#backToSite,.admin-side .back-btn{background:#ffd83d!important;color:#071528!important;border-color:#ffd83d!important;font-weight:850!important;box-shadow:none!important}
    #adminPortalBtn:hover,#backToSite:hover,.admin-side .back-btn:hover{filter:brightness(.97)}
  `;
  document.head.appendChild(s);
})();