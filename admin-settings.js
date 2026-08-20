(()=>{
const KEY='gphs_afjrotc_admin_settings_v1';
const defaults={compact:false,sidebar:'remember',defaultSection:'overview',confirmChanges:true,showVersion:true};
let settings={...defaults};
try{settings={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
const save=()=>localStorage.setItem(KEY,JSON.stringify(settings));

function css(){
  if(document.getElementById('adminSettingsStyles'))return;
  const s=document.createElement('style');
  s.id='adminSettingsStyles';
  s.textContent=`
    #admin-settings .page-head{margin-bottom:18px}
    .admin-settings-section-title{margin:4px 0 10px;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:#475569;font-weight:850}
    .admin-settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:20px}
    .admin-setting-card{background:#fff;border:1px solid #dce5ee;border-radius:16px;padding:18px;box-shadow:0 8px 24px rgba(15,23,42,.055)}
    .admin-setting-card h3{margin:0 0 5px;font-size:1rem}
    .admin-setting-card p{margin:0 0 14px;color:#64748b;font-size:.86rem;line-height:1.4}
    .admin-setting-row{display:flex;align-items:center;justify-content:space-between;gap:16px}
    .admin-setting-row select{width:auto;min-width:170px;margin:0}
    .admin-switch{position:relative;width:48px;height:28px;flex:0 0 auto;margin:0}
    .admin-switch input{position:absolute;opacity:0;width:1px;height:1px}
    .admin-switch span{position:absolute;inset:0;background:#cbd5e1;border-radius:999px;cursor:pointer;transition:.2s}
    .admin-switch span:after{content:'';position:absolute;width:22px;height:22px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 4px rgba(0,0,0,.15)}
    .admin-switch input:checked+span{background:#1d4f91}
    .admin-switch input:checked+span:after{transform:translateX(20px)}
    .admin-settings-note{margin-top:14px;padding:12px 14px;border-radius:12px;background:#f8fafc;color:#475569;font-size:.84rem}
    .admin-settings-site-panel{max-width:none!important;margin-top:0}
    .admin-settings-site-panel:before{content:'WEBSITE SETTINGS';display:block;margin-bottom:14px;font-size:.78rem;letter-spacing:.08em;color:#475569;font-weight:850}
    .admin-compact .admin-main .card,.admin-compact .admin-page .card,.admin-compact .admin-page .panel{padding:12px!important}
    .admin-compact .admin-main{gap:10px!important}
    .admin-compact .admin-top{padding-top:10px!important;padding-bottom:10px!important}
    @media(max-width:700px){.admin-settings-grid{grid-template-columns:1fr}.admin-setting-row{align-items:flex-start;flex-direction:column}.admin-setting-row select{width:100%;min-width:0}}
  `;
  document.head.appendChild(s);
}

function apply(){
  document.body.classList.toggle('admin-compact',!!settings.compact);
  const badge=document.getElementById('siteVersionWrap');
  if(badge)badge.style.display=settings.showVersion?'':'none';
  if(settings.sidebar==='collapsed'){
    document.body.classList.add('admin-sidebar-collapsed');
    document.body.classList.remove('admin-rail-open');
  }else if(settings.sidebar==='open'){
    document.body.classList.remove('admin-sidebar-collapsed');
    document.body.classList.add('admin-rail-open');
  }
}

function mount(){
  css();
  const page=document.getElementById('admin-settings');
  if(!page){apply();return}
  if(document.getElementById('adminPreferencesCombined')){apply();return}

  const oldHead=page.querySelector('.page-head');
  if(oldHead){
    const h=oldHead.querySelector('h1');
    const p=oldHead.querySelector('p');
    if(h)h.textContent='Settings';
    if(p)p.textContent='Manage website controls and your Admin Control Center preferences in one place.';
  }

  const existingPanel=page.querySelector('.panel');
  if(existingPanel)existingPanel.classList.add('admin-settings-site-panel');

  const prefs=document.createElement('div');
  prefs.id='adminPreferencesCombined';
  prefs.innerHTML=`
    <div class="admin-settings-section-title">Admin Preferences</div>
    <div class="admin-settings-grid">
      <article class="admin-setting-card"><div class="admin-setting-row"><div><h3>Compact admin layout</h3><p>Reduce spacing so more tools fit on screen.</p></div><label class="admin-switch"><input id="adminSetCompact" type="checkbox"><span></span></label></div></article>
      <article class="admin-setting-card"><div class="admin-setting-row"><div><h3>Admin sidebar</h3><p>Choose how the admin navigation opens.</p></div><select id="adminSetSidebar"><option value="remember">Remember last state</option><option value="open">Always open</option><option value="collapsed">Start collapsed</option></select></div></article>
      <article class="admin-setting-card"><div class="admin-setting-row"><div><h3>Default admin section</h3><p>Pick what you want to see first when opening Admin.</p></div><select id="adminSetDefault"><option value="overview">Overview</option><option value="todo">To-Do</option><option value="roles">Roles</option><option value="announcements">Announcements</option></select></div></article>
      <article class="admin-setting-card"><div class="admin-setting-row"><div><h3>Confirm important changes</h3><p>Ask before destructive or major admin actions.</p></div><label class="admin-switch"><input id="adminSetConfirm" type="checkbox"><span></span></label></div></article>
      <article class="admin-setting-card"><div class="admin-setting-row"><div><h3>Show site version badge</h3><p>Keep the version/status bubble visible in Admin.</p></div><label class="admin-switch"><input id="adminSetVersion" type="checkbox"><span></span></label></div></article>
      <article class="admin-setting-card"><h3>Reset admin preferences</h3><p>Return your personal admin display settings to their original defaults.</p><button id="adminSettingsReset" type="button" class="secondary">Reset Preferences</button></article>
    </div>
    <div class="admin-settings-note">Admin preferences are saved on this device. Website settings below are the unit-wide controls.</div>`;

  if(existingPanel)page.insertBefore(prefs,existingPanel);else page.appendChild(prefs);

  const q=id=>document.getElementById(id);
  q('adminSetCompact').checked=settings.compact;
  q('adminSetSidebar').value=settings.sidebar;
  q('adminSetDefault').value=settings.defaultSection;
  q('adminSetConfirm').checked=settings.confirmChanges;
  q('adminSetVersion').checked=settings.showVersion;
  q('adminSetCompact').onchange=e=>{settings.compact=e.target.checked;save();apply()};
  q('adminSetSidebar').onchange=e=>{settings.sidebar=e.target.value;save();apply()};
  q('adminSetDefault').onchange=e=>{settings.defaultSection=e.target.value;save()};
  q('adminSetConfirm').onchange=e=>{settings.confirmChanges=e.target.checked;save()};
  q('adminSetVersion').onchange=e=>{settings.showVersion=e.target.checked;save();apply()};
  q('adminSettingsReset').onclick=()=>{settings={...defaults};save();location.reload()};
  apply();
  setTimeout(apply,1200);
}

window.AFJROTCAdminSettings={get:()=>({...settings}),confirm:(message)=>settings.confirmChanges?window.confirm(message):true};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,1200));else setTimeout(mount,1200);
})();