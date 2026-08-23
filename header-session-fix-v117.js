(()=>{
  if(window.__headerSessionFixV117)return;
  window.__headerSessionFixV117=true;

  const PUBLIC_KEYS=new Set(['home','announcements','calendar','uniform','board','resources','gallery']);

  function enforceHeader(session){
    const signedIn=!!session?.user;
    document.body.classList.toggle('account-shell',signedIn);
    document.body.classList.toggle('guest-shell',!signedIn);

    const header=document.querySelector('.public-header');
    const nav=header?.querySelector('.public-nav');
    if(!header||!nav)return;

    nav.querySelectorAll('button[data-public]').forEach(btn=>{
      const key=(btn.dataset.public||'').trim();
      if(!signedIn){
        if(PUBLIC_KEYS.has(key)){
          btn.classList.remove('hidden');
          btn.style.removeProperty('display');
        }else{
          btn.classList.add('hidden');
          btn.style.setProperty('display','none','important');
        }
      }else{
        btn.style.removeProperty('display');
      }
    });

    const brand=header.querySelector('.public-brand');
    if(brand){
      brand.querySelector('.crest')?.replaceChildren(document.createTextNode('803'));
      const strong=brand.querySelector('strong'); if(strong) strong.textContent='MD-803 AFJROTC';
      const small=brand.querySelector('small'); if(small) small.textContent='GWYNN PARK HIGH SCHOOL';
    }

    const labels={home:'Dashboard',announcements:'Announcements',calendar:'Calendar',uniform:'Uniform',board:'Message Board',resources:'Resources',gallery:'Gallery'};
    if(!signedIn){
      ['home','announcements','calendar','uniform','board','resources','gallery'].forEach(key=>{
        const b=nav.querySelector(`button[data-public="${key}"]`);
        if(b){b.textContent=labels[key];nav.appendChild(b)}
      });
      const sign=document.getElementById('signInBtn');
      if(sign){sign.textContent='Sign In';sign.classList.remove('hidden');sign.style.removeProperty('display')}
      document.getElementById('adminPortalBtn')?.style.setProperty('display','none','important');
    }else{
      document.getElementById('adminPortalBtn')?.style.removeProperty('display');
    }
  }

  async function sync(){
    try{
      if(typeof sb==='undefined'||!sb?.auth){setTimeout(sync,120);return;}
      const {data}=await sb.auth.getSession();
      enforceHeader(data?.session||null);
      if(!window.__headerSessionListenerV117){
        window.__headerSessionListenerV117=true;
        sb.auth.onAuthStateChange((_event,session)=>setTimeout(()=>enforceHeader(session),0));
      }
    }catch(err){
      console.warn('Header session sync failed',err);
      enforceHeader(null);
    }
  }

  sync();
  [150,400,900,1600,3000,5000].forEach(ms=>setTimeout(sync,ms));
  const observer=new MutationObserver(()=>{
    clearTimeout(window.__header117Timer);
    window.__header117Timer=setTimeout(sync,60);
  });
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
})();
