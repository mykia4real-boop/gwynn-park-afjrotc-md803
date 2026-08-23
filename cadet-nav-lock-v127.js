(()=>{
  if(window.__cadetNavLockV127)return;
  window.__cadetNavLockV127=true;

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

  let rebuilding=false;
  let signedIn=false;

  function currentKey(){
    const active=document.querySelector('#publicSite .public-page.active');
    return active?.id?.replace(/^public-/,'')||'home';
  }

  function go(key){
    if(key==='uniform-guide'){location.href='/uniform.html';return;}
    if(key==='handbook'){location.href='/handbook.html';return;}
    if(key==='uniform-day'){location.href='/uniform-day.html';return;}
    try{
      if(typeof window.showPublic==='function'){window.showPublic(key);setTimeout(lock,0);return;}
      if(typeof showPublic==='function'){showPublic(key);setTimeout(lock,0);return;}
    }catch(e){}
    location.href='/?open='+encodeURIComponent(key);
  }

  function navIsCorrect(nav){
    if(!nav||nav.children.length!==ITEMS.length)return false;
    return ITEMS.every((item,i)=>nav.children[i]?.dataset?.cadetNavKey===item[0]&&nav.children[i]?.textContent===item[1]);
  }

  function lock(){
    if(rebuilding||!signedIn)return;
    const header=document.querySelector('.public-header');
    const nav=header?.querySelector('.public-nav');
    if(!header||!nav)return;
    rebuilding=true;
    document.body.classList.add('account-shell');
    document.body.classList.remove('guest-shell');

    const active=currentKey();
    if(!navIsCorrect(nav)){
      const frag=document.createDocumentFragment();
      ITEMS.forEach(([key,label,icon])=>{
        const b=document.createElement('button');
        b.type='button';
        b.textContent=label;
        b.dataset.cadetNavKey=key;
        b.dataset.shellIcon=icon;
        b.onclick=e=>{e.preventDefault();e.stopPropagation();go(key)};
        frag.appendChild(b);
      });
      nav.replaceChildren(frag);
    }

    [...nav.children].forEach(b=>{
      const key=b.dataset.cadetNavKey;
      b.classList.toggle('active',key===active);
      b.classList.remove('hidden');
      b.style.display='block';
    });

    const brand=header.querySelector('.public-brand');
    if(brand){
      const crest=brand.querySelector('.crest'); if(crest)crest.textContent='GP';
      const strong=brand.querySelector('strong'); if(strong)strong.textContent='AFJROTC';
      const small=brand.querySelector('small'); if(small)small.textContent='GWYNN PARK HIGH SCHOOL';
    }

    const admin=document.getElementById('adminPortalBtn')||document.getElementById('signInBtn');
    if(admin){
      admin.textContent='◆ Admin';
      admin.classList.remove('hidden');
      admin.style.display='block';
      admin.onclick=()=>location.href='/admin.html';
    }
    rebuilding=false;
  }

  async function auth(){
    try{
      const client=(typeof sb!=='undefined'&&sb)||window.sb;
      if(!client?.auth){setTimeout(auth,120);return;}
      const {data}=await client.auth.getSession();
      signedIn=!!data?.session?.user;
      if(signedIn)lock();
      client.auth.onAuthStateChange((_event,session)=>{signedIn=!!session?.user;if(signedIn)queueMicrotask(lock)});
    }catch(e){console.warn('cadet nav lock',e)}
  }

  const observer=new MutationObserver(()=>{
    if(!signedIn||rebuilding)return;
    const nav=document.querySelector('.public-header .public-nav');
    if(!navIsCorrect(nav))queueMicrotask(lock);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});

  document.addEventListener('click',()=>signedIn&&setTimeout(lock,0),true);
  window.addEventListener('popstate',()=>signedIn&&setTimeout(lock,0));
  [0,150,400,900,1600,3000,6000].forEach(ms=>setTimeout(()=>{if(signedIn)lock();},ms));
  auth();
})();