(()=>{
  if(window.__afjrotcOwnerUi)return;
  window.__afjrotcOwnerUi=true;
  const $=id=>document.getElementById(id);
  let owner=null,currentUser=null,profiles=[];

  async function load(){
    const c=window.adminSupabase;
    if(!c){setTimeout(load,80);return}
    try{
      const [{data:rows,error:pe},{data:{user}}]=await Promise.all([
        c.from('profiles').select('id,email,full_name,role,is_owner').order('full_name'),
        c.auth.getUser()
      ]);
      if(pe)throw pe;
      profiles=rows||[];owner=profiles.find(p=>p.is_owner)||null;currentUser=user||null;
      patch();
    }catch(e){console.warn('Owner UI sync failed',e)}
  }

  function ownerRow(){if(!owner)return null;return [...document.querySelectorAll('#cadetRosterBody [data-cadet-id]')].find(r=>r.dataset.cadetId===owner.id)||null}
  function selectedOwner(){if(!owner)return false;const row=document.querySelector('#cadetRosterBody .roster-row.selected');if(row?.dataset.cadetId===owner.id)return true;return [...document.querySelectorAll('#cadetDetailBody [data-edit-cadet]')].some(b=>b.dataset.editCadet===owner.id)}
  function activeRosterTab(){return document.querySelector('.roster-tabs button.active')?.dataset.rosterTab||'roster'}

  function patchAdminIdentity(){
    if(!owner||currentUser?.id!==owner.id)return;
    if($('adminUserRole'))$('adminUserRole').textContent='Owner';
    document.body.dataset.ownerAccount='true';
  }

  function patchCounts(){
    if(!profiles.length)return;
    const cadets=profiles.filter(p=>!p.is_owner&&p.role!=='instructor');
    const command=profiles.filter(p=>!p.is_owner&&p.role==='command_staff');
    if($('statCadets'))$('statCadets').textContent=String(cadets.length);
    if($('cmTotal'))$('cmTotal').textContent=String(cadets.length);
    if($('snapCommand'))$('snapCommand').textContent=String(command.length);
    if($('cmCommand'))$('cmCommand').textContent=String(command.length);
  }

  function patchRoster(){
    const row=ownerRow();if(!row)return;
    const cadetOnly=['flights','service','leadership'].includes(activeRosterTab());
    row.style.display=cadetOnly?'none':'';
    if(!cadetOnly){
      const pill=row.querySelector('.role-pill');if(pill){pill.textContent='Owner';pill.classList.add('owner')}
      const sub=row.querySelector('.cadet-name-cell span');if(sub)sub.textContent='Owner';
    }
    if(cadetOnly&&$('cadetRosterCount')){
      const visible=[...document.querySelectorAll('#cadetRosterBody .roster-row')].filter(r=>r.style.display!=='none').length;
      $('cadetRosterCount').textContent=`Showing ${visible} of ${profiles.filter(p=>!p.is_owner&&p.role!=='instructor').length}`;
    }
  }

  function patchDetail(){
    if(!selectedOwner()||!owner)return;
    $('visibleCadetDeleteAction')?.remove();
    const box=$('cadetDetailBody');if(!box)return;
    if(box.dataset.ownerView==='1')return;
    box.dataset.ownerView='1';
    box.innerHTML=`<div class="detail-top owner-detail-top"><h2>${owner.full_name||'Owner'}</h2><p>Owner</p></div><div class="detail-body"><section class="detail-section owner-only-card"><div class="detail-section-head"><h3>Owner Account</h3><button type="button" data-edit-cadet="${owner.id}">Edit Account</button></div><div class="owner-role-display"><span class="role-pill owner">Owner</span><p>Full access to the Admin Command Center and all site-management features.</p></div></section></div>`;
  }

  function patchEdit(){
    if(!owner)return;
    const id=$('cadetEditId')?.value,isOwner=id===owner.id,role=$('editRole');
    if(role){role.disabled=isOwner;if(isOwner)role.value='command_staff'}
    document.querySelectorAll('#cadetEditForm [data-account-cadet-only],#cadetEditForm [data-cadet-only]').forEach(label=>{if(isOwner)label.classList.add('hidden')});
    let note=$('ownerEditNote');
    if(isOwner&&!note){$('cadetEditStatus')?.insertAdjacentHTML('beforebegin','<div id="ownerEditNote" class="owner-edit-note full">Owner account · full site access. The Owner role is protected and cannot be changed or deleted here.</div>');note=$('ownerEditNote')}
    note?.classList.toggle('hidden',!isOwner);
    if(isOwner)$('visibleCadetDeleteAction')?.remove();
  }

  function clearOwnerDetailFlag(){const box=$('cadetDetailBody');if(box)delete box.dataset.ownerView}
  function patch(){patchAdminIdentity();patchCounts();patchRoster();patchDetail();patchEdit()}

  function addStyle(){
    if($('ownerUiStyle'))return;
    const s=document.createElement('style');s.id='ownerUiStyle';s.textContent=`
      .role-pill.owner{background:rgba(255,214,61,.15)!important;color:#ffd63d!important;border:1px solid rgba(255,214,61,.34)!important}
      .owner-edit-note{border:1px solid rgba(255,214,61,.32);background:rgba(255,214,61,.08);border-radius:9px;padding:10px;color:#ffe685;font-size:11px;line-height:1.45}
      .owner-role-display{display:grid;gap:10px}.owner-role-display p{margin:0;color:#9eacbd;font-size:11px;line-height:1.5}
    `;document.head.appendChild(s);
  }

  document.addEventListener('click',e=>{
    const row=e.target.closest('[data-cadet-id]');if(row&&owner&&row.dataset.cadetId!==owner.id)clearOwnerDetailFlag();
    if(e.target.closest('[data-section="cadets"],[data-cadet-id],[data-edit-cadet],[data-roster-tab]'))setTimeout(patch,130);
    if(e.target.closest('[data-section="command"],[data-section="content"],[data-section="tasks"],[data-task-site-management]'))setTimeout(()=>{patchAdminIdentity();patchCounts()},80);
  },true);
  document.addEventListener('change',e=>{if(e.target?.id==='editRole')setTimeout(patchEdit,0)},true);
  addStyle();load();setTimeout(patch,700);
})();