(()=>{
  if(window.__cadetAccountActionsV2)return;
  window.__cadetAccountActionsV2=true;
  const $=id=>document.getElementById(id);
  let selectedAccount=null;

  async function getFunctionError(error,fallback){
    try{if(error?.context?.json){const body=await error.context.json();if(body?.error)return body.error}}catch(_e){}
    return error?.message||fallback;
  }

  function removeDuplicateDeleteButtons(){
    document.querySelectorAll('#cadetEditModal #deleteCadetAccountBtn,#cadetEditModal .account-delete-btn').forEach(x=>x.remove());
  }

  function ensureLoginEmailField(){
    const form=$('cadetEditForm');if(!form)return;
    const title=document.querySelector('#cadetEditModal .cadet-modal-head h2');if(title)title.textContent='Edit Account';
    let email=$('editEmail');
    if(!email){
      const name=$('editName')?.closest('label');
      name?.insertAdjacentHTML('afterend','<label class="full account-login-email">Login Email<input id="editEmail" type="email" required autocomplete="off"></label>');
      email=$('editEmail');
    }
    ['editRank','editFlight','editPosition','editParentEmail','editParentPhone'].forEach(id=>$(id)?.closest('label')?.setAttribute('data-account-cadet-only','1'));
    if(!$('accountInstructorNote')){
      $('cadetEditStatus')?.insertAdjacentHTML('beforebegin','<div id="accountInstructorNote" class="instructor-edit-note full hidden">Instructor accounts only use the account name, login email, and Instructor role. Cadet fields do not apply.</div>');
    }
    removeDuplicateDeleteButtons();
  }

  function syncInstructorFields(){
    ensureLoginEmailField();
    const instructor=$('editRole')?.value==='instructor';
    document.querySelectorAll('#cadetEditForm [data-account-cadet-only]').forEach(label=>label.classList.toggle('hidden',instructor));
    $('accountInstructorNote')?.classList.toggle('hidden',!instructor);
  }

  async function loadAccount(id){
    const client=window.adminSupabase;if(!client||!id)return null;
    const {data,error}=await client.from('profiles').select('id,full_name,email,role,rank,flight,position,parent_email,parent_phone').eq('id',id).maybeSingle();
    if(error){console.warn('Could not load selected account',error);return null}
    return data||null;
  }

  async function renderDeleteAction(){
    removeDuplicateDeleteButtons();
    const detail=$('cadetDetailBody');if(!detail)return;
    detail.querySelector('#visibleCadetDeleteAction')?.remove();
    const edit=detail.querySelector('[data-edit-cadet]');
    const id=edit?.dataset.editCadet;
    if(!id)return;
    const account=await loadAccount(id);selectedAccount=account;
    if(!account||account.role==='instructor')return;
    const body=detail.querySelector('.detail-body')||detail;
    const zone=document.createElement('section');
    zone.id='visibleCadetDeleteAction';
    zone.className='detail-section cadet-danger-zone';
    zone.innerHTML=`<div><h3>Account Actions</h3><p>Deleting this account removes the cadet login and cadet records. This cannot be undone.</p></div><button id="visibleCadetDeleteBtn" type="button">Delete Cadet Account</button><div id="visibleCadetDeleteStatus" class="record-status"></div>`;
    body.appendChild(zone);
  }

  async function prepareEdit(id){
    ensureLoginEmailField();
    const account=await loadAccount(id);if(!account)return;
    selectedAccount=account;
    if($('editEmail'))$('editEmail').value=account.email||'';
    if($('editRole'))$('editRole').value=account.role||'cadet';
    syncInstructorFields();
  }

  async function saveAccount(e){
    if(e.target?.id!=='cadetEditForm')return;
    e.preventDefault();e.stopImmediatePropagation();
    const client=window.adminSupabase,status=$('cadetEditStatus');if(!client||!status)return;
    const id=$('cadetEditId')?.value;
    const body={
      action:'update',id,
      full_name:$('editName')?.value.trim()||'',
      email:$('editEmail')?.value.trim()||'',
      role:$('editRole')?.value||'cadet',
      rank:$('editRank')?.value.trim()||'',
      flight:$('editFlight')?.value.trim()||'',
      position:$('editPosition')?.value.trim()||'',
      parent_email:$('editParentEmail')?.value.trim()||'',
      parent_phone:$('editParentPhone')?.value.trim()||''
    };
    status.textContent='Saving account…';
    try{
      const {data,error}=await client.functions.invoke('manage-cadet-account',{body});
      if(error){status.textContent=await getFunctionError(error,'Could not save the account.');return}
      if(!data?.ok){status.textContent=data?.error||'Could not save the account.';return}
      status.textContent='Account saved.';
      if(typeof window.refreshCadetManagement==='function')await window.refreshCadetManagement();
      setTimeout(()=>{$('cadetEditModal')?.classList.add('hidden');renderDeleteAction()},350);
    }catch(err){status.textContent=await getFunctionError(err,'Could not save the account.')}
  }

  async function deleteAccount(){
    const client=window.adminSupabase;if(!client)return;
    const id=$('visibleCadetDeleteBtn')?.closest('#cadetDetailBody')?.querySelector('[data-edit-cadet]')?.dataset.editCadet;
    const account=(selectedAccount?.id===id?selectedAccount:await loadAccount(id));
    if(!account||account.role==='instructor')return;
    const label=account.full_name||account.email||'this cadet';
    if(!confirm(`Delete ${label}'s cadet account? This removes their login and cadet records and cannot be undone.`))return;
    const button=$('visibleCadetDeleteBtn'),status=$('visibleCadetDeleteStatus');
    if(button)button.disabled=true;if(status)status.textContent='Deleting account…';
    try{
      const {data,error}=await client.functions.invoke('manage-cadet-account',{body:{action:'delete',id:account.id}});
      if(error){if(status)status.textContent=await getFunctionError(error,'Could not delete the account.');return}
      if(!data?.ok){if(status)status.textContent=data?.error||'Could not delete the account.';return}
      selectedAccount=null;
      if(typeof window.refreshCadetManagement==='function')await window.refreshCadetManagement();else location.reload();
    }catch(err){if(status)status.textContent=await getFunctionError(err,'Could not delete the account.')}
    finally{if(button)button.disabled=false}
  }

  function addStyle(){
    if($('cadetAccountActionsStyle'))return;
    const s=document.createElement('style');s.id='cadetAccountActionsStyle';s.textContent=`
      .cadet-danger-zone{margin-top:14px!important;border-color:rgba(255,92,92,.42)!important;background:rgba(80,18,25,.20)!important;display:grid;gap:12px}
      .cadet-danger-zone h3{color:#ffd4d4!important;margin:0 0 5px!important}.cadet-danger-zone p{margin:0;color:#bba6aa;font-size:10px;line-height:1.5}
      #visibleCadetDeleteBtn{justify-self:start;border:1px solid rgba(255,92,92,.55)!important;background:#40151c!important;color:#ffb2b2!important;border-radius:9px!important;padding:10px 13px!important;font-weight:850!important;cursor:pointer!important}
      #visibleCadetDeleteBtn:hover{background:#5a1b24!important;color:#fff!important}#visibleCadetDeleteBtn:disabled{opacity:.55;cursor:not-allowed!important}
      .instructor-edit-note{border:1px solid rgba(255,181,104,.28);background:rgba(255,155,53,.08);border-radius:9px;padding:10px;color:#ffc78d;font-size:11px;line-height:1.45}
    `;document.head.appendChild(s);
  }

  document.addEventListener('click',e=>{
    const edit=e.target.closest('[data-edit-cadet]');if(edit)setTimeout(()=>prepareEdit(edit.dataset.editCadet),0);
    if(e.target.closest('#visibleCadetDeleteBtn')){e.preventDefault();deleteAccount()}
  },true);
  document.addEventListener('change',e=>{if(e.target?.id==='editRole')syncInstructorFields()},true);
  document.addEventListener('submit',saveAccount,true);

  function init(){
    addStyle();ensureLoginEmailField();syncInstructorFields();
    const detail=$('cadetDetailBody');if(detail){new MutationObserver(()=>{clearTimeout(window.__cadetDeleteRenderTimer);window.__cadetDeleteRenderTimer=setTimeout(renderDeleteAction,35)}).observe(detail,{childList:true,subtree:true});renderDeleteAction()}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();