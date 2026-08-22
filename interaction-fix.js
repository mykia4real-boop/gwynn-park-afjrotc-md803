(()=>{
  if(window.__interactionFixV72)return;window.__interactionFixV72=true;
  const ADMIN_ROLES=['command_staff','instructor'];
  const canAdmin=()=>!!window.currentProfile&&ADMIN_ROLES.includes(window.currentProfile.role);

  function addStyles(){
    if(document.getElementById('interactionFixV72Styles'))return;
    const s=document.createElement('style');s.id='interactionFixV72Styles';s.textContent=`
      #adminPortalBtn{position:relative!important;z-index:100001!important;pointer-events:auto!important;cursor:pointer!important}
      #pv2Edit,#profileEditProgress{position:relative!important;z-index:20!important;pointer-events:auto!important;cursor:pointer!important}
      #public-cadet-dashboard .pv2-form,#public-cadet-dashboard .profile-form-wrap{position:relative;z-index:5}
    `;document.head.appendChild(s);
  }

  function syncAdminButton(){
    const btn=document.getElementById('adminPortalBtn');
    if(!btn)return;
    btn.style.pointerEvents='auto';
    btn.style.cursor='pointer';
    if(canAdmin())btn.classList.remove('hidden');
  }

  document.addEventListener('click',e=>{
    const admin=e.target.closest?.('#adminPortalBtn');
    if(admin){e.preventDefault();e.stopPropagation();window.location.assign('/admin.html');return;}

    const edit=e.target.closest?.('#pv2Edit,#profileEditProgress');
    if(edit){
      e.preventDefault();e.stopPropagation();
      const form=document.getElementById('pv2Form')||document.getElementById('profileProgressForm');
      if(form){form.classList.add('open');form.scrollIntoView({behavior:'smooth',block:'start'});const first=form.querySelector('input,textarea,select');if(first)setTimeout(()=>first.focus(),250);}
      return;
    }

    const cancel=e.target.closest?.('#pv2Cancel,#profileCancelEdit');
    if(cancel){
      e.preventDefault();e.stopPropagation();
      const form=document.getElementById('pv2Form')||document.getElementById('profileProgressForm');
      form?.classList.remove('open');
      document.getElementById('pv2Edit')?.scrollIntoView({behavior:'smooth',block:'center'});
    }
  },true);

  addStyles();syncAdminButton();
  const observer=new MutationObserver(()=>syncAdminButton());
  observer.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('pageshow',syncAdminButton);
  window.addEventListener('resize',syncAdminButton,{passive:true});
})();