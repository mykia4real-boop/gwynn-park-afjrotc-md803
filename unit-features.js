(()=>{
const css=`<style id="unitFeaturesStyles">
.flight-info-wrap{margin-top:22px;display:grid;gap:16px}.flight-info-head{display:flex;align-items:end;justify-content:space-between;gap:14px;flex-wrap:wrap}.flight-info-head h2{margin:0;font-size:1.35rem}.flight-info-head p{margin:4px 0 0;color:#64748b}.flight-info-tabs{display:flex;gap:8px;flex-wrap:wrap}.flight-info-tabs button{border:1px solid #d7e0ea;background:#fff;color:#0b1f3a;border-radius:10px;padding:9px 12px;font-weight:800;cursor:pointer}.flight-info-tabs button.active{background:#0d3158;color:#fff;border-color:#0d3158}.flight-info-pane{display:none}.flight-info-pane.active{display:block}.unit-toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 16px}.unit-toolbar input{margin:0;max-width:320px}.cadet-directory-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.cadet-profile-card{background:#fff;border:1px solid #dce5ee;border-radius:16px;padding:15px;min-width:0}.cadet-profile-top{display:flex;gap:11px;align-items:center}.cadet-avatar{width:44px;height:44px;border-radius:50%;background:#0d3158;color:#fff;display:grid;place-items:center;font-weight:900;flex:0 0 auto}.cadet-profile-card h3{font-size:1rem;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cadet-profile-card small{color:#64748b}.cadet-facts{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.cadet-chip{font-size:.72rem;font-weight:800;background:#f1f5f9;border-radius:999px;padding:5px 8px}.chain-grid{display:grid;gap:12px}.chain-level{background:#fff;border:1px solid #dce5ee;border-radius:16px;padding:16px}.chain-level h3{font-size:1rem;margin:0 0 11px;color:#1d4f91}.chain-people{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.chain-person{border:1px solid #e5eaf0;border-radius:12px;padding:11px}.chain-person b{display:block}.chain-person small{color:#64748b}.empty-feature{color:#64748b;padding:10px 0}@media(max-width:900px){.cadet-directory-grid,.chain-people{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.cadet-directory-grid,.chain-people{grid-template-columns:1fr}}
</style>`;
let roster=[];let myFlight='';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=n=>(n||'Cadet').split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
function removeOld(){
  document.getElementById('cadetDirectoryNav')?.remove();
  document.getElementById('chainCommandNav')?.remove();
  document.getElementById('public-cadet-directory')?.remove();
  document.getElementById('public-chain-command')?.remove();
  document.querySelectorAll('.public-nav button,.public-nav a').forEach(el=>{const t=(el.textContent||'').trim().toLowerCase();if(t==='cadet directory'||t==='chain of command')el.remove()});
}
function inject(){
  removeOld();
  const flight=document.getElementById('public-flight');
  if(!flight||document.getElementById('flightInfoCombined'))return;
  if(!document.getElementById('unitFeaturesStyles'))document.head.insertAdjacentHTML('beforeend',css);
  flight.insertAdjacentHTML('beforeend',`<section id="flightInfoCombined" class="flight-info-wrap">
    <div class="flight-info-head"><div><h2>Flight People & Leadership</h2><p>Your flight roster and chain of command, all in one place.</p></div><div class="flight-info-tabs"><button class="active" type="button" data-flight-info-tab="roster">My Flight Roster</button><button type="button" data-flight-info-tab="chain">Chain of Command</button></div></div>
    <div class="flight-info-pane active" data-flight-info-pane="roster"><div class="unit-toolbar"><input id="flightRosterSearch" placeholder="Search your flight"></div><div id="flightRosterGrid" class="cadet-directory-grid"></div></div>
    <div class="flight-info-pane" data-flight-info-pane="chain"><div id="flightChainGrid" class="chain-grid"></div></div>
  </section>`);
  bind();
}
async function load(){
  if(!window.sb||!window.sessionUser)return;
  myFlight=window.currentProfile?.flight||'';
  const {data,error}=await sb.rpc('list_rank_roster');
  if(!error)roster=data||[];
  renderAll();
}
function renderRoster(){
  const grid=document.getElementById('flightRosterGrid');if(!grid)return;
  const q=(document.getElementById('flightRosterSearch')?.value||'').toLowerCase();
  let cadets=roster.filter(p=>p.role!=='instructor');
  if(myFlight)cadets=cadets.filter(p=>p.flight===myFlight);
  cadets=cadets.filter(p=>!q||`${p.full_name} ${p.cadet_rank||''} ${p.cadet_position||''}`.toLowerCase().includes(q));
  grid.innerHTML=cadets.map(p=>`<article class="cadet-profile-card"><div class="cadet-profile-top"><div class="cadet-avatar">${e(initials(p.full_name))}</div><div><h3>${e(p.full_name||'Cadet')}</h3><small>${e(p.cadet_rank||'Rank not assigned')}</small></div></div><div class="cadet-facts">${p.flight?`<span class="cadet-chip">${e(p.flight)} Flight</span>`:''}${p.cadet_position?`<span class="cadet-chip">${e(p.cadet_position)}</span>`:''}<span class="cadet-chip">${e((p.role||'cadet').replaceAll('_',' '))}</span></div></article>`).join('')||`<p class="empty-feature">${myFlight?'No cadets are listed in your flight yet.':'Your flight has not been assigned yet.'}</p>`;
}
function renderChain(){
  const box=document.getElementById('flightChainGrid');if(!box)return;
  const groups=[['Instructors',p=>p.role==='instructor'],['Command Staff',p=>p.role==='command_staff'],['My Flight Leadership',p=>p.flight===myFlight&&(p.role==='class_leader'||p.cadet_position)]];
  box.innerHTML=groups.map(([title,test])=>{const people=roster.filter(test);return `<section class="chain-level"><h3>${title}</h3><div class="chain-people">${people.map(p=>`<div class="chain-person"><b>${e(p.full_name||'Unit Member')}</b><small>${e(p.cadet_position||p.cadet_rank||title)}${p.flight?` • ${e(p.flight)} Flight`:''}</small></div>`).join('')||'<span class="empty-feature">No one assigned yet.</span>'}</div></section>`}).join('');
}
function renderAll(){renderRoster();renderChain()}
function bind(){
  document.getElementById('flightRosterSearch')?.addEventListener('input',renderRoster);
  document.addEventListener('click',ev=>{const b=ev.target.closest('[data-flight-info-tab]');if(!b)return;const name=b.dataset.flightInfoTab;document.querySelectorAll('[data-flight-info-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('[data-flight-info-pane]').forEach(x=>x.classList.toggle('active',x.dataset.flightInfoPane===name))});
  setTimeout(load,1000);
}
function init(){inject();setTimeout(()=>{removeOld();inject();load()},1500);setTimeout(removeOld,3000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();