(()=>{
  if(window.__announcementsDarkV125)return;
  window.__announcementsDarkV125=true;
  const s=document.createElement('style');
  s.id='announcementsDarkV125Styles';
  s.textContent=`
    #public-announcements{background:#07111d!important;color:#eaf1f7!important;min-height:100vh!important}
    #public-announcements .ann-page-top{background:linear-gradient(135deg,#07111d,#0b1a2a)!important;border-bottom:1px solid #1d3449!important}
    #public-announcements .ann-main{background:#07111d!important}
    #public-announcements .ann-toolbar{color:#dbe7f0!important}
    #public-announcements .ann-filter{background:#0c1d2f!important;border-color:#29455e!important;color:#dce7f0!important}
    #public-announcements .ann-filter:hover{background:#11263b!important}
    #public-announcements .ann-filter.active{background:#173f63!important;border-color:#24577f!important;color:#fff!important}
    #public-announcements .ann-search{background:#091a2a!important;border-color:#29455e!important;color:#eaf1f7!important}
    #public-announcements .ann-search::placeholder{color:#7f94a7!important}
    #public-announcements .ann-featured{background:linear-gradient(135deg,#0b1c2e,#10263a)!important;border:1px solid #27435b!important;box-shadow:0 12px 28px rgba(0,0,0,.18)!important}
    #public-announcements .ann-post,#public-announcements .ann-side-card,#public-announcements .ann-empty{background:#0b1c2e!important;border-color:#29455e!important;color:#e9f0f6!important;box-shadow:0 10px 24px rgba(0,0,0,.16)!important}
    #public-announcements .ann-post h3,#public-announcements .ann-side-card h3{color:#f3f7fb!important}
    #public-announcements .ann-preview,#public-announcements .ann-full,#public-announcements .ann-side-card p{color:#afbdca!important}
    #public-announcements .ann-meta,#public-announcements .ann-comment-count,#public-announcements .ann-signin-note,#public-announcements .ann-locked{color:#8598aa!important}
    #public-announcements .ann-tag{background:#17314a!important;color:#cfe6fb!important;border:1px solid #2a4d6a!important}
    #public-announcements .ann-featured .ann-tag{background:#173f63!important;color:#fff!important;border-color:#2d648e!important}
    #public-announcements .ann-post-actions,#public-announcements .ann-thread{border-color:#223a50!important}
    #public-announcements .ann-category-row{border-color:#223a50!important;color:#c4d1dc!important}
    #public-announcements .ann-text-btn{color:#7fc2f4!important}
    #public-announcements .ann-comment{border-color:#223a50!important}
    #public-announcements .ann-comment-body b{color:#f1f5f9!important}
    #public-announcements .ann-comment-body p{color:#b5c2ce!important}
    #public-announcements .ann-comment-form input{background:#091a2a!important;border-color:#29455e!important;color:#eef4f8!important}
    #public-announcements .ann-admin-note{background:#10243a!important;border-color:#2b4c67!important;color:#d9e7f3!important}
    #public-announcements .ann-admin-actions button{background:#0b1c2e!important;border-color:#31516a!important;color:#dce8f1!important}
  `;
  document.head.appendChild(s);
})();