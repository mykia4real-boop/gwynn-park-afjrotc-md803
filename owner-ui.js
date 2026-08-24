(()=>{
  if(window.__afjrotcOwnerUi)return;
  window.__afjrotcOwnerUi=true;
  const $=id=>document.getElementById(id);
  let owner=null,currentUser=null;

  async function load(){
    const c=window.adminSupabase;
    if(!c){setTimeout(load,80);return}
    try{
      const [{data:o,error:oe},{data:{user}}]=await Promise.all([
        c.from('profiles').select('id,email,full_name,role,is_owner').eq('is_owner',true).maybeSingle(),
        c.auth.getUser()
      ]);
      if(oe)throw oe;
      owner=o||null;currentUser=user||null;
      patch();
    }catch(e){console.warn('Owner UI sync failed',e)}
  }

  function ownerRow(){
    if(!owner)return null;
    return [...document.querySelectorAll('#cadetRosterBody [data-cadet-id]')].find(r=>r.dataset.cadetId===owner.id)||null;
  }

  function selectedOwner(){
    if(!owner)return false;
    const row=document.querySelector('#cadetRosterBody .roster-row.selected');
    if(row?.dataset.cadetId===owner.id)return true;
    return [...document.querySelectorAll('#cadetDetailBody [data-edit-cadet]')].some(b=>b.dataset.editCadet===owner.id);
  }

  function patchAdminIdentity(){
    if(!owner||currentUser?.id!==owner.id)return;
    if($('adminUserRole'))$('adminUserRole').textContent='Owner';
    document.body.dataset.ownerAccount='true';
  }

  function patchRoster(){
    const row=ownerRow();if(!row)return;
    const pill=row.querySelector('.role-pill');
    if(pill){pill.textContent='Owner';pill.classList.add('owner')}
    const sub=row.querySelector('.cadet-name-cell span');if(sub)sub.textContent='Owner';
  }

  function patchDetail(){
    if(!selectedOwner())return;
    $('visibleCadetDeleteAction')?.remove();
    const top=$('cadetDetailBody')?.querySelector('.detail-top p');if(top)top.textContent='Owner';
    $ ('cadetDetailBody')?.querySelectorAll('.role-pill').forEach(p=>{p.textContent='Owner';p.classList.add('owner')});
  }

  function patchEdit(){
    if(!owner)return;
    const id=$('cadetEditId')?.value;
    const isOwner=id===owner.id;
    const role=$('editRole');
    if(role){role.disabled=isOwner;if(isOwner)role.value='command_staff'}
    let note=$('ownerEditNote');
    if(isOwner&&!note){
      const status=$('cadetEditStatus');
      status?.insertAdjacentHTML('beforebegin','<div id="ownerEditNote" class="owner-edit-note full">Owner account · full site access. The Owner role is protected and cannot be changed or deleted here.</div>');
      note=$('ownerEditNote');
    }
    note?.classList.toggle('hidden',!isOwner);
    if(isOwner)$('visibleCadetDeleteAction')?.remove();
  }

  function patch(){patchAdminIdentity();patchRoster();patchDetail();patchEdit()}

  function addStyle(){
    if($('ownerUiStyle'))return;
    const s=document.createElement('style');s.id='ownerUiStyle';s.textContent=`
      .role-pill.owner{background:rgba(255,214,61,.15)!important;color:#ffd63d!important;border:1px solid rgba(255,214,61,.34)!important}
      .owner-edit-note{border:1px solid rgba(255,214,61,.32);background:rgba(255,214,61,.08);border-radius:9px;padding:10px;color:#ffe685;font-size:11px;line-height:1.45}
    `;document.head.appendChild(s);
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-section="cadets"],[data-cadet-id],[data-edit-cadet]'))setTimeout(patch,140);
    if(e.target.closest('[data-section="command"],[data-section="content"],[data-section="tasks"],[data-task-site-management]'))setTimeout(patchAdminIdentity,80);
  },true);
  document.addEventListener('change',e=>{if(e.target?.id==='editRole')setTimeout(patchEdit,0)},true);
  addStyle();load();setTimeout(patch,700);
})();