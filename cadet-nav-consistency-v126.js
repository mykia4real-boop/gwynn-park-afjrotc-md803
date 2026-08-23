(()=>{
  if(window.__cadetNavConsistencyV126)return;
  window.__cadetNavConsistencyV126=true;

  const ITEMS=[
    ['home','Home','⌂'],
    ['cadet-dashboard','Cadet Dashboard','▦'],
    ['announcements','Announcements','◉'],
    ['calendar','Calendar','▣'],
    ['uniform-day','Uniform of the Day',''],
    ['board','Community','▢'],
    ['uniform-guide','Uniform Guide',''],
    ['handbook','Cadet Handbook',''],
    ['resources','Resources','▤'],
    ['service','Service Hours','◷'],
    ['drill-quiz','Drill Quiz','◆'],
    ['gallery','Gallery','▧'],
    ['flight','My Flight','✈'],
    ['ranks','Ranks & Info','☆']
  ];

  const goPublic=key=>{
    try{
      if(typeof showPublic==='function'){showPublic(key);return}
    }catch(e){}
    location.href='/?open='+encodeURIComponent(key);
  };

  function activeKey(){
    const active=document.querySelector('.public-page.active');
    return active?.id?.replace(/^public-/,'')||'home';
  }

  function build(){
    if(!document.body.classList.contains('account-shell'))return;
    const nav=document.querySelector('.public-header .public-nav');
    if(!nav)return;
    const current=activeKey();
    nav.innerHTML='';
    ITEMS.forEach(([key,label,icon])=>{
      const b=document.createElement('button');
      b.type='button';b.textContent=label;b.dataset.shellIcon=icon;
      if(key==='uniform-guide')b.onclick=()=>location.href='/uniform.html';
      else if(key==='handbook')b.onclick=()=>location.href='/handbook.html';
      else if(key==='uniform-day')b.onclick=()=>location.href='/uniform-day.html';
      else b.onclick=()=>goPublic(key);
      if((key==='cadet-dashboard'&&current==='cadet-dashboard')||(key===current))b.classList.add('active');
      nav.appendChild(b);
    });
    const brand=document.querySelector('.public-brand');
    if(brand){
      const crest=brand.querySelector('.crest');if(crest)crest.textContent='GP';
      const strong=brand.querySelector('strong');if(strong)strong.textContent='AFJROTC';
      const small=brand.querySelector('small');if(small)small.textContent='GWYNN PARK HIGH SCHOOL';
    }
    const admin=document.getElementById('adminPortalBtn')||document.getElementById('signInBtn');
    if(admin){admin.textContent='◆ Admin';admin.classList.remove('hidden');admin.onclick=()=>location.href='/admin.html';}
  }

  const oldShow=window.showPublic;
  if(typeof oldShow==='function')window.showPublic=function(page){oldShow(page);setTimeout(build,0)};

  async function sync(){
    try{
      if(typeof sb==='undefined'||!sb?.auth){setTimeout(sync,120);return}
      const {data}=await sb.auth.getSession();
      if(data?.session?.user){document.body.classList.add('account-shell');document.body.classList.remove('guest-shell');build();}
    }catch(e){console.warn('cadet nav consistency',e)}
  }
  sync();
  [300,900,1800,3500,6000].forEach(ms=>setTimeout(sync,ms));
  document.addEventListener('click',()=>setTimeout(build,40));
})();