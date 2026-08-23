(()=>{
  if(document.getElementById('uniformGuideContrastV126'))return;
  const s=document.createElement('style');
  s.id='uniformGuideContrastV126';
  s.textContent=`
    .guide-head h1{color:#f7fbff!important}
    .guide-head p{color:#b7c7d8!important}
    .guide-intro{background:#f8fafc!important;border-color:#d8e2ec!important}
    .guide-intro p{color:#334155!important}
    .guide-intro b{color:#071d38!important}
    .guide-tabs a{background:#f8fafc!important;color:#071d38!important;border-color:#d8e2ec!important}
    .uniform-section{background:#f8fafc!important;color:#071d38!important;border-color:#d8e2ec!important}
    .section-head h2{color:#071d38!important}
    .section-head span{color:#64748b!important}
    .detail,.pt-card,.rank-strip div{background:#f4f7fa!important;border-color:#d8e2ec!important;color:#071d38!important}
    .detail b,.pt-card h3,.rank-strip div{color:#071d38!important}
    .detail p,.pt-card p{color:#52657a!important}
    .figure-caption{background:#f8fafc!important;color:#52657a!important}
    .note{background:#fff4c7!important;color:#5e4a00!important;border-color:#e7cb58!important}
  `;
  document.head.appendChild(s);
})();