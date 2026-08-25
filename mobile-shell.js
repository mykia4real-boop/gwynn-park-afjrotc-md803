(()=>{
  function ensureMenuButton(){
    const header=document.querySelector('.public-header');
    if(!header)return null;
    let btn=document.getElementById('mobileMenuBtn');
    if(!btn){
      btn=document.createElement('button');
      btn.id='mobileMenuBtn';
      btn.className='mobile-menu-btn';
      btn.type='button';
      btn.textContent='Menu';
      btn.setAttribute('aria-expanded','false');
      const sign=document.getElementById('signInBtn');
      sign&&sign.parentElement===header?header.insertBefore(btn,sign):header.appendChild(btn);
    }
    return btn;
  }

  function loadMenuController(){
    ensureMenuButton();
    if(window.__afjrotcShellMobileMenuV4)return;
    if(document.querySelector('script[data-shell-mobile-menu]'))return;
    const m=document.createElement('script');
    m.src='/mobile-menu-fix.js?release=20260825-shell-menu-v4-standalone';
    m.async=false;
    m.dataset.shellMobileMenu='1';
    document.head.appendChild(m);
  }

  if(window.__afjrotcUnifiedShell){
    loadMenuController();
    return;
  }

  const existing=document.querySelector('script[data-unified-site-shell]');
  if(existing){
    existing.addEventListener('load',()=>setTimeout(loadMenuController,0),{once:true});
    setTimeout(loadMenuController,500);
    return;
  }

  const s=document.createElement('script');
  s.src='/site-shell.js?release=20260824-shell-sync';
  s.async=false;
  s.dataset.unifiedSiteShell='1';
  s.addEventListener('load',()=>setTimeout(loadMenuController,0),{once:true});
  document.head.appendChild(s);
  setTimeout(loadMenuController,500);
})();