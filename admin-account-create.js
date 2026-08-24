(()=>{
const $=id=>document.getElementById(id);
function syncRoleFields(){
  const instructor=$('createCadetRole')?.value==='instructor';
  ['createCadetRank','createCadetFlight','createCadetPosition','createParentEmail','createParentPhone'].forEach(id=>$(id)?.closest('label')?.classList.toggle('hidden',instructor));
  $('createInstructorNote')?.classList.toggle('hidden',!instructor);
}
function mount(){
  const tools=document.querySelector('.cadet-tools');
  if(!tools)return;
  let btn=$('createCadetAccountBtn');
  if(!btn){
    btn=document.createElement('button');
    btn.id='createCadetAccountBtn';btn.type='button';btn.className='create-account-btn';btn.textContent='Create Cadet Account';tools.prepend(btn);
  }
  if(!$('createCadetModal')){
    document.body.insertAdjacentHTML('beforeend',`<div id="createCadetModal" class="cadet-modal hidden" role="dialog" aria-modal="true" aria-labelledby="createCadetTitle"><div class="cadet-modal-card account-create-card"><div class="cadet-modal-head"><div><h2 id="createCadetTitle">Create Cadet Account</h2><p>Create the login and cadet profile together.</p></div><button type="button" data-close-create-cadet aria-label="Close">×</button></div><form id="createCadetForm" class="cadet-form"><label class="full">Cadet Name<input id="createCadetName" required autocomplete="name"></label><label>Email / Username<input id="createCadetEmail" type="email" required autocomplete="off"></label><label>Temporary Password<input id="createCadetPassword" type="password" minlength="8" required autocomplete="new-password"></label><label>Role<select id="createCadetRole"><option value="cadet">Cadet</option><option value="class_leader">Class Leader</option><option value="command_staff">Command Staff</option><option value="instructor">Instructor</option></select></label><label>Rank<input id="createCadetRank"></label><label>Flight<input id="createCadetFlight"></label><label>Position<input id="createCadetPosition"></label><label>Parent Email<input id="createParentEmail" type="email"></label><label>Parent Phone<input id="createParentPhone" type="tel"></label><div id="createInstructorNote" class="account-create-note full hidden">Instructor accounts only use the account name, login email, password, and Instructor role. Cadet fields do not apply.</div><div class="account-create-note full">The temporary password must be at least 8 characters. Give it directly to the account owner so they can sign in.</div><div id="createCadetStatus" class="cadet-status full" aria-live="polite"></div><div class="cadet-form-actions full"><button type="button" data-close-create-cadet>Cancel</button><button id="createCadetSubmit" type="submit" class="primary">Create Account</button></div></form></div></div>`);
  }
  ['createCadetRank','createCadetFlight','createCadetPosition','createParentEmail','createParentPhone'].forEach(id=>$(id)?.closest('label')?.setAttribute('data-create-cadet-only','1'));
  if(!$('createInstructorNote'))$('createCadetStatus')?.insertAdjacentHTML('beforebegin','<div id="createInstructorNote" class="account-create-note full hidden">Instructor accounts only use the account name, login email, password, and Instructor role. Cadet fields do not apply.</div>');
  syncRoleFields();
  if(!btn.dataset.createCadetBound){
    btn.dataset.createCadetBound='1';
    btn.addEventListener('click',()=>{
      const status=$('createCadetStatus'),modal=$('createCadetModal'),name=$('createCadetName');
      if(status)status.textContent='';
      syncRoleFields();modal?.classList.remove('hidden');setTimeout(()=>name?.focus(),0);
    });
  }
  if(!document.body.dataset.createCadetCloseBound){
    document.body.dataset.createCadetCloseBound='1';
    document.addEventListener('click',e=>{if(e.target.closest('[data-close-create-cadet]'))$('createCadetModal')?.classList.add('hidden')});
  }
  const form=$('createCadetForm');
  if(form&&!form.dataset.createCadetBound){form.dataset.createCadetBound='1';form.addEventListener('submit',createAccount)}
  const role=$('createCadetRole');if(role&&!role.dataset.instructorToggleBound){role.dataset.instructorToggleBound='1';role.addEventListener('change',syncRoleFields)}
}
async function getFunctionError(error){
  try{if(error?.context?.json){const body=await error.context.json();if(body?.error)return body.error}}catch(_e){}
  return error?.message||'Could not create account.';
}
async function createAccount(e){
  e.preventDefault();
  const client=window.adminSupabase,submit=$('createCadetSubmit'),status=$('createCadetStatus');
  if(!client){if(status)status.textContent='Admin connection is not ready yet. Refresh and try again.';return}
  const instructor=$('createCadetRole').value==='instructor';
  const body={full_name:$('createCadetName').value.trim(),email:$('createCadetEmail').value.trim(),password:$('createCadetPassword').value,role:$('createCadetRole').value,rank:instructor?'':$('createCadetRank').value.trim(),flight:instructor?'':$('createCadetFlight').value.trim(),position:instructor?'':$('createCadetPosition').value.trim(),parent_email:instructor?'':$('createParentEmail').value.trim(),parent_phone:instructor?'':$('createParentPhone').value.trim()};
  status.textContent='Creating account…';submit.disabled=true;
  try{
    const {data,error}=await client.functions.invoke('create-cadet-account',{body});
    if(error){status.textContent=await getFunctionError(error);return}
    if(!data?.ok){status.textContent=data?.error||'Could not create account.';return}
    status.textContent='Account created successfully.';e.currentTarget.reset();syncRoleFields();
    if(typeof window.refreshCadetManagement==='function')await window.refreshCadetManagement();
    setTimeout(()=>{$('createCadetModal')?.classList.add('hidden')},700);
  }catch(err){status.textContent=await getFunctionError(err)}
  finally{submit.disabled=false}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();