(()=>{
const $=id=>document.getElementById(id);
function mount(){
  const tools=document.querySelector('.cadet-tools');
  if(!tools||$('createCadetAccountBtn'))return;
  const btn=document.createElement('button');
  btn.id='createCadetAccountBtn';btn.type='button';btn.className='create-account-btn';btn.textContent='+ Create Cadet Account';tools.prepend(btn);
  document.body.insertAdjacentHTML('beforeend',`<div id="createCadetModal" class="cadet-modal hidden" role="dialog" aria-modal="true" aria-labelledby="createCadetTitle"><div class="cadet-modal-card account-create-card"><div class="cadet-modal-head"><div><h2 id="createCadetTitle">Create Cadet Account</h2><p>Create the login and cadet profile together.</p></div><button type="button" data-close-create-cadet aria-label="Close">×</button></div><form id="createCadetForm" class="cadet-form"><label class="full">Cadet Name<input id="createCadetName" required autocomplete="name"></label><label>Email / Username<input id="createCadetEmail" type="email" required autocomplete="off"></label><label>Temporary Password<input id="createCadetPassword" type="password" minlength="8" required autocomplete="new-password"></label><label>Role<select id="createCadetRole"><option value="cadet">Cadet</option><option value="class_leader">Class Leader</option><option value="command_staff">Command Staff</option><option value="instructor">Instructor</option></select></label><label>Rank<input id="createCadetRank"></label><label>Flight<input id="createCadetFlight"></label><label>Position<input id="createCadetPosition"></label><label>Parent Email<input id="createParentEmail" type="email"></label><label>Parent Phone<input id="createParentPhone" type="tel"></label><div class="account-create-note full">The temporary password must be at least 8 characters. Give it directly to the account owner so they can sign in.</div><div id="createCadetStatus" class="cadet-status full" aria-live="polite"></div><div class="cadet-form-actions full"><button type="button" data-close-create-cadet>Cancel</button><button id="createCadetSubmit" type="submit" class="primary">Create Account</button></div></form></div></div>`);
  btn.addEventListener('click',()=>{$('createCadetStatus').textContent='';$('createCadetModal').classList.remove('hidden');$('createCadetName').focus()});
  document.addEventListener('click',e=>{if(e.target.closest('[data-close-create-cadet]'))$('createCadetModal')?.classList.add('hidden')});
  $('createCadetForm').addEventListener('submit',createAccount);
}
async function createAccount(e){
  e.preventDefault();const client=window.adminSupabase;if(!client)return;
  const submit=$('createCadetSubmit'),status=$('createCadetStatus');
  const body={full_name:$('createCadetName').value.trim(),email:$('createCadetEmail').value.trim(),password:$('createCadetPassword').value,role:$('createCadetRole').value,rank:$('createCadetRank').value.trim(),flight:$('createCadetFlight').value.trim(),position:$('createCadetPosition').value.trim(),parent_email:$('createParentEmail').value.trim(),parent_phone:$('createParentPhone').value.trim()};
  status.textContent='Creating account…';submit.disabled=true;
  try{
    const {data,error}=await client.functions.invoke('create-cadet-account',{body});
    if(error)throw error;if(!data?.ok)throw new Error(data?.error||'Could not create account.');
    status.textContent='Account created successfully.';e.currentTarget.reset();
    if(typeof window.openCadetManagement==='function')window.openCadetManagement();
    setTimeout(()=>{$('createCadetModal').classList.add('hidden');location.reload()},700);
  }catch(err){status.textContent=err?.message||'Could not create account.'}
  finally{submit.disabled=false}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();