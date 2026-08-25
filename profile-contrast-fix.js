(()=>{
  if(document.getElementById('profileContrastFixStyles'))return;
  const s=document.createElement('style');
  s.id='profileContrastFixStyles';
  s.textContent=`
    #public-cadet-dashboard .profile-stat-strip,
    #public-cadet-dashboard .profile-card{
      color:#0b1f35!important;
    }
    #public-cadet-dashboard .profile-stat span{
      color:#415269!important;
      opacity:1!important;
      text-shadow:none!important;
    }
    #public-cadet-dashboard .profile-stat b,
    #public-cadet-dashboard .profile-card h3,
    #public-cadet-dashboard .profile-card .big,
    #public-cadet-dashboard .event-mini b{
      color:#071b36!important;
      opacity:1!important;
      text-shadow:none!important;
    }
    #public-cadet-dashboard .goal-line-head,
    #public-cadet-dashboard .profile-empty,
    #public-cadet-dashboard .event-mini small,
    #public-cadet-dashboard .profile-note{
      color:#34465a!important;
      opacity:1!important;
      text-shadow:none!important;
    }
    #public-cadet-dashboard .profile-stat-strip{
      background:#fff!important;
    }
    #public-cadet-dashboard .profile-card{
      background:#fff!important;
    }
    #public-cadet-dashboard .text-btn{
      color:#123f73!important;
      opacity:1!important;
    }
  `;
  document.head.appendChild(s);
})();
