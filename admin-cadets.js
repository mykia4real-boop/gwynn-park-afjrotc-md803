(()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cadetRows=[],serviceRows=[],leadershipRows=[],selectedId=null;
const roleLabel=r=>r==='command_staff'?'Command Staff':r==='class_leader'?'Class Leader':r==='instructor'?'Instructor':'Cadet';
const fmtHours=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:1});
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
    loadCadets();
  }else{
    commandParts.forEach(x=>x.classList.remove('hidden'));
    cadets?.classList.add('hidden');
    document.querySelector('[data-section="command"]')?.classList.add('active');
  }
}
async function safe(p,f=[]){try{const {data,error}=await p;if(error)throw error;return data??f}catch(e){console.warn(e);return f}}
async function loadCadets(){
  const client=window.adminSupabase;
  if(!client)return;
  const [p,s,l]=await Promise.all([
    safe(client.from('profiles').select('id,full_name,email,role,flight,position,rank,parent_email,parent_phone,created_at').order('full_name')),
    safe(client.from('community_service_hours').select('id,cadet_id,hours,organization,description,service_date,created_at').order('created_at',{ascending:false})),
    safe(client.from('leadership_point_awards').select('id,cadet_id,points,reason,created_at').order('created_at',{ascending:false}))
  ]);
  cadetRows=p;serviceRows=s;leadershipRows=l;
  renderSummary();renderRoster();
  if(selectedId&&!cadetRows.some(x=>x.id===selectedId))selectedId=null;
  if(!selectedId&&cadetRows.length)selectedId=cadetRows.find(x=>x.role!=='instructor')?.id||cadetRows[0].id;
  renderDetail();
}
function renderSummary(){
  $('cmTotal').textContent=cadetRows.filter(x=>x.role!=='instructor').length;
  $('cmCommand').textContent=cadetRows.filter(x=>x.role==='command_staff').length;
  $('cmLeaders').textContent=cadetRows.filter(x=>x.role==='class_leader').length;
  $('cmInstructors').textContent=cadetRows.filter(x=>x.role==='instructor').length;
}
function filteredRows(){
  const q=($('cadetSearch')?.value||'').trim().toLowerCase();
  const role=$('cadetRoleFilter')?.value||'';
  const flight=$('cadetFlightFilter')?.value||'';
  return cadetRows.filter(p=>(!q||`${p.full_name||''} ${p.rank||''} ${p.role||''} ${p.flight||''} ${p.position||''}`.toLowerCase().includes(q))&&(!role||p.role===role)&&(!flight||p.flight===flight));
}
function renderRoster(){
  const flights=[...new Set(cadetRows.map(x=>x.flight).filter(Boolean))].sort();
  const fs=$('cadetFlightFilter');if(fs&&fs.options.length<=1)flights.forEach(f=>fs.add(new Option(f+' Flight',f)));
  const rows=filteredRows();
  $('cadetRosterBody').innerHTML=rows.map(p=>`<tr class="roster-row ${p.id===selectedId?'selected':''}" data-cadet-id="${p.id}"><td class="cadet-name-cell"><b>${esc(p.full_name||'Unnamed Cadet')}</b><span>${esc(p.rank||'Rank not assigned')}</span></td><td><span class="role-pill ${esc(p.role||'cadet')}">${esc(roleLabel(p.role))}</span></td><td>${esc(p.flight||'—')}</td><td>${fmtHours(sumService(p.id))}</td><td>${sumLeadership(p.id).toLocaleString()}</td><td>${esc(p.position||'—')}</td></tr>`).join('')||'<tr><td colspan="6" style="color:var(--muted)">No matching cadets.</td></tr>';
  $('cadetRosterCount').textContent=`Showing ${rows.length} of ${cadetRows.length}`;
}
function renderDetail(){
  const p=cadetRows.find(x=>x.id===selectedId);const box=$('cadetDetailBody');
  if(!p){box.innerHTML='<div class="detail-empty">Select a cadet to view their record.</div>';return}
  const sh=sumService(p.id),lp=sumLeadership(p.id);
  box.innerHTML=`<div class="detail-top"><h2>${esc(p.full_name||'Cadet')}</h2><p>${esc(p.rank||'Rank not assigned')} · ${esc(roleLabel(p.role))}${p.flight?' · '+esc(p.flight)+' Flight':''}</p></div><div class="detail-tabs"><button class="active" type="button">Overview</button><button type="button">Service Hours</button><button type="button">Leadership</button></div><div class="detail-body"><section class="detail-section"><div class="detail-section-head"><h3>Cadet Information</h3><button type="button" data-edit-cadet="${p.id}">Edit</button></div><div class="detail-grid"><div class="detail-field"><small>Role</small><b>${esc(roleLabel(p.role))}</b></div><div class="detail-field"><small>Rank</small><b>${esc(p.rank||'—')}</b></div><div class="detail-field"><small>Flight</small><b>${esc(p.flight||'—')}</b></div><div class="detail-field"><small>Position</small><b>${esc(p.position||'—')}</b></div></div></section><section class="detail-section"><div class="detail-section-head"><h3>Parent Contact</h3><button type="button" data-edit-cadet="${p.id}">Edit</button></div><div class="detail-grid"><div class="detail-field"><small>Parent Email</small><span>${esc(p.parent_email||'Not added')}</span></div><div class="detail-field"><small>Parent Phone</small><span>${esc(p.parent_phone||'Not added')}</span></div></div><p class="contact-note">Only parent email and parent phone are shown in Cadet Management.</p></section><section class="detail-section"><h3 style="margin-bottom:10px">Record Overview</h3><div class="metric-row"><div class="metric-box"><small>Service Hours</small><b>${fmtHours(sh)}</b></div><div class="metric-box"><small>Leadership Points</small><b>${lp.toLocaleString()}</b></div></div></section></div>`;
}
function openEdit(id){
 const p=cadetRows.find(x=>x.id===id);if(!p)return;
 $('cadetEditId').value=p.id;$('editName').value=p.full_name||'';$('editRole').value=p.role||'cadet';$('editRank').value=p.rank||'';$('editFlight').value=p.flight||'';$('editPosition').value=p.position||'';$('editParentEmail').value=p.parent_email||'';$('editParentPhone').value=p.parent_phone||'';$('cadetEditStatus').textContent='';$('cadetEditModal').classList.remove('hidden');
}
function closeEdit(){$('cadetEditModal').classList.add('hidden')}
async function saveEdit(e){
 e.preventDefault();const client=window.adminSupabase;if(!client)return;const id=$('cadetEditId').value;
 const payload={full_name:$('editName').value.trim(),role:$('editRole').value,rank:$('editRank').value.trim()||null,flight:$('editFlight').value.trim()||null,position:$('editPosition').value.trim()||null,parent_email:$('editParentEmail').value.trim()||null,parent_phone:$('editParentPhone').value.trim()||null};
 $('cadetEditStatus').textContent='Saving…';const {error}=await client.from('profiles').update(payload).eq('id',id);if(error){$('cadetEditStatus').textContent=error.message;return}$('cadetEditStatus').textContent='Saved.';await loadCadets();setTimeout(closeEdit,450)
}
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-section]');if(nav){showWorkspace(nav.dataset.section);return}
 const row=e.target.closest('[data-cadet-id]');if(row){selectedId=row.dataset.cadetId;renderRoster();renderDetail();return}
 const edit=e.target.closest('[data-edit-cadet]');if(edit){openEdit(edit.dataset.editCadet);return}
 if(e.target.closest('[data-close-cadet-edit]')){closeEdit();return}
});
$('cadetSearch')?.addEventListener('input',renderRoster);$('cadetRoleFilter')?.addEventListener('change',renderRoster);$('cadetFlightFilter')?.addEventListener('change',renderRoster);$('cadetEditForm')?.addEventListener('submit',saveEdit);
window.openCadetManagement=()=>showWorkspace('cadets');
})();