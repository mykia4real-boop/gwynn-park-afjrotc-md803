(()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let managedFlights=[];
let flightCounts={};
let accountCreateInFlight=false;

function cleanFlightName(value){return String(value||'').trim().replace(/\s+flight$/i,'').trim()}
function syncRoleFields(){
  const instructor=$('createCadetRole')?.value==='instructor';
  ['createCadetRank','createCadetFlight','createCadetPosition','createParentEmail','createParentPhone'].forEach(id=>$(id)?.closest('label')?.classList.toggle('hidden',instructor));
  $('createInstructorNote')?.classList.toggle('hidden',!instructor);
}
function ensureFlightStyles(){
  if($('flightManagerStyles'))return;
  const style=document.createElement('style');style.id='flightManagerStyles';style.textContent=`
    .manage-flights-btn{white-space:nowrap}
    .flight-manager-card{width:min(620px,calc(100vw - 28px))}
    .flight-manager-form{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin:4px 0 18px}
    .flight-manager-form label{display:grid;gap:7px;font-size:.82rem;color:var(--muted,#8f99aa);font-weight:700}
    .flight-manager-form input{min-height:42px;border:1px solid var(--line,#2d3440);border-radius:10px;background:var(--panel,#171b22);color:var(--text,#f5f7fb);padding:0 12px}
    .flight-manager-form button{min-height:42px}
    .flight-manager-status{min-height:20px;margin:-5px 0 10px;color:var(--muted,#8f99aa);font-size:.86rem}
    .flight-manage-list{display:grid;gap:9px;max-height:360px;overflow:auto}
    .flight-manage-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 14px;border:1px solid var(--line,#2d3440);border-radius:12px;background:var(--panel-soft,#11151b)}
    .flight-manage-row div{display:grid;gap:3px}.flight-manage-row b{font-size:.96rem}.flight-manage-row span{font-size:.8rem;color:var(--muted,#8f99aa)}
    .flight-delete-btn{border:1px solid rgba(220,70,70,.45)!important;color:#ff8a8a!important;background:rgba(220,70,70,.08)!important}
    .flight-empty{padding:22px;text-align:center;color:var(--muted,#8f99aa);border:1px dashed var(--line,#2d3440);border-radius:12px}
    .account-create-toast{position:fixed;right:20px;bottom:20px;z-index:5000;max-width:min(360px,calc(100vw - 32px));padding:13px 16px;border-radius:12px;background:#0d2f4d;color:#fff;border:1px solid rgba(255,216,61,.38);box-shadow:0 16px 40px rgba(0,0,0,.3);font-weight:850;font-size:13px;opacity:0;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease;pointer-events:none}.account-create-toast.show{opacity:1;transform:translateY(0)}
    @media(max-width:640px){.flight-manager-form{grid-template-columns:1fr}.flight-manage-row{align-items:flex-start}.flight-delete-btn{flex:0 0 auto}.account-create-toast{left:16px;right:16px;bottom:16px;max-width:none}}
  `;document.head.appendChild(style);
}
function showCreateToast(message){
  let toast=$('accountCreateToast');
  if(!toast){toast=document.createElement('div');toast.id='accountCreateToast';toast.className='account-create-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast)}
  toast.textContent=message;
  requestAnimationFrame(()=>toast.classList.add('show'));
  clearTimeout(showCreateToast.timer);
  showCreateToast.timer=setTimeout(()=>toast.classList.remove('show'),2600);
}
function ensureFlightDatalist(){
  let list=$('managedFlightOptions');
  if(!list){list=document.createElement('datalist');list.id='managedFlightOptions';document.body.appendChild(list)}
  ['createCadetFlight','editFlight'].forEach(id=>{const field=$(id);if(field&&field.tagName==='INPUT')field.setAttribute('list','managedFlightOptions')});
  return list;
}
function renderFlightOptions(){
  const list=ensureFlightDatalist();
  list.innerHTML=managedFlights.map(f=>`<option value="${esc(f.name)}">${esc(f.name)} Flight</option>`).join('');
}
function renderFlightManager(){
  const box=$('flightManageList');if(!box)return;
  box.innerHTML=managedFlights.map(f=>{
    const count=Number(flightCounts[f.name]||0);
    return `<article class="flight-manage-row"><div><b>${esc(f.name)} Flight</b><span>${count} cadet${count===1?'':'s'} assigned</span></div><button type="button" class="flight-delete-btn" data-delete-flight="${esc(f.name)}">Delete</button></article>`;
  }).join('')||'<div class="flight-empty">No flights created yet.</div>';
}
async function loadFlights(includeCounts=false){
  const client=window.adminSupabase;if(!client)return [];
  try{
    const {data,error}=await client.from('flights').select('name,created_at').order('name');
    if(error)throw error;
    managedFlights=data||[];
    if(includeCounts){
      flightCounts={};
      const {data:profiles,error:profileError}=await client.from('profiles').select('flight');
      if(!profileError)(profiles||[]).forEach(p=>{if(p.flight)flightCounts[p.flight]=(flightCounts[p.flight]||0)+1});
    }
    renderFlightOptions();renderFlightManager();
    return managedFlights;
  }catch(error){console.warn('Could not load flights',error);return []}
}
function ensureFlightManager(){
  const tools=document.querySelector('.cadet-tools');if(!tools)return;
  let btn=$('manageFlightsBtn');
  if(!btn){btn=document.createElement('button');btn.id='manageFlightsBtn';btn.type='button';btn.className='create-account-btn manage-flights-btn';btn.textContent='Manage Flights';const create=$('createCadetAccountBtn');if(create)tools.insertBefore(btn,create);else tools.prepend(btn)}
  if(!$('flightManagerModal'))document.body.insertAdjacentHTML('beforeend',`<div id="flightManagerModal" class="cadet-modal hidden" role="dialog" aria-modal="true" aria-labelledby="flightManagerTitle"><div class="cadet-modal-card flight-manager-card"><div class="cadet-modal-head"><div><h2 id="flightManagerTitle">Manage Flights</h2><p>Create or remove unit flights.</p></div><button type="button" data-close-flight-manager aria-label="Close">×</button></div><div style="padding:18px"><form id="createFlightForm" class="flight-manager-form"><label>Flight Name<input id="newFlightName" maxlength="40" placeholder="Example: Alpha" required autocomplete="off"></label><button class="primary" type="submit">Create Flight</button></form><div id="flightManagerStatus" class="flight-manager-status" aria-live="polite"></div><div id="flightManageList" class="flight-manage-list"></div></div></div></div>`);
  if(!btn.dataset.flightManagerBound){btn.dataset.flightManagerBound='1';btn.addEventListener('click',async()=>{const status=$('flightManagerStatus');if(status)status.textContent='Loading flights…';$('flightManagerModal')?.classList.remove('hidden');await loadFlights(true);if(status)status.textContent=''})}
  const form=$('createFlightForm');if(form&&!form.dataset.flightCreateBound){form.dataset.flightCreateBound='1';form.addEventListener('submit',createFlight)}
  if(!document.body.dataset.flightManagerBound){document.body.dataset.flightManagerBound='1';document.addEventListener('click',e=>{if(e.target.closest('[data-close-flight-manager]'))$('flightManagerModal')?.classList.add('hidden');const del=e.target.closest('[data-delete-flight]');if(del)deleteFlight(del.dataset.deleteFlight)})}
}
async function createFlight(e){
  e.preventDefault();const client=window.adminSupabase,status=$('flightManagerStatus'),input=$('newFlightName');if(!client||!input)return;
  const name=cleanFlightName(input.value);
  if(!name){status.textContent='Enter a flight name first.';return}
  if(managedFlights.some(f=>f.name.toLowerCase()===name.toLowerCase())){status.textContent=`${name} Flight already exists.`;return}
  status.textContent='Creating flight…';
  try{
    const {data:userData,error:userError}=await client.auth.getUser();if(userError)throw userError;
    const {error}=await client.from('flights').insert({name,created_by:userData.user?.id||null});if(error)throw error;
    input.value='';status.textContent=`${name} Flight created.`;await loadFlights(true);
    if(typeof window.refreshCadetManagement==='function')await window.refreshCadetManagement();
  }catch(error){status.textContent=error?.code==='23505'?'That flight already exists.':(error?.message||'Could not create the flight.')}
}
async function deleteFlight(name){
  const client=window.adminSupabase,status=$('flightManagerStatus');if(!client||!name)return;
  const count=Number(flightCounts[name]||0);
  const message=count?`Delete ${name} Flight? ${count} cadet${count===1?' is':'s are'} assigned and will become unassigned.`:`Delete ${name} Flight?`;
  if(!window.confirm(message))return;
  status.textContent=`Deleting ${name} Flight…`;
  try{
    const {error}=await client.from('flights').delete().eq('name',name);if(error)throw error;
    status.textContent=`${name} Flight deleted.`;await loadFlights(true);
    if(typeof window.refreshCadetManagement==='function')await window.refreshCadetManagement();
  }catch(error){status.textContent=error?.message||'Could not delete the flight.'}
}
function mount(){
  const tools=document.querySelector('.cadet-tools');
  if(!tools)return;
  ensureFlightStyles();ensureFlightDatalist();
  let btn=$('createCadetAccountBtn');
  if(!btn){
    btn=document.createElement('button');
    btn.id='createCadetAccountBtn';btn.type='button';btn.className='create-account-btn';btn.textContent='Create Cadet Account';tools.prepend(btn);
  }
  ensureFlightManager();
  if(!$('createCadetModal')){
    document.body.insertAdjacentHTML('beforeend',`<div id="createCadetModal" class="cadet-modal hidden" role="dialog" aria-modal="true" aria-labelledby="createCadetTitle"><div class="cadet-modal-card account-create-card"><div class="cadet-modal-head"><div><h2 id="createCadetTitle">Create Cadet Account</h2><p>Create the login and cadet profile together.</p></div><button type="button" data-close-create-cadet aria-label="Close">×</button></div><form id="createCadetForm" class="cadet-form"><label class="full">Cadet Name<input id="createCadetName" required autocomplete="name"></label><label>Email / Username<input id="createCadetEmail" type="email" required autocomplete="off"></label><label>Temporary Password<input id="createCadetPassword" type="password" minlength="8" required autocomplete="new-password"></label><label>Role<select id="createCadetRole"><option value="cadet">Cadet</option><option value="class_leader">Class Leader</option><option value="command_staff">Command Staff</option><option value="instructor">Instructor</option></select></label><label>Rank<input id="createCadetRank"></label><label>Flight<input id="createCadetFlight" list="managedFlightOptions" placeholder="Choose a created flight"></label><label>Position<input id="createCadetPosition"></label><label>Parent Email<input id="createParentEmail" type="email"></label><label>Parent Phone<input id="createParentPhone" type="tel"></label><div id="createInstructorNote" class="account-create-note full hidden">Instructor accounts only use the account name, login email, password, and Instructor role. Cadet fields do not apply.</div><div class="account-create-note full">The temporary password must be at least 8 characters. Give it directly to the account owner so they can sign in.</div><div id="createCadetStatus" class="cadet-status full" aria-live="polite"></div><div class="cadet-form-actions full"><button type="button" data-close-create-cadet>Cancel</button><button id="createCadetSubmit" type="submit" class="primary">Create Account</button></div></form></div></div>`);
  }
  ensureFlightDatalist();
  ['createCadetRank','createCadetFlight','createCadetPosition','createParentEmail','createParentPhone'].forEach(id=>$(id)?.closest('label')?.setAttribute('data-create-cadet-only','1'));
  if(!$('createInstructorNote'))$('createCadetStatus')?.insertAdjacentHTML('beforebegin','<div id="createInstructorNote" class="account-create-note full hidden">Instructor accounts only use the account name, login email, password, and Instructor role. Cadet fields do not apply.</div>');
  syncRoleFields();
  if(!btn.dataset.createCadetBound){
    btn.dataset.createCadetBound='1';
    btn.addEventListener('click',async()=>{
      const status=$('createCadetStatus'),modal=$('createCadetModal'),name=$('createCadetName');
      if(status)status.textContent='';
      await loadFlights(false);syncRoleFields();modal?.classList.remove('hidden');setTimeout(()=>name?.focus(),0);
    });
  }
  if(!document.body.dataset.createCadetCloseBound){
    document.body.dataset.createCadetCloseBound='1';
    document.addEventListener('click',e=>{if(e.target.closest('[data-close-create-cadet]')&&!accountCreateInFlight)$('createCadetModal')?.classList.add('hidden');if(e.target.closest('[data-edit-cadet]'))loadFlights(false)});
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
  if(accountCreateInFlight)return;
  const client=window.adminSupabase,submit=$('createCadetSubmit'),status=$('createCadetStatus'),form=e.currentTarget,modal=$('createCadetModal');
  if(!client){if(status)status.textContent='Admin connection is not ready yet. Refresh and try again.';return}
  const instructor=$('createCadetRole').value==='instructor';
  const flight=instructor?'':cleanFlightName($('createCadetFlight').value);
  if(flight&&!managedFlights.some(f=>f.name===flight)){status.textContent='Create that flight in Manage Flights before assigning it to a cadet.';return}
  const fullName=$('createCadetName').value.trim();
  const body={full_name:fullName,email:$('createCadetEmail').value.trim(),password:$('createCadetPassword').value,role:$('createCadetRole').value,rank:instructor?'':$('createCadetRank').value.trim(),flight,position:instructor?'':$('createCadetPosition').value.trim(),parent_email:instructor?'':$('createParentEmail').value.trim(),parent_phone:instructor?'':$('createParentPhone').value.trim()};
  accountCreateInFlight=true;
  status.textContent='Creating account…';
  submit.disabled=true;
  submit.textContent='Creating…';
  form.setAttribute('aria-busy','true');
  try{
    const {data,error}=await client.functions.invoke('create-cadet-account',{body});
    if(error){status.textContent=await getFunctionError(error);return}
    if(!data?.ok){status.textContent=data?.error||'Could not create account.';return}

    // Close first so the form reset and roster redraw never flash on screen.
    modal?.classList.add('hidden');
    showCreateToast(`${fullName||'Account'} created successfully.`);
    form.reset();
    syncRoleFields();
    if(status)status.textContent='';

    // Refresh only after the modal is gone, preventing the page from visually jumping behind it.
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(typeof window.refreshCadetManagement==='function')await window.refreshCadetManagement();
  }catch(err){status.textContent=await getFunctionError(err)}
  finally{
    accountCreateInFlight=false;
    submit.disabled=false;
    submit.textContent='Create Account';
    form.removeAttribute('aria-busy');
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();