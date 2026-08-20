(()=>{
  const ADMIN_ROLES=['admin','instructor','command_staff'];
  function addStyles(){
    if(document.getElementById('sitePolish55Styles')) return;
    const s=document.createElement('style');
    s.id='sitePolish55Styles';
    s.textContent=`
      .guide-page{max-width:1180px;margin:0 auto;padding:34px 38px 56px}.guide-hero{background:linear-gradient(135deg,#071b36,#173f6b);color:#fff;border-radius:22px;padding:34px;margin-bottom:22px}.guide-hero .eyebrow{color:#ffd83d}.guide-hero h1{font-size:clamp(32px,4vw,52px);margin:4px 0 10px}.guide-hero p{max-width:760px;color:#dce6f2;line-height:1.6}.guide-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.guide-card{background:#fff;border:1px solid #dfe7f0;border-radius:18px;padding:22px;box-shadow:0 10px 28px rgba(15,23,42,.05)}.guide-card h2,.guide-card h3{color:#071b36;margin:0 0 10px}.guide-card p,.guide-card li{color:#53667d;line-height:1.55}.guide-card ul{padding-left:20px;margin:10px 0}.guide-wide{grid-column:1/-1}.guide-chip{display:inline-flex;align-items:center;border-radius:999px;background:#fff4bd;color:#6e5500;font-size:12px;font-weight:900;padding:6px 9px;margin-bottom:10px}.guide-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.guide-actions button{border:0;border-radius:10px;padding:11px 15px;font-weight:900;cursor:pointer}.guide-actions .primary-guide{background:#ffd83d;color:#071528}.guide-actions .secondary-guide{background:#eaf0f7;color:#071b36}.public-nav .guide-nav-button{font-weight:800!important}.site-switch-admin,#adminPortalBtn{background:#ffd83d!important;color:#071528!important;border-color:#ffd83d!important;font-weight:900!important}.admin-side .back-btn{background:#ffd83d!important;color:#071528!important;border-color:#ffd83d!important;font-weight:900!important}.home-footer{grid-template-columns:1.2fr 1fr 1fr 1fr!important}.home-footer .home-footer-school{font-weight:900;color:#fff;font-size:15px}.home-footer .footer-mini-links button{display:block;width:100%;margin:6px 0 0}.footer-build-line{display:none!important}@media(max-width:900px){.guide-page{padding:24px 18px 44px}.guide-grid{grid-template-columns:1fr}.guide-wide{grid-column:auto}.home-footer{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(s);
  }
  function showPage(page){
    document.querySelectorAll('.public-page').forEach(p=>p.classList.remove('active'));
    document.getElementById('public-'+page)?.classList.add('active');
    document.querySelectorAll('[data-public]').forEach(b=>b.classList.toggle('active',b.dataset.public===page));
    window.scrollTo(0,0);
  }
  function addNavButton(nav,page,label,icon,beforeSelector){
    if(!nav || nav.querySelector(`[data-public="${page}"]`)) return;
    const b=document.createElement('button');
    b.type='button';b.dataset.public=page;b.dataset.shellIcon=icon;b.textContent=label;b.className='guide-nav-button';
    b.addEventListener('click',()=>showPage(page));
    const before=beforeSelector?nav.querySelector(beforeSelector):null;
    before?nav.insertBefore(b,before):nav.appendChild(b);
  }
  function buildGuides(){
    const main=document.getElementById('publicSite'); if(!main) return;
    if(!document.getElementById('public-handbook')){
      const s=document.createElement('section');s.id='public-handbook';s.className='public-page';
      s.innerHTML=`<div class="guide-page"><div class="guide-hero"><p class="eyebrow">CADET REFERENCE</p><h1>Cadet Handbook</h1><p>A quick reference for Gwynn Park High School AFJROTC cadets. Instructors may update unit-specific procedures throughout the year, so official instructor guidance always takes priority.</p></div><div class="guide-grid"><article class="guide-card"><span class="guide-chip">EXPECTATIONS</span><h2>Cadet Standards</h2><ul><li>Arrive prepared, on time, and ready to participate.</li><li>Show respect to cadets, staff, instructors, school employees, and guests.</li><li>Follow school and AFJROTC rules during class, events, trips, and service activities.</li><li>Take responsibility for issued items and assigned duties.</li></ul></article><article class="guide-card"><span class="guide-chip">LEADERSHIP</span><h2>Chain of Command</h2><p>Use your flight and cadet chain of command for routine questions whenever appropriate. If a concern is urgent, sensitive, or involves safety, contact an instructor or trusted school adult directly.</p></article><article class="guide-card"><span class="guide-chip">PARTICIPATION</span><h2>Attendance & Events</h2><ul><li>Check the Calendar and Announcements pages regularly.</li><li>Communicate conflicts as early as possible.</li><li>Community service hours should be recorded using the Service Hours section.</li></ul></article><article class="guide-card"><span class="guide-chip">UNIFORM</span><h2>Uniform Responsibility</h2><p>Check the Uniform Guide before wear days. Keep uniform items clean, complete, and ready before inspection. Ask an instructor when you are unsure about placement or an item requirement.</p><div class="guide-actions"><button class="primary-guide" data-guide-go="uniform-guide">Open Uniform Guide</button></div></article><article class="guide-card guide-wide"><span class="guide-chip">ONLINE TOOLS</span><h2>Using This Site</h2><p>Your account gives you access to cadet-only tools such as My Dashboard, My Groups, Service Hours, the Drill Quiz, and other unit features. The public site remains available to families and visitors.</p></article></div></div>`;
      main.appendChild(s);
    }
    if(!document.getElementById('public-uniform-guide')){
      const s=document.createElement('section');s.id='public-uniform-guide';s.className='public-page';
      s.innerHTML=`<div class="guide-page"><div class="guide-hero"><p class="eyebrow">UNIFORM REFERENCE</p><h1>Uniform Guide</h1><p>Use this page as a quick preparation guide. The Uniform of the Week page tells you which uniform is currently required; instructors can provide exact placement and wear guidance for your unit.</p></div><div class="guide-grid"><article class="guide-card"><span class="guide-chip">SERVICE UNIFORM</span><h2>Service Coat</h2><ul><li>Make sure all required uniform items are clean and present.</li><li>Check insignia, name tag, ribbons, and other items for correct placement.</li><li>Inspect shoes and overall appearance before arriving at school.</li></ul></article><article class="guide-card"><span class="guide-chip">OUTERWEAR</span><h2>Lightweight Jacket</h2><ul><li>Wear only when authorized for the scheduled uniform.</li><li>Keep the jacket clean, zipped/worn as instructed, and free of unauthorized items.</li><li>Confirm any required insignia or name identification with instructors.</li></ul></article><article class="guide-card"><span class="guide-chip">PHYSICAL TRAINING</span><h2>PT Gear</h2><ul><li>Bring the complete required PT uniform.</li><li>Wear safe athletic shoes appropriate for the planned activity.</li><li>Bring water when directed and follow weather/safety instructions.</li></ul></article><article class="guide-card"><span class="guide-chip">BEFORE INSPECTION</span><h2>Quick Checklist</h2><ul><li>Uniform clean and wrinkle-free.</li><li>Required items present and secured.</li><li>Hair and grooming meet current school/AFJROTC guidance.</li><li>Shoes clean and appropriate.</li><li>Ask before guessing about placement.</li></ul></article><article class="guide-card guide-wide"><h2>Current Uniform</h2><p id="guideCurrentUniform">Check the Uniform of the Week page for the current requirement.</p><div class="guide-actions"><button class="primary-guide" data-guide-go="uniform">View Uniform of the Week</button><button class="secondary-guide" data-guide-go="handbook">Cadet Handbook</button></div></article></div></div>`;
      main.appendChild(s);
    }
    document.querySelectorAll('[data-guide-go]').forEach(b=>b.onclick=()=>showPage(b.dataset.guideGo));
    const update=()=>{const n=document.getElementById('publicUniformName')?.textContent?.trim();const d=document.getElementById('publicUniformDate')?.textContent?.trim();const notes=document.getElementById('publicUniformNotes')?.textContent?.trim();if(n&&n!=='Not posted'){const el=document.getElementById('guideCurrentUniform');if(el)el.textContent=[n,d,notes].filter(Boolean).join(' • ')}};setTimeout(update,300);setTimeout(update,1400);
  }
  function addGuideNav(){
    document.querySelectorAll('.public-nav').forEach(nav=>{addNavButton(nav,'handbook','Cadet Handbook','▤','[data-public="resources"]');addNavButton(nav,'uniform-guide','Uniform Guide','◇','[data-public="handbook"]')});
    const mobile=document.getElementById('mobileNav');if(mobile){addNavButton(mobile,'uniform-guide','Uniform Guide','◇','[data-public="resources"]');addNavButton(mobile,'handbook','Cadet Handbook','▤','[data-public="uniform-guide"]')}
  }
  function cleanFooter(){
    const footer=document.getElementById('publicFooter');
    if(footer){
      [...footer.querySelectorAll('*')].forEach(el=>{const t=(el.textContent||'').trim();if(/^Build\s*:/i.test(t)||/^Version\s*:/i.test(t)||/^Final Polish\b/i.test(t)){el.classList.add('footer-build-line');}});
    }
    document.querySelectorAll('body *').forEach(el=>{if(el.children.length) return;const t=(el.textContent||'').trim();if(/^Build:\s*Final Polish/i.test(t))el.classList.add('footer-build-line')});
    const hf=document.querySelector('.home-footer');
    if(hf&&!hf.dataset.polished){hf.dataset.polished='1';hf.innerHTML=`<div><div class="home-footer-school">Gwynn Park High School AFJROTC</div><p>Leadership • Service • Excellence</p></div><div><b>QUICK LINKS</b><p>Calendar • Resources • Message Board</p><p>Cadet Handbook • Uniform Guide</p></div><div><b>ACCOUNT ACCESS</b><p>Cadets and staff can sign in for personalized tools.</p><div class="footer-mini-links"><button id="homeFooterSignIn2">Cadet Sign In</button></div></div><div><b>ADMIN</b><p>Authorized staff can manage site content.</p><div class="footer-mini-links"><button id="homeFooterAdmin">Admin Control Center</button></div></div>`;document.getElementById('homeFooterSignIn2').onclick=()=>document.getElementById('signInBtn')?.click();document.getElementById('homeFooterAdmin').onclick=()=>location.href='/admin.html';}
  }
  function fixAdminLinks(){
    const header=document.querySelector('.public-header');
    if(header){
      let b=document.getElementById('adminPortalBtn');
      if(!b){b=document.createElement('button');b.id='adminPortalBtn';b.className='sign-in site-switch-admin';b.dataset.shellIcon='◆';header.insertBefore(b,document.getElementById('signInBtn'));}
      b.textContent='Admin Control Center';b.setAttribute('aria-label','Open Admin Control Center');b.onclick=()=>location.href='/admin.html';
      const allow=!window.currentProfile||ADMIN_ROLES.includes(window.currentProfile?.role)||ADMIN_ROLES.includes(typeof currentProfile!=='undefined'?currentProfile?.role:null);
      if(allow)b.classList.remove('hidden');
    }
    document.querySelectorAll('.admin-side .back-btn,#backToSite').forEach(b=>{b.textContent='← Back to Public Site';b.onclick=()=>location.href='/';});
    document.querySelectorAll('[data-back-admin],.back-to-admin-site').forEach(b=>b.onclick=()=>location.href='/admin.html');
  }
  function homepageButtons(){
    const week=document.querySelector('.home-week');if(week&&!week.dataset.linksAdded){week.dataset.linksAdded='1';const cards=week.querySelectorAll('.week-card');if(cards[0]){const btn=document.createElement('button');btn.textContent='Uniform Guide';btn.className='primary-guide';btn.style.marginTop='10px';btn.onclick=()=>showPage('uniform-guide');cards[0].querySelector('div:last-child')?.appendChild(btn)}}
  }
  function run(){addStyles();buildGuides();addGuideNav();cleanFooter();fixAdminLinks();homepageButtons()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,300));else setTimeout(run,300);
  [900,1800,3200].forEach(ms=>setTimeout(run,ms));
})();