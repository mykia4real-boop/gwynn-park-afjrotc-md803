(()=>{
  function addStyles(){
    if(document.getElementById('homeRedesignStyles')) return;
    const s=document.createElement('style');
    s.id='homeRedesignStyles';
    s.textContent=`
      #public-home{padding:0!important;max-width:none!important;background:#f4f6f8!important}
      #public-home *{box-sizing:border-box}
      .gp-home-hero{padding:58px max(5%,28px) 48px;background:linear-gradient(135deg,#111820 0%,#242b35 100%);color:#fff;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:30px;align-items:center}
      .gp-home-kicker{font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:#ffd83d;font-weight:900;margin:0 0 11px}
      .gp-home-hero h1{font-size:clamp(40px,5.8vw,72px);line-height:1.02;margin:0 0 15px;letter-spacing:-.035em;color:#fff}
      .gp-home-hero-copy>p:not(.gp-home-kicker){font-size:16px;line-height:1.65;color:#cbd2dc;max-width:670px;margin:0}
      .gp-home-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}
      .gp-home-actions button,.gp-home-uniform button{min-height:44px;border-radius:10px;padding:11px 17px;font-weight:900;cursor:pointer}
      .gp-home-primary{border:0;background:#ffd83d;color:#111820}
      .gp-home-secondary{background:transparent;border:1px solid #68717d;color:#fff}
      .gp-home-focus{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.13);border-radius:18px;padding:22px}
      .gp-home-focus small{font-size:11px;color:#b1b9c5;text-transform:uppercase;letter-spacing:.09em}
      .gp-home-focus h3{font-size:25px;margin:9px 0 8px;color:#fff}
      .gp-home-focus p{font-size:13px!important;line-height:1.55!important;color:#c4cbd5!important;margin:0!important}
      .gp-home-main{padding:0 max(5%,28px) 38px}
      .gp-home-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;position:relative;margin-top:-18px;margin-bottom:30px}
      .gp-home-stat{background:#fff;border:1px solid #e0e5ea;border-radius:15px;padding:18px;min-width:0;box-shadow:0 8px 24px rgba(15,23,42,.05)}
      .gp-home-stat span{display:block;font-size:10px;color:#727b86;text-transform:uppercase;letter-spacing:.08em;font-weight:800;margin-bottom:8px}
      .gp-home-stat b{display:block;font-size:23px;color:#111820;line-height:1.15;overflow-wrap:anywhere}
      .gp-home-section{margin-bottom:28px}
      .gp-home-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:14px}
      .gp-home-section-head h2{font-size:24px;margin:0;color:#101923}
      .gp-home-section-head p{font-size:13px;color:#6d7680;margin:5px 0 0}
      .gp-home-link{border:0;background:transparent;color:#225f8c;font-weight:900;cursor:pointer;padding:6px 0}
      .gp-home-announcements{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important}
      .gp-home-announcements>.card{background:#fff!important;border:1px solid #e0e5ea!important;border-radius:15px!important;padding:18px!important;box-shadow:none!important}
      .gp-home-announcements .card h3{font-size:16px;margin:10px 0 7px;color:#111820}
      .gp-home-announcements .card p{font-size:13px;line-height:1.5;color:#68717c;margin-bottom:10px}
      .gp-home-announcements .announcement-author{font-size:11px;color:#89919b}
      .gp-home-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}
      .gp-home-panel{background:#fff;border:1px solid #e0e5ea;border-radius:15px;padding:18px;min-width:0}
      .gp-home-events .event{border:0!important;border-top:1px solid #edf0f2!important;border-radius:0!important;padding:13px 0!important;background:transparent!important}
      .gp-home-events .event:first-child{border-top:0!important;padding-top:0!important}
      .gp-home-events .event .date{min-width:54px!important;padding-right:13px!important}
      .gp-home-events .event h3{font-size:14px}
      .gp-home-uniform{background:linear-gradient(135deg,#171e27,#29313d);color:#fff;border-radius:15px;padding:22px;display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:100%}
      .gp-home-uniform small{font-size:10px;color:#abb4c0;text-transform:uppercase;letter-spacing:.09em;font-weight:800}
      .gp-home-uniform h3{font-size:26px;margin:7px 0 5px;color:#fff}
      .gp-home-uniform p{font-size:13px;line-height:1.55;color:#c4ccd6;margin:0}
      .gp-home-quick{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
      .gp-home-quick button{background:#fff;border:1px solid #e0e5ea;border-radius:14px;padding:18px 15px;text-align:left;color:#111820;cursor:pointer;min-height:96px}
      .gp-home-quick b{display:block;font-size:15px;margin-bottom:6px}
      .gp-home-quick span{display:block;font-size:12px;line-height:1.45;color:#707983;font-weight:500}
      .gp-home-footer{padding:24px max(5%,28px);background:#111820;color:#b8c0ca;text-align:center;font-size:12px}
      .gp-home-compat{display:none!important}
      @media(max-width:980px){
        .gp-home-hero{grid-template-columns:1fr;padding-top:42px}
        .gp-home-stats,.gp-home-quick{grid-template-columns:repeat(2,minmax(0,1fr))}
        .gp-home-announcements{grid-template-columns:1fr 1fr!important}
      }
      @media(max-width:700px){
        .gp-home-hero,.gp-home-main{padding-left:18px;padding-right:18px}
        .gp-home-split{grid-template-columns:1fr}
        .gp-home-announcements{grid-template-columns:1fr!important}
        .gp-home-uniform{align-items:flex-start;flex-direction:column}
      }
      @media(max-width:520px){
        .gp-home-stats,.gp-home-quick{grid-template-columns:1fr}
        .gp-home-hero h1{font-size:38px}
      }
    `;
    document.head.appendChild(s);
  }

  function clickPage(page){
    document.querySelector(`button[data-public="${page}"]`)?.click();
  }

  function build(){
    const home=document.getElementById('public-home');
    if(!home || home.dataset.approvedHomepage==='1') return;
    home.dataset.approvedHomepage='1';
    addStyles();

    home.innerHTML=`
      <section class="gp-home-hero">
        <div class="gp-home-hero-copy">
          <p class="gp-home-kicker">Gwynn Park High School</p>
          <h1>Air Force Junior ROTC</h1>
          <p>Welcome to Gwynn Park High School AFJROTC. Find announcements, upcoming events, uniform information, resources, photos, and important program updates all in one place.</p>
          <div class="gp-home-actions">
            <button class="gp-home-primary" type="button" data-home-go="announcements">View Announcements</button>
            <button class="gp-home-secondary" type="button" data-home-go="resources">Explore Resources</button>
          </div>
        </div>
        <aside class="gp-home-focus">
          <small>Program Focus</small>
          <h3>Integrity. Service. Excellence.</h3>
          <p>Developing leadership, responsibility, teamwork, and citizenship through meaningful experiences in and outside the classroom.</p>
        </aside>
      </section>

      <main class="gp-home-main">
        <section class="gp-home-stats" aria-label="AFJROTC site overview">
          <article class="gp-home-stat"><span>Announcements</span><b id="publicAnnouncementCount">0</b></article>
          <article class="gp-home-stat"><span>Upcoming Events</span><b id="publicEventCount">0</b></article>
          <article class="gp-home-stat"><span>Uniform of the Week</span><b id="publicUniformQuick">Not posted</b></article>
          <article class="gp-home-stat"><span>Resources</span><b id="publicResourceCount">0</b></article>
        </section>

        <section class="gp-home-section">
          <div class="gp-home-section-head">
            <div><h2>Latest Announcements</h2><p>Recent program updates for cadets, families, and visitors.</p></div>
            <button type="button" class="gp-home-link" data-home-go="announcements">View all</button>
          </div>
          <div id="publicHomeAnnouncements" class="gp-home-announcements"></div>
        </section>

        <section class="gp-home-section gp-home-split">
          <article class="gp-home-panel">
            <div class="gp-home-section-head">
              <div><h2 style="font-size:18px">Upcoming Events</h2></div>
              <button type="button" class="gp-home-link" data-home-go="calendar">Full calendar</button>
            </div>
            <div id="publicHomeEvents" class="gp-home-events"></div>
          </article>

          <article class="gp-home-uniform">
            <div>
              <small>Uniform of the Week</small>
              <h3 id="publicUniformName">Not posted</h3>
              <p id="publicUniformDate"></p>
              <p id="publicUniformNotes">Uniform information has not been posted yet.</p>
            </div>
            <button type="button" class="gp-home-primary" data-home-go="uniform">View Details</button>
          </article>
        </section>

        <section class="gp-home-section">
          <div class="gp-home-section-head">
            <div><h2>Quick Links</h2><p>Get to the most-used public pages fast.</p></div>
          </div>
          <div class="gp-home-quick">
            <button type="button" data-home-go="board"><b>Message Board</b><span>Read approved community posts and updates.</span></button>
            <button type="button" data-home-go="resources"><b>Resources</b><span>Open handbooks, forms, guides, and useful links.</span></button>
            <button type="button" data-home-go="uniform"><b>Uniform</b><span>Check this week's uniform and wear requirements.</span></button>
            <button type="button" data-home-go="gallery"><b>Photo Gallery</b><span>View approved photos from AFJROTC activities.</span></button>
          </div>
        </section>
      </main>

      <footer class="gp-home-footer">Gwynn Park High School AFJROTC</footer>
    `;

    home.querySelectorAll('[data-home-go]').forEach(btn=>{
      btn.addEventListener('click',()=>clickPage(btn.dataset.homeGo));
    });

    syncFromCurrentData();
  }

  function syncFromCurrentData(){
    const rerender=()=>{
      try{
        if(typeof renderPublic==='function') renderPublic();
      }catch(err){ console.warn('Homepage data refresh skipped',err); }
    };
    setTimeout(rerender,150);
    setTimeout(rerender,900);
  }

  function normalizeNav(){
    document.querySelectorAll('button[data-public="home"]').forEach(btn=>{
      btn.textContent='Home';
      btn.dataset.shellIcon='⌂';
    });
    const nav=document.querySelector('.public-nav');
    const homeBtn=nav?.querySelector('button[data-public="home"]');
    if(nav&&homeBtn) nav.prepend(homeBtn);
  }

  function run(){ normalizeNav(); build(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(run,950));
  else setTimeout(run,950);
  setTimeout(run,1900);
})();