(()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cadetRows=[],serviceRows=[],leadershipRows=[],selectedId=null,detailTab='overview',rosterTab='roster';
const roleLabel=r=>r==='command_staff'?'Command Staff':r==='class_leader'?'Class Leader':r==='instructor'?'Instructor':'Cadet';
const fmtHours=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:1});
const fmtDate=d=>d?new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'—';
function sumService(id){return serviceRows.filter(x=>x.cadet_id===id).reduce((s,x)=>s+Number(x.hours||0),0)}
function sumLeadership(id){return leadershipRows.filter(x=>x.cadet_id===id).reduce((s,x)=>s+Number(x.points||0),0)}
function showWorkspace(name){
  const commandParts=document.querySelectorAll('.command-head,.stats-grid,.dashboard-grid,.bottom-grid');
  const cadets=$('cadetWorkspace');
  document.querySelectorAll('.admin-nav button').forEach(b=>b.classList.remove('active'));
  if(name==='cadets'){
    commandParts.forEach(x=>x.classList.add('hidden'));
    cadets?.classList.remove('hidden');
    document.querySelector('[data-section="cadets"]')?.classList.add('active');
    setupRosterTabs();
    loadCadets();
  }else{
    commandParts.forEach(x=>x.classList.remove('hidden'));
    cadets?.classList.add('hidden');
    document.querySelector('[data-section="command"]')?.classList.add('active');
  }
}
async function safe(p,f=[]){try{const {data,error}=await p;if(error)throw error;return data??f}catch(e){console.warn(e);return f}}
async function loadCadets(){
  const client=window.adminSupabase;if(!client)return;
  const [p,s,l]=await Promise.all([
    safe(client.from('profiles').select('id,full_name,email,role,flight,position,rank,parent_email,parent_phone,created_at').order('full_name')),
    safe(client.from('community_service_hours').select('id,cadet_id,hours,organization,description,service_date,created_at').order('service_date',{ascending:false}).order('created_at',{ascending:false})),
    safe(client.from('leadership_point_awards').select('id,cadet_id,points,reason,awarded_by,created_at').order('created_at',{ascending:false}))
  ]);
  cadetRows=p;serviceRows=s;leadershipRows=l;
  renderSummary();
  if(selectedId&&!cadetRows.some(x=>x.id===selectedId))selectedId=null;
  if(!selectedId&&cadetRows.length)selectedId=cadetRows.find(x=>x.role!=='instructor')?.id||cadetRows[0].id;
  setupRosterTabs();renderRoster();renderDetail();
}
function renderSummary(){
  if($('cmTotal'))$('cmTotal').textContent=cadetRows.filter(x=>x.role!=='instructor').length;
  if($('cmCommand'))$('cmCommand').textContent=cadetRows.filter(x=>x.role==='command_staff').length;
  if($('cmLeaders'))$('cmLeaders').textContent=cadetRows.filter(x=>x.role==='class_leader').length;
  if($('cmInstructors'))$('cmInstructors').textContent=cadetRows.filter(x=>x.role==='instructor').length;
}
function filteredRows(){
  const q=($('cadetSearch')?.value||'').trim().toLowerCase(),role=$('cadetRoleFilter')?.value||'',flight=$('cadetFlightFilter')?.value||'';
  return cadetRows.filter(p=>(!q||`${p.full_name||''} ${p.rank||''} ${p.role||''} ${p.flight||''} ${p.position||''}`.toLowerCase().includes(q))&&(!role||p.role===role)&&(!flight||p.flight===flight));
}
function setupRosterTabs(){
  const buttons=[...document.querySelectorAll('.roster-tabs button')];
  const keys=['roster','roles','flights','service','leadership'];
  buttons.forEach((button,i)=>{
    const key=keys[i]||'roster';
    button.type='button';
    button.dataset.rosterTab=key;
    button.classList.toggle('active',rosterTab===key);
  });
}
function rosterColumns(){
  if(rosterTab==='roles')return ['Cadet Name','Role','Rank','Position','Flight'];
  if(rosterTab==='flights')return ['Cadet Name','Flight / Class','Role','Rank','Position'];
  if(rosterTab==='service')return ['Cadet Name','Service Hours','Flight','Role','Position'];
  if(rosterTab==='leadership')return ['Cadet Name','Leadership Points','Role','Flight','Position'];
  return ['Cadet Name','Role','Flight','Service Hours','Leadership Pts','Position'];
}
function rosterRow(p){
  const name=`<td class="cadet-name-cell"><b>${esc(p.full_name||'Unnamed Cadet')}</b><span>${esc(p.rank||'Rank not assigned')}</span></td>`;
  const role=`<span class="role-pill ${esc(p.role||'cadet')}">${esc(roleLabel(p.role))}</span>`;
  if(rosterTab==='roles')return `${name}<td>${role}</td><td>${esc(p.rank||'—')}</td><td>${esc(p.position||'—')}</td><td>${esc(p.flight||'—')}</td>`;
  if(rosterTab==='flights')return `${name}<td>${esc(p.flight?p.flight+' Flight':'—')}</td><td>${role}</td><td>${esc(p.rank||'—')}</td><td>${esc(p.position||'—')}</td>`;
  if(rosterTab==='service')return `${name}<td><b>${fmtHours(sumService(p.id))}</b> hrs</td><td>${esc(p.flight||'—')}</td><td>${role}</td><td>${esc(p.position||'—')}</td>`;
  if(rosterTab==='leadership')return `${name}<td><b>${sumLeadership(p.id).toLocaleString()}</b> pts</td><td>${role}</td><td>${esc(p.flight||'—')}</td><td>${esc(p.position||'—')}</td>`;
  return `${name}<td>${role}</td><td>${esc(p.flight||'—')}</td><td>${fmtHours(sumService(p.id))}</td><td>${sumLeadership(p.id).toLocaleString()}</td><td>${esc(p.position||'—')}</td>`;
}
function renderRoster(){
  const flights=[...new Set(cadetRows.map(x=>x.flight).filter(Boolean))].sort(),fs=$('cadetFlightFilter');
  if(fs){const current=fs.value;fs.innerHTML='<option value="">All flights</option>'+flights.map(f=>`<option value="${esc(f)}">${esc(f)} Flight</option>`).join('');if(flights.includes(current))fs.value=current}
  setupRosterTabs();
  const rows=filteredRows(),thead=document.querySelector('.roster-table thead'),body=$('cadetRosterBody');
  const columns=rosterColumns();
  if(thead)thead.innerHTML=`<tr>${columns.map(c=>`<th>${c}</th>`).join('')}</tr>`;
  if(body)body.innerHTML=rows.map(p=>`<tr class="roster-row ${p.id===selectedId?'selected':''}" data-cadet-id="${p.id}">${rosterRow(p)}</tr>`).join('')||`<tr><td colspan="${columns.length}" style="color:var(--muted)">No matching cadets.</td></tr>`;
  if($('cadetRosterCount'))$('cadetRosterCount').textContent=`Showing ${rows.length} of ${cadetRows.length}`;
}
function changeRosterTab(tab){
  if(!['roster','roles','flights','service','leadership'].includes(tab))return;
  rosterTab=tab;
  setupRosterTabs();renderRoster();
  if(tab==='service')detailTab='service';
  else if(tab==='leadership')detailTab='leadership';
  else detailTab='overview';
  renderDetail();
}
function tabs(){return `<div class="detail-tabs"><button class="${detailTab==='overview'?'active':''}" data-detail-tab="overview" type="button">Overview</button><button class="${detailTab==='service'?'active':''}" data-detail-tab="service" type="button">Service Hours</button><button class="${detailTab==='leadership'?'active':''}" data-detail-tab="leadership" type="button">Leadership</button></div>`}
function renderDetail(){
  const p=cadetRows.find(x=>x.id===selectedId),box=$('cadetDetailBody');if(!box)return;if(!p){box.innerHTML='<div class="detail-empty">Select a cadet to view their record.</div>';return}
  const head=`<div class="detail-top"><h2>${esc(p.full_name||'Cadet')}</h2><p>${esc(p.rank||'Rank not assigned')} · ${esc(roleLabel(p.role))}${p.flight?' · '+esc(p.flight)+' Flight':''}</p></div>${tabs()}`;
  if(detailTab==='service'){box.innerHTML=head+renderServiceTab(p);return}
  if(detailTab==='leadership'){box.innerHTML=head+renderLeadershipTab(p);return}
  const sh=sumService(p.id),lp=sumLeadership(p.id);
  box.innerHTML=head+`<div class="detail-body"><section class="detail-section"><div class="detail-section-head"><h3>Cadet Information</h3><button type="button" data-edit-cadet="${p.id}">Edit</button></div><div class="detail-grid"><div class="detail-field"><small>Role</small><b>${esc(roleLabel(p.role))}</b></div><div class="detail-field"><small>Rank</small><b>${esc(p.rank||'—')}</b></div><div class="detail-field"><small>Flight</small><b>${esc(p.flight||'—')}</b></div><div class="detail-field"><small>Position</small><b>${esc(p.position||'—')}</b></div></div></section><section class="detail-section"><div class="detail-section-head"><h3>Parent Contact</h3><button type="button" data-edit-cadet="${p.id}">Edit</button></div><div class="detail-grid"><div class="detail-field"><small>Parent Email</small><span>${esc(p.parent_email||'Not added')}</span></div><div class="detail-field"><small>Parent Phone</small><span>${esc(p.parent_phone||'Not added')}</span></div></div><p class="contact-note">Only parent email and parent phone are shown in Cadet Management.</p></section><section class="detail-section"><h3 style="margin-bottom:10px">Record Overview</h3><div class="metric-row"><div class="metric-box"><small>Service Hours</small><b>${fmtHours(sh)}</b></div><div class="metric-box"><small>Leadership Points</small><b>${lp.toLocaleString()}</b></div></div></section></div>`;
}
function renderServiceTab(p){
  if(p.role==='instructor')return '<div class="detail-body"><section class="detail-section"><p class="record-empty">Service hours are tracked for cadets, not instructors.</p></section></div>';
  const rows=serviceRows.filter(x=>x.cadet_id===p.id);
  return `<div class="detail-body"><section class="detail-section record-editor"><div class="detail-section-head"><h3 id="serviceFormTitle">Add Service Hours</h3></div><form id="serviceRecordForm" class="record-form"><input id="serviceRecordId" type="hidden"><label>Date<input id="serviceDate" type="date" required></label><label>Hours<input id="serviceHours" type="number" min="0.1" step="0.1" required></label><label class="full">Organization<input id="serviceOrg" maxlength="120"></label><label class="full">Description<textarea id="serviceDescription" rows="2" maxlength="500"></textarea></label><div id="serviceRecordStatus" class="record-status full" aria-live="polite"></div><div class="record-actions full"><button type="button" data-reset-service>Clear</button><button class="primary" type="submit">Save Service Hours</button></div></form></section><section class="detail-section"><div class="detail-section-head"><h3>Service History</h3><b>${fmtHours(sumService(p.id))} total hours</b></div><div class="record-list">${rows.map(r=>`<article class="record-row"><div><b>${fmtHours(r.hours)} hrs · ${esc(r.organization||'Community Service')}</b><span>${fmtDate(r.service_date)}${r.description?' · '+esc(r.description):''}</span></div><div class="record-row-actions"><button type="button" data-edit-service="${r.id}">Edit</button><button class="danger" type="button" data-delete-service="${r.id}">Delete</button></div></article>`).join('')||'<p class="record-empty">No service hours recorded yet.</p>'}</div></section></div>`;
}
function renderLeadershipTab(p){
  if(p.role==='instructor')return '<div class="detail-body"><section class="detail-section"><p class="record-empty">Leadership points are awarded to cadets, not instructors.</p></section></div>';
  const rows=leadershipRows.filter(x=>x.cadet_id===p.id);
  return `<div class="detail-body"><section class="detail-section record-editor"><div class="detail-section-head"><h3 id="leadershipFormTitle">Award Leadership Points</h3></div><form id="leadershipRecordForm" class="record-form"><input id="leadershipRecordId" type="hidden"><label>Points<input id="leadershipPoints" type="number" step="1" required></label><label class="full">Reason<textarea id="leadershipReason" rows="2" maxlength="500" required></textarea></label><div id="leadershipRecordStatus" class="record-status full" aria-live="polite"></div><div class="record-actions full"><button type="button" data-reset-leadership>Clear</button><button class="primary" type="submit">Save Leadership Award</button></div></form></section><section class="detail-section"><div class="detail-section-head"><h3>Leadership History</h3><b>${sumLeadership(p.id).toLocaleString()} total points</b></div><div class="record-list">${rows.map(r=>`<article class="record-row"><div><b>${Number(r.points)>0?'+':''}${esc(r.points)} points</b><span>${esc(r.reason||'Leadership award')} · ${new Date(r.created_at).toLocaleDateString()}</span></div><div class="record-row-actions"><button type="button" data-edit-leadership="${r.id}">Edit</button><button class="danger" type="button" data-delete-leadership="${r.id}">Delete</button></div></article>`).join('')||'<p class="record-empty">No leadership awards recorded yet.</p>'}</div></section></div>`;
}
function openEdit(id){const p=cadetRows.find(x=>x.id===id);if(!p)return;if(!$('cadetEditModal'))return;$('cadetEditId').value=p.id;$('editName').value=p.full_name||'';$('editRole').value=p.role||'cadet';$('editRank').value=p.rank||'';$('editFlight').value=p.flight||'';$('editPosition').value=p.position||'';$('editParentEmail').value=p.parent_email||'';$('editParentPhone').value=p.parent_phone||'';$('cadetEditStatus').textContent='';$('cadetEditModal').classList.remove('hidden')}
function closeEdit(){$('cadetEditModal')?.classList.add('hidden')}
async function saveEdit(e){e.preventDefault();const client=window.adminSupabase;if(!client)return;const id=$('cadetEditId').value,payload={full_name:$('editName').value.trim(),role:$('editRole').value,rank:$('editRank').value.trim()||null,flight:$('editFlight').value.trim()||null,position:$('editPosition').value.trim()||null,parent_email:$('editParentEmail').value.trim()||null,parent_phone:$('editParentPhone').value.trim()||null};$('cadetEditStatus').textContent='Saving…';const {error}=await client.from('profiles').update(payload).eq('id',id);if(error){$('cadetEditStatus').textContent=error.message;return}$('cadetEditStatus').textContent='Saved.';await loadCadets();setTimeout(closeEdit,450)}
async function saveService(e){e.preventDefault();const client=window.adminSupabase,id=$('serviceRecordId').value,payload={cadet_id:selectedId,service_date:$('serviceDate').value,hours:Number($('serviceHours').value),organization:$('serviceOrg').value.trim()||null,description:$('serviceDescription').value.trim()||null};$('serviceRecordStatus').textContent='Saving…';let q;if(id)q=client.from('community_service_hours').update(payload).eq('id',id);else{const {data:{user}}=await client.auth.getUser();payload.created_by=user?.id||null;q=client.from('community_service_hours').insert(payload)}const {error}=await q;if(error){$('serviceRecordStatus').textContent=error.message;return}await loadCadets();detailTab='service';renderDetail();renderRoster()}
async function saveLeadership(e){e.preventDefault();const client=window.adminSupabase,id=$('leadershipRecordId').value,payload={cadet_id:selectedId,points:Number($('leadershipPoints').value),reason:$('leadershipReason').value.trim()};$('leadershipRecordStatus').textContent='Saving…';let q;if(id)q=client.from('leadership_point_awards').update(payload).eq('id',id);else{const {data:{user}}=await client.auth.getUser();payload.awarded_by=user?.id||null;q=client.from('leadership_point_awards').insert(payload)}const {error}=await q;if(error){$('leadershipRecordStatus').textContent=error.message;return}await loadCadets();detailTab='leadership';renderDetail();renderRoster()}
function editService(id){const r=serviceRows.find(x=>String(x.id)===String(id));if(!r)return;$('serviceRecordId').value=r.id;$('serviceDate').value=r.service_date||'';$('serviceHours').value=r.hours||'';$('serviceOrg').value=r.organization||'';$('serviceDescription').value=r.description||'';$('serviceFormTitle').textContent='Edit Service Hours'}
function editLeadership(id){const r=leadershipRows.find(x=>String(x.id)===String(id));if(!r)return;$('leadershipRecordId').value=r.id;$('leadershipPoints').value=r.points||'';$('leadershipReason').value=r.reason||'';$('leadershipFormTitle').textContent='Edit Leadership Award'}
async function deleteService(id){if(!confirm('Delete this service-hours record?'))return;const {error}=await window.adminSupabase.from('community_service_hours').delete().eq('id',id);if(error){alert(error.message);return}await loadCadets();detailTab='service';renderDetail();renderRoster()}
async function deleteLeadership(id){if(!confirm('Delete this leadership award?'))return;const {error}=await window.adminSupabase.from('leadership_point_awards').delete().eq('id',id);if(error){alert(error.message);return}await loadCadets();detailTab='leadership';renderDetail();renderRoster()}
document.addEventListener('click',e=>{
  const roster=e.target.closest('[data-roster-tab]');if(roster){e.preventDefault();changeRosterTab(roster.dataset.rosterTab);return}
  const nav=e.target.closest('[data-section]');if(nav){showWorkspace(nav.dataset.section);return}
  const row=e.target.closest('[data-cadet-id]');if(row){selectedId=row.dataset.cadetId;if(rosterTab==='service')detailTab='service';else if(rosterTab==='leadership')detailTab='leadership';else detailTab='overview';renderRoster();renderDetail();return}
  const tab=e.target.closest('[data-detail-tab]');if(tab){detailTab=tab.dataset.detailTab;renderDetail();return}
  const edit=e.target.closest('[data-edit-cadet]');if(edit){openEdit(edit.dataset.editCadet);return}
  const se=e.target.closest('[data-edit-service]');if(se){editService(se.dataset.editService);return}
  const sd=e.target.closest('[data-delete-service]');if(sd){deleteService(sd.dataset.deleteService);return}
  const le=e.target.closest('[data-edit-leadership]');if(le){editLeadership(le.dataset.editLeadership);return}
  const ld=e.target.closest('[data-delete-leadership]');if(ld){deleteLeadership(ld.dataset.deleteLeadership);return}
  if(e.target.closest('[data-reset-service]')){renderDetail();return}
  if(e.target.closest('[data-reset-leadership]')){renderDetail();return}
  if(e.target.closest('[data-close-cadet-edit]')){closeEdit();return}
});
document.addEventListener('submit',e=>{if(e.target.id==='serviceRecordForm')saveService(e);if(e.target.id==='leadershipRecordForm')saveLeadership(e)});
$('cadetSearch')?.addEventListener('input',renderRoster);$('cadetRoleFilter')?.addEventListener('change',renderRoster);$('cadetFlightFilter')?.addEventListener('change',renderRoster);$('cadetEditForm')?.addEventListener('submit',saveEdit);
setupRosterTabs();
window.openCadetManagement=()=>showWorkspace('cadets');
})();