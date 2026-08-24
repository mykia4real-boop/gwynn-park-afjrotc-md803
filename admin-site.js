(()=>{
  if(window.__afjrotcSiteManagement)return;
  window.__afjrotcSiteManagement=true;

  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slots=[['service_coat','Service Coat'],['lightweight_jacket','Lightweight Jacket'],['ocp','OCPs'],['pt_gear','PT Gear']];
  const pages=[
    {name:'Home',icon:'⌂',access:'Public',url:'/?open=home'},
    {name:'Announcements',icon:'◉',access:'Public',url:'/?open=announcements'},
    {name:'Calendar',icon:'▣',access:'Public',url:'/?open=calendar'},
    {name:'Community',icon:'□',access:'Public',url:'/?open=board'},
    {name:'Uniform Guide',icon:'◇',access:'Public',url:'/uniform.html'},
    {name:'Cadet Handbook',icon:'▤',access:'Public',url:'/handbook.html'},
    {name:'Resources',icon:'▤',access:'Public',url:'/?open=resources'},
    {name:'Service Hours',icon:'◷',access:'Account only',url:'/?open=service',locked:true},
    {name:'Gallery',icon:'▧',access:'Public',url:'/?open=gallery'},
    {name:'My Flight',icon:'✈',access:'Account only',url:'/?open=flight',locked:true},
    {name:'Ranks & Info',icon:'☆',access:'Public · Handbook section',url:'/handbook.html#ranks'}
  ];
  let sb=null,uniformRows=[],handbookRows=[],alertRows=[],resourceRows=[],profileRows=[],currentUser=null;
  let activeTab='pages',editingAlertId=null,editingResourceId=null,activityExpanded=false,linkHealth={state:'checking',broken:0};

  const safe=async(p,f=[])=>{try{const {data,error}=await p;if(error)throw error;return data??f}catch(e){console.warn('Site Management query failed',e);return f}};
  const pub=path=>sb.storage.from('uniform-guide').getPublicUrl(path).data.publicUrl;
  const personName=id=>profileRows.find(p=>p.id===id)?.full_name||'';
  const fmtDateTime=v=>v?new Date(v).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}):'—';
  const toLocalInput=v=>{if(!v)return'';const d=new Date(v);if(Number.isNaN(d.getTime()))return'';const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,16)};
  const isAlertActive=a=>{const now=Date.now(),start=new Date(a.starts_at||0).getTime(),end=a.ends_at?new Date(a.ends_at).getTime():Infinity;return !!a.active&&start<=now&&end>=now};

  function loadTaskWorkspace(){
    if(window.__afjrotcTaskWorkspace||document.querySelector('script[data-admin-tasks]'))return;
    const s=document.createElement('script');s.src='/admin-tasks.js?v=2';s.async=false;s.dataset.adminTasks='1';document.body.appendChild(s);
  }

  function removeLegacy(){
    document.querySelectorAll('.bottom-grid').forEach(grid=>{
      const panel=[...grid.querySelectorAll('.panel')].find(p=>p.querySelector('h2')?.textContent.trim()==='Site Management');
      if(!panel)return;
      if(grid.querySelectorAll('.panel').length===1)grid.remove();else panel.remove();
    });
    ['uniformPhotoToolModal','siteToolsModal'].forEach(id=>document.getElementById(id)?.remove());
  }

  function ensureNav(){
    const nav=document.querySelector('.admin-nav');if(!nav)return;
    let btn=nav.querySelector('[data-task-site-management]');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.dataset.taskSiteManagement='1';nav.appendChild(btn)}
    btn.innerHTML='<span>◎</span><span>Site Management</span>';
  }

  function ensureWorkspace(){
    if($('siteWorkspace'))return;
    const main=document.querySelector('.admin-main');if(!main)return;
    main.insertAdjacentHTML('beforeend',`<section id="siteWorkspace" class="site-workspace hidden">
      <header class="sm-head"><h1>Site Management</h1><p>Manage the structure, appearance, resources, and public-facing settings of the AFJROTC website.</p></header>
      <section class="sm-summary">
        <article class="sm-summary-card"><div class="sm-summary-icon">◇</div><div class="sm-summary-copy"><small>Uniform Guide</small><b id="smUniformCount">0 / 4</b><span>photos</span></div><span id="smUniformCheck" class="sm-check">✓</span></article>
        <article class="sm-summary-card"><div class="sm-summary-icon">▤</div><div class="sm-summary-copy"><small>Cadet Handbook</small><b id="smHandbookState">—</b><span>connected</span></div><span id="smHandbookCheck" class="sm-check">✓</span></article>
        <article class="sm-summary-card"><div class="sm-summary-icon">◉</div><div class="sm-summary-copy"><small>Site Alerts</small><b id="smAlertCount">0</b><span>active</span></div><span class="sm-check">✓</span></article>
        <article class="sm-summary-card"><div class="sm-summary-icon">▤</div><div class="sm-summary-copy"><small>Resources</small><b id="smResourceCount">0</b><span>published</span></div><span class="sm-check">✓</span></article>
      </section>
      <div class="sm-layout">
        <section class="sm-main-panel">
          <nav class="sm-tabs" aria-label="Site Management sections">
            <button type="button" class="active" data-sm-tab="pages">Pages & Content</button>
            <button type="button" data-sm-tab="uniform">Uniform Guide</button>
            <button type="button" data-sm-tab="handbook">Handbook</button>
            <button type="button" data-sm-tab="alerts">Alerts</button>
            <button type="button" data-sm-tab="resources">Resources</button>
            <button type="button" data-sm-tab="access">Access</button>
          </nav>
          <div class="sm-pane active" data-sm-pane="pages"></div>
          <div class="sm-pane" data-sm-pane="uniform"></div>
          <div class="sm-pane" data-sm-pane="handbook"></div>
          <div class="sm-pane" data-sm-pane="alerts"></div>
          <div class="sm-pane" data-sm-pane="resources"></div>
          <div class="sm-pane" data-sm-pane="access"></div>
        </section>
        <aside class="sm-side">
          <section class="sm-side-card"><h2>◇ Website Health</h2><div id="smHealthList" class="sm-health-list"></div><div id="smLastUpdate" class="sm-last-update"></div></section>
          <section class="sm-side-card"><h2>◷ Recent Activity</h2><div id="smActivityList" class="sm-activity-list"></div><button id="smActivityMore" class="sm-more sm-hidden" type="button">Show all activity</button></section>
        </aside>
      </div>
    </section>`);
  }

  function hideSite(){$('siteWorkspace')?.classList.add('hidden')}
  function hideOtherWorkspaces(){
    document.querySelectorAll('.command-head,.stats-grid,.dashboard-grid,.bottom-grid,#cadetWorkspace,#contentWorkspace,#taskWorkspace').forEach(x=>x.classList.add('hidden'));
  }
  async function showSite(tab=activeTab){
    ensureWorkspace();ensureNav();removeLegacy();
    hideOtherWorkspaces();
    document.querySelectorAll('.admin-nav button').forEach(b=>b.classList.remove('active'));
    document.querySelector('[data-task-site-management]')?.classList.add('active');
    $('siteWorkspace')?.classList.remove('hidden');
    switchTab(tab);
    await loadAll();
  }

  function switchTab(tab){
    if(!['pages','uniform','handbook','alerts','resources','access'].includes(tab))tab='pages';
    activeTab=tab;
    document.querySelectorAll('[data-sm-tab]').forEach(b=>b.classList.toggle('active',b.dataset.smTab===tab));
    document.querySelectorAll('[data-sm-pane]').forEach(p=>p.classList.toggle('active',p.dataset.smPane===tab));
    renderActivePane();
  }

  async function loadAll(){
    if(!sb)return;
    const [u,h,a,r,p,userResult]=await Promise.all([
      safe(sb.from('uniform_guide_images').select('*').order('slot')),
      safe(sb.from('handbook_sections').select('*').order('section_key')),
      safe(sb.from('site_alerts').select('*').order('created_at',{ascending:false})),
      safe(sb.from('resources').select('*').order('created_at',{ascending:false})),
      safe(sb.from('profiles').select('id,full_name,role').order('full_name')),
      sb.auth.getUser()
    ]);
    uniformRows=u;handbookRows=h;alertRows=a;resourceRows=r;profileRows=p;currentUser=userResult?.data?.user||null;
    renderSummary();renderActivePane();renderHealth();renderActivity();
    checkInternalRoutes();
  }

  function renderSummary(){
    const filled=new Set(uniformRows.map(x=>x.slot)).size,activeAlerts=alertRows.filter(isAlertActive).length;
    if($('smUniformCount'))$('smUniformCount').textContent=`${filled} / 4`;
    if($('smUniformCheck')){$('smUniformCheck').textContent=filled===4?'✓':'!';$('smUniformCheck').style.borderColor=filled===4?'#44d675':'#ffd43b';$('smUniformCheck').style.color=filled===4?'#44d675':'#ffd43b'}
    if($('smHandbookState'))$('smHandbookState').textContent=handbookRows.length?'Up to date':'Needs setup';
    if($('smHandbookCheck')){$('smHandbookCheck').textContent=handbookRows.length?'✓':'!';$('smHandbookCheck').style.borderColor=handbookRows.length?'#44d675':'#ffd43b';$('smHandbookCheck').style.color=handbookRows.length?'#44d675':'#ffd43b'}
    if($('smAlertCount'))$('smAlertCount').textContent=activeAlerts;
    if($('smResourceCount'))$('smResourceCount').textContent=resourceRows.length;
  }

  function renderActivePane(){
    const pane=document.querySelector(`[data-sm-pane="${activeTab}"]`);if(!pane)return;
    if(activeTab==='pages')renderPages(pane);
    else if(activeTab==='uniform')renderUniform(pane);
    else if(activeTab==='handbook')renderHandbook(pane);
    else if(activeTab==='alerts')renderAlerts(pane);
    else if(activeTab==='resources')renderResources(pane);
    else renderAccess(pane);
  }

  function renderPages(pane){
    pane.innerHTML=`<div class="sm-pane-head"><div><h2>Approved Website Pages</h2><p>View the website pages and their current access settings. Navigation is locked to the approved page set so old or unapproved tabs cannot return.</p></div><input id="smPageSearch" class="sm-search" type="search" placeholder="Search pages"></div><div class="sm-page-table-wrap"><table class="sm-table"><thead><tr><th>Page</th><th>Access</th><th>Status</th><th></th></tr></thead><tbody id="smPageBody"></tbody></table></div>`;
    renderPageRows();
  }
  function renderPageRows(){
    const body=$('smPageBody');if(!body)return;const q=($('smPageSearch')?.value||'').trim().toLowerCase();
    const rows=pages.filter(p=>!q||`${p.name} ${p.access}`.toLowerCase().includes(q));
    body.innerHTML=rows.map(p=>`<tr tabindex="0" role="link" data-sm-page="${esc(p.url)}"><td><div class="sm-page-name"><span class="sm-page-icon">${esc(p.icon)}</span>${esc(p.name)}</div></td><td><span class="sm-access ${p.locked?'sm-lock':''}">${esc(p.access)}${p.locked?' 🔒':''}</span></td><td><span class="sm-status-active">Active</span></td><td class="sm-row-arrow">›</td></tr>`).join('')||'<tr><td colspan="4" class="sm-empty">No matching pages.</td></tr>';
  }

  function uniformRow(slot){return uniformRows.find(x=>x.slot===slot)||null}
  function renderUniform(pane){
    pane.innerHTML=`<div class="sm-pane-head"><div><h2>Uniform Guide</h2><p>Upload or replace the four approved uniform reference photos. Changes appear on the public Uniform Guide.</p></div></div><div class="sm-grid">${slots.map(([slot,label])=>{const r=uniformRow(slot);return `<article class="sm-card"><h3>${esc(label)}</h3><div class="sm-uniform-preview">${r?`<img src="${esc(pub(r.storage_path))}" alt="${esc(r.alt_text||label)}">`:'No photo uploaded'}</div><label>Photo<input id="smUniformFile-${slot}" type="file" accept="image/png,image/jpeg,image/webp"></label><label>Alt text<input id="smUniformAlt-${slot}" value="${esc(r?.alt_text||label+' uniform reference photo')}"></label><div class="sm-uniform-actions"><button class="sm-btn primary" type="button" data-sm-upload-uniform="${slot}">${r?'Replace Photo':'Upload Photo'}</button>${r?`<button class="sm-btn danger" type="button" data-sm-remove-uniform="${slot}">Remove</button>`:''}</div><div id="smUniformStatus-${slot}" class="sm-status"></div></article>`}).join('')}</div>`;
  }

  function renderHandbook(pane){
    pane.innerHTML=`<div class="sm-pane-head"><div><h2>Cadet Handbook</h2><p>Edit the handbook sections cadets see on the public Handbook page.</p></div></div><div class="sm-editor-list">${handbookRows.map(x=>`<article class="sm-editor-section"><h3>${esc(x.section_key.replaceAll('_',' '))}</h3><label>Section Title<input data-sm-hb-title="${esc(x.section_key)}" value="${esc(x.title)}"></label><label>Content<textarea rows="5" data-sm-hb-body="${esc(x.section_key)}">${esc(x.body)}</textarea></label></article>`).join('')||'<p class="sm-empty">No handbook sections are connected.</p>'}</div>${handbookRows.length?'<div class="sm-save-row"><span id="smHandbookStatus" class="sm-status"></span><button class="sm-btn primary" type="button" data-sm-save-handbook>Save Handbook Changes</button></div>':''}`;
  }

  function renderAlerts(pane){
    const edit=alertRows.find(x=>x.id===editingAlertId)||null;
    pane.innerHTML=`<div class="sm-pane-head"><div><h2>Site Alerts</h2><p>Create banners for closures, reminders, inspections, or urgent site notices.</p></div></div><article class="sm-card"><h3>${edit?'Edit Site Alert':'Create Site Alert'}</h3><form id="smAlertForm" class="sm-form"><label class="full">Title<input id="smAlertTitle" required maxlength="120" value="${esc(edit?.title||'')}"></label><label class="full">Message<textarea id="smAlertMessage" required maxlength="600">${esc(edit?.message||'')}</textarea></label><label>Level<select id="smAlertLevel"><option value="info" ${edit?.level==='info'?'selected':''}>Info</option><option value="important" ${edit?.level==='important'?'selected':''}>Important</option><option value="urgent" ${edit?.level==='urgent'?'selected':''}>Urgent</option></select></label><label>Active<select id="smAlertActive"><option value="true" ${!edit||edit.active?'selected':''}>Active</option><option value="false" ${edit&&!edit.active?'selected':''}>Inactive</option></select></label><label>Start<input id="smAlertStart" type="datetime-local" value="${esc(toLocalInput(edit?.starts_at))}"></label><label>End<input id="smAlertEnd" type="datetime-local" value="${esc(toLocalInput(edit?.ends_at))}"></label><div id="smAlertStatus" class="sm-status"></div><div class="sm-form-actions">${edit?'<button class="sm-btn" type="button" data-sm-cancel-alert>Cancel Edit</button>':''}<button class="sm-btn primary" type="submit">${edit?'Save Alert':'Publish Alert'}</button></div></form></article><div class="sm-list">${alertRows.map(a=>`<article class="sm-list-row selectable" data-sm-edit-alert="${a.id}"><div><b>${esc(a.title)}</b><span>${esc(a.message)}</span><span>${fmtDateTime(a.starts_at)}${a.ends_at?' → '+fmtDateTime(a.ends_at):''}</span><span class="sm-pill ${a.active?'active':'inactive'}">${a.active?'Active':'Inactive'}</span> <span class="sm-pill ${esc(a.level)}">${esc(a.level)}</span></div><div class="sm-list-actions"><button class="sm-btn" type="button" data-sm-toggle-alert="${a.id}" data-next="${a.active?'false':'true'}">${a.active?'Disable':'Enable'}</button><button class="sm-btn danger" type="button" data-sm-delete-alert="${a.id}">Delete</button></div></article>`).join('')||'<p class="sm-empty">No site alerts.</p>'}</div>`;
  }

  function renderResources(pane){
    const edit=resourceRows.find(x=>String(x.id)===String(editingResourceId))||null;
    pane.innerHTML=`<div class="sm-pane-head"><div><h2>Resources</h2><p>Manage the links, forms, training material, and reference resources shown to cadets.</p></div></div><article class="sm-card"><h3>${edit?'Edit Resource':'Add Resource'}</h3><form id="smResourceForm" class="sm-form"><label class="full">Resource Title<input id="smResourceTitle" required maxlength="160" value="${esc(edit?.title||'')}"></label><label>Category<select id="smResourceCategory">${['Handbook','Forms','Training','Uniform','Drill','Service','General','Other'].map(x=>`<option ${((edit?.category||'General')===x)?'selected':''}>${x}</option>`).join('')}</select></label><label>Link<input id="smResourceUrl" type="url" placeholder="https://…" value="${esc(edit?.url||'')}"></label><label class="full">Description<textarea id="smResourceDescription" rows="3" maxlength="700">${esc(edit?.description||'')}</textarea></label><div id="smResourceStatus" class="sm-status"></div><div class="sm-form-actions">${edit?'<button class="sm-btn" type="button" data-sm-cancel-resource>Cancel Edit</button>':''}<button class="sm-btn primary" type="submit">${edit?'Save Resource':'Add Resource'}</button></div></form></article><div class="sm-list">${resourceRows.map(r=>`<article class="sm-list-row selectable" data-sm-edit-resource="${r.id}"><div><b>${esc(r.title||'Untitled resource')}</b><span>${esc(r.category||'General')}${r.description?' · '+esc(r.description):''}</span>${r.url?`<span>${esc(r.url)}</span>`:''}</div><div class="sm-list-actions"><button class="sm-btn danger" type="button" data-sm-delete-resource="${r.id}">Delete</button></div></article>`).join('')||'<p class="sm-empty">No resources yet.</p>'}</div>`;
  }

  function renderAccess(pane){
    const counts={cadet:0,class_leader:0,command_staff:0,instructor:0};profileRows.forEach(p=>{if(Object.prototype.hasOwnProperty.call(counts,p.role))counts[p.role]++});
    pane.innerHTML=`<div class="sm-pane-head"><div><h2>Access</h2><p>Review who can use account-only areas. Website page visibility is intentionally locked to the approved navigation so old tabs cannot be re-enabled by accident.</p></div></div><div class="sm-note">Role changes are managed in Cadet Management. Site Management shows the access structure without creating a second place to edit the same account role.</div><div class="sm-access-grid"><article class="sm-access-card"><h3>Public Visitors</h3><p>Home, Announcements, Calendar, Community, Uniform Guide, Handbook, Resources, Gallery, and Ranks information.</p><b>Open</b></article><article class="sm-access-card"><h3>Cadets</h3><p>Public pages plus Cadet Dashboard, Service Hours, My Flight, and account features.</p><b>${counts.cadet}</b></article><article class="sm-access-card"><h3>Class Leaders</h3><p>Cadet access with approved flight/class leadership features.</p><b>${counts.class_leader}</b></article><article class="sm-access-card"><h3>Command Staff</h3><p>Cadet access plus Command Center and site-management permissions.</p><b>${counts.command_staff}</b></article><article class="sm-access-card"><h3>Instructors</h3><p>Instructor navigation plus Command Center and management permissions.</p><b>${counts.instructor}</b></article></div><button class="sm-access-jump" type="button" data-sm-open-cadet-roles><span><b>Manage Account Roles</b><span>Open the Roles & Positions view in Cadet Management.</span></span><strong>›</strong></button>`;
  }

  function latestUpdate(){
    const times=[...uniformRows.map(x=>x.updated_at),...handbookRows.map(x=>x.updated_at),...alertRows.map(x=>x.updated_at||x.created_at),...resourceRows.map(x=>x.updated_at||x.created_at)].filter(Boolean).map(x=>new Date(x).getTime()).filter(Number.isFinite);
    return times.length?new Date(Math.max(...times)):null;
  }
  function renderHealth(){
    const box=$('smHealthList');if(!box)return;const filled=new Set(uniformRows.map(x=>x.slot)).size,handbookOk=handbookRows.length>0;
    const linkClass=linkHealth.state==='checking'?'warn':linkHealth.broken?'bad':'';
    const linkIcon=linkHealth.state==='checking'?'…':linkHealth.broken?'!':'✓';
    const linkText=linkHealth.state==='checking'?'Checking internal routes…':linkHealth.broken?`${linkHealth.broken} internal route${linkHealth.broken===1?'':'s'} need attention`:'No internal route problems detected';
    box.innerHTML=`<div class="sm-health-row"><span class="sm-health-dot">✓</span><div><b>Navigation</b><span>One approved navigation set</span></div></div><div class="sm-health-row"><span class="sm-health-dot ${filled===4?'':'warn'}">${filled===4?'✓':'!'}</span><div><b>Uniform Guide</b><span>${filled===4?'All required photo slots filled':`${4-filled} photo slot${4-filled===1?'':'s'} missing`}</span></div></div><div class="sm-health-row"><span class="sm-health-dot ${handbookOk?'':'warn'}">${handbookOk?'✓':'!'}</span><div><b>Handbook</b><span>${handbookOk?'Connected':'No handbook sections found'}</span></div></div><div class="sm-health-row"><span class="sm-health-dot ${linkClass}">${linkIcon}</span><div><b>Broken Links</b><span>${linkText}</span></div></div>`;
    const last=latestUpdate();$('smLastUpdate').innerHTML=`<span>▣</span><div><b>Last Site Update</b><span>${last?fmtDateTime(last):'No site updates recorded'}</span></div>`;
  }

  function activityItems(){
    const items=[];
    uniformRows.forEach(x=>items.push({t:x.updated_at,icon:'◇',label:`${slots.find(s=>s[0]===x.slot)?.[1]||'Uniform'} photo updated`,tab:'uniform',actor:x.updated_by}));
    handbookRows.forEach(x=>items.push({t:x.updated_at,icon:'▤',label:`Handbook section updated · ${x.title}`,tab:'handbook',actor:x.updated_by}));
    alertRows.forEach(x=>items.push({t:x.updated_at||x.created_at,icon:'◉',label:`Site alert · ${x.title}`,tab:'alerts',actor:x.updated_by||x.created_by}));
    resourceRows.forEach(x=>items.push({t:x.updated_at||x.created_at,icon:'▤',label:`Resource · ${x.title}`,tab:'resources',actor:x.updated_by||x.author_id}));
    return items.filter(x=>x.t).sort((a,b)=>new Date(b.t)-new Date(a.t));
  }
  function renderActivity(){
    const box=$('smActivityList'),more=$('smActivityMore');if(!box||!more)return;const all=activityItems(),rows=activityExpanded?all.slice(0,12):all.slice(0,5);
    box.innerHTML=rows.map(x=>`<button class="sm-activity-row" type="button" data-sm-activity-tab="${x.tab}"><span>${esc(x.icon)}</span><span><b>${esc(x.label)}</b><span>${esc(fmtDateTime(x.t))}${personName(x.actor)?' · '+esc(personName(x.actor)):''}</span></span></button>`).join('')||'<p class="sm-empty">No recent site-management activity.</p>';
    more.classList.toggle('sm-hidden',all.length<=5);more.textContent=activityExpanded?'Show less':'Show all activity';
  }

  async function checkInternalRoutes(){
    if(linkHealth.state==='done')return;
    linkHealth={state:'checking',broken:0};renderHealth();
    const urls=['/','/uniform.html','/handbook.html'];let broken=0;
    await Promise.all(urls.map(async url=>{try{let r=await fetch(url,{method:'HEAD',cache:'no-store'});if(r.status===405)r=await fetch(url,{method:'GET',cache:'no-store'});if(!r.ok)broken++}catch{broken++}}));
    linkHealth={state:'done',broken};renderHealth();
  }

  async function uploadUniform(slot){
    const file=$(`smUniformFile-${slot}`)?.files?.[0],status=$(`smUniformStatus-${slot}`);if(!status)return;
    if(!file){status.textContent='Choose a photo first.';status.classList.add('error');return}
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){status.textContent='Use a JPG, PNG, or WebP image.';status.classList.add('error');return}
    if(file.size>8*1024*1024){status.textContent='Photo must be under 8 MB.';status.classList.add('error');return}
    status.classList.remove('error');status.textContent='Uploading…';
    const path=`${slot}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`,old=uniformRow(slot)?.storage_path;
    const up=await sb.storage.from('uniform-guide').upload(path,file,{upsert:false});if(up.error){status.textContent=up.error.message;status.classList.add('error');return}
    const alt=$(`smUniformAlt-${slot}`)?.value.trim()||`${slots.find(x=>x[0]===slot)?.[1]||'Uniform'} uniform reference photo`;
    const q=await sb.from('uniform_guide_images').upsert({slot,storage_path:path,alt_text:alt,updated_at:new Date().toISOString(),updated_by:currentUser?.id||null},{onConflict:'slot'});
    if(q.error){await sb.storage.from('uniform-guide').remove([path]);status.textContent=q.error.message;status.classList.add('error');return}
    if(old&&old!==path)await sb.storage.from('uniform-guide').remove([old]);
    await loadAll();switchTab('uniform');
  }
  async function removeUniform(slot){
    const row=uniformRow(slot);if(!row||!confirm(`Remove the ${slots.find(x=>x[0]===slot)?.[1]||'uniform'} photo?`))return;
    const {error}=await sb.from('uniform_guide_images').delete().eq('slot',slot);if(error){alert(error.message);return}
    await sb.storage.from('uniform-guide').remove([row.storage_path]);await loadAll();switchTab('uniform');
  }

  async function saveHandbook(){
    const status=$('smHandbookStatus');if(!status)return;status.textContent='Saving…';status.classList.remove('error');
    const results=await Promise.all(handbookRows.map(row=>{const title=document.querySelector(`[data-sm-hb-title="${CSS.escape(row.section_key)}"]`)?.value.trim()||row.title,body=document.querySelector(`[data-sm-hb-body="${CSS.escape(row.section_key)}"]`)?.value.trim()||'';return sb.from('handbook_sections').update({title,body,updated_at:new Date().toISOString(),updated_by:currentUser?.id||null}).eq('section_key',row.section_key)}));
    const errors=results.filter(x=>x.error).map(x=>x.error.message);if(errors.length){status.textContent=`${errors.length} section${errors.length===1?'':'s'} could not be saved: ${errors[0]}`;status.classList.add('error');return}
    status.textContent='Handbook changes saved.';await loadAll();switchTab('handbook');
  }

  function editAlert(id){editingAlertId=id;switchTab('alerts');setTimeout(()=>$('smAlertTitle')?.focus(),20)}
  function cancelAlert(){editingAlertId=null;switchTab('alerts')}
  async function saveAlert(e){
    e.preventDefault();const status=$('smAlertStatus');status.textContent='Saving…';status.classList.remove('error');
    if(!currentUser){status.textContent='Your session expired. Refresh and sign in again.';status.classList.add('error');return}
    const payload={title:$('smAlertTitle').value.trim(),message:$('smAlertMessage').value.trim(),level:$('smAlertLevel').value,active:$('smAlertActive').value==='true',starts_at:$('smAlertStart').value?new Date($('smAlertStart').value).toISOString():new Date().toISOString(),ends_at:$('smAlertEnd').value?new Date($('smAlertEnd').value).toISOString():null,updated_by:currentUser.id};
    let q;if(editingAlertId)q=sb.from('site_alerts').update(payload).eq('id',editingAlertId);else q=sb.from('site_alerts').insert({...payload,created_by:currentUser.id});
    const {error}=await q;if(error){status.textContent=error.message;status.classList.add('error');return}
    editingAlertId=null;await loadAll();switchTab('alerts');
  }
  async function toggleAlert(id,next){const {error}=await sb.from('site_alerts').update({active:next,updated_by:currentUser?.id||null}).eq('id',id);if(error){alert(error.message);return}await loadAll();switchTab('alerts')}
  async function deleteAlert(id){if(!confirm('Delete this site alert?'))return;const {error}=await sb.from('site_alerts').delete().eq('id',id);if(error){alert(error.message);return}if(editingAlertId===id)editingAlertId=null;await loadAll();switchTab('alerts')}

  function editResource(id){editingResourceId=String(id);switchTab('resources');setTimeout(()=>$('smResourceTitle')?.focus(),20)}
  function cancelResource(){editingResourceId=null;switchTab('resources')}
  async function saveResource(e){
    e.preventDefault();const status=$('smResourceStatus');status.textContent='Saving…';status.classList.remove('error');
    if(!currentUser){status.textContent='Your session expired. Refresh and sign in again.';status.classList.add('error');return}
    const payload={title:$('smResourceTitle').value.trim(),category:$('smResourceCategory').value,url:$('smResourceUrl').value.trim()||null,description:$('smResourceDescription').value.trim()||null,updated_by:currentUser.id};
    let q;if(editingResourceId)q=sb.from('resources').update(payload).eq('id',editingResourceId);else q=sb.from('resources').insert({...payload,author_id:currentUser.id});
    const {error}=await q;if(error){status.textContent=error.message;status.classList.add('error');return}
    editingResourceId=null;await loadAll();switchTab('resources');
  }
  async function deleteResource(id){if(!confirm('Delete this resource?'))return;const {error}=await sb.from('resources').delete().eq('id',id);if(error){alert(error.message);return}if(String(editingResourceId)===String(id))editingResourceId=null;await loadAll();switchTab('resources')}

  function openCadetRoles(){
    hideSite();
    if(window.openCadetManagement)window.openCadetManagement();else document.querySelector('[data-section="cadets"]')?.click();
    setTimeout(()=>{const b=document.querySelector('[data-roster-tab="roles"]')||document.querySelector('.roster-tabs button:nth-child(2)');b?.click()},180);
  }

  function bind(){
    window.addEventListener('click',e=>{
      const site=e.target.closest?.('[data-task-site-management]');
      if(site){e.preventDefault();e.stopImmediatePropagation();showSite();return}
      const nav=e.target.closest?.('.admin-nav [data-section]');if(nav)hideSite();
    },true);
    document.addEventListener('click',e=>{
      const tab=e.target.closest('[data-sm-tab]');if(tab){switchTab(tab.dataset.smTab);return}
      const page=e.target.closest('[data-sm-page]');if(page){window.open(page.dataset.smPage,'_blank','noopener');return}
      const up=e.target.closest('[data-sm-upload-uniform]');if(up){uploadUniform(up.dataset.smUploadUniform);return}
      const rm=e.target.closest('[data-sm-remove-uniform]');if(rm){removeUniform(rm.dataset.smRemoveUniform);return}
      if(e.target.closest('[data-sm-save-handbook]')){saveHandbook();return}
      const ta=e.target.closest('[data-sm-toggle-alert]');if(ta){e.stopPropagation();toggleAlert(ta.dataset.smToggleAlert,ta.dataset.next==='true');return}
      const da=e.target.closest('[data-sm-delete-alert]');if(da){e.stopPropagation();deleteAlert(da.dataset.smDeleteAlert);return}
      const ea=e.target.closest('[data-sm-edit-alert]');if(ea){editAlert(ea.dataset.smEditAlert);return}
      if(e.target.closest('[data-sm-cancel-alert]')){cancelAlert();return}
      const dr=e.target.closest('[data-sm-delete-resource]');if(dr){e.stopPropagation();deleteResource(dr.dataset.smDeleteResource);return}
      const er=e.target.closest('[data-sm-edit-resource]');if(er){editResource(er.dataset.smEditResource);return}
      if(e.target.closest('[data-sm-cancel-resource]')){cancelResource();return}
      if(e.target.closest('[data-sm-open-cadet-roles]')){openCadetRoles();return}
      const activity=e.target.closest('[data-sm-activity-tab]');if(activity){switchTab(activity.dataset.smActivityTab);return}
      if(e.target.closest('#smActivityMore')){activityExpanded=!activityExpanded;renderActivity();return}
    });
    document.addEventListener('submit',e=>{if(e.target.id==='smAlertForm')saveAlert(e);else if(e.target.id==='smResourceForm')saveResource(e)});
    document.addEventListener('input',e=>{if(e.target.id==='smPageSearch')renderPageRows()});
    document.addEventListener('keydown',e=>{const row=e.target.closest?.('[data-sm-page]');if(row&&(e.key==='Enter'||e.key===' ')){e.preventDefault();window.open(row.dataset.smPage,'_blank','noopener')}});
  }

  async function init(){
    sb=window.adminSupabase;
    if(!sb){setTimeout(init,80);return}
    removeLegacy();ensureNav();ensureWorkspace();bind();loadTaskWorkspace();await loadAll();
    window.openSiteManagement=()=>showSite(activeTab);
  }
  init();
})();