(()=>{
  if(window.__afjrotcAnnouncementAuthorContrast)return;
  window.__afjrotcAnnouncementAuthorContrast=true;

  const style=document.createElement('style');
  style.id='announcementAuthorContrastStyles';
  style.textContent=`
    #public-announcements .ann-author-name-fix{
      font-weight:900!important;
      opacity:1!important;
      text-shadow:none!important;
    }
  `;
  document.head.appendChild(style);

  function rgb(text){
    const m=String(text||'').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    return m?[Number(m[1]),Number(m[2]),Number(m[3])]:null;
  }
  function isLight(el){
    let node=el;
    while(node&&node!==document.body){
      const c=rgb(getComputedStyle(node).backgroundColor);
      if(c&&!(c[0]===0&&c[1]===0&&c[2]===0&&getComputedStyle(node).backgroundColor.includes(', 0)'))){
        return ((c[0]*299+c[1]*587+c[2]*114)/1000)>150;
      }
      node=node.parentElement;
    }
    return true;
  }
  function smallestPostedByElements(root){
    return [...root.querySelectorAll('*')].filter(el=>{
      const text=(el.textContent||'').trim();
      if(!/Posted by\s+/i.test(text))return false;
      return ![...el.children].some(child=>/Posted by\s+/i.test((child.textContent||'').trim()));
    });
  }
  function fixMeta(el){
    const text=(el.textContent||'').trim();
    const match=text.match(/^(.*?Posted by\s+)(.+?)(\s*(?:•|·)\s*.*)?$/i);
    if(!match)return;
    const author=(match[2]||'').trim();
    if(!author)return;

    let target=[...el.querySelectorAll('b,strong,span')].find(node=>(node.textContent||'').trim()===author);
    if(!target){
      const prefix=match[1]||'Posted by ';
      const suffix=match[3]||'';
      el.textContent='';
      el.append(document.createTextNode(prefix));
      target=document.createElement('span');
      target.textContent=author;
      el.append(target);
      if(suffix)el.append(document.createTextNode(suffix));
    }
    target.classList.add('ann-author-name-fix');
    target.style.setProperty('color',isLight(el)?'#17324d':'#f5f8fb','important');
  }
  function apply(){
    const root=document.getElementById('public-announcements');
    if(!root)return;
    smallestPostedByElements(root).forEach(fixMeta);
  }

  apply();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  const root=document.getElementById('public-announcements');
  if(root){
    const observer=new MutationObserver(()=>requestAnimationFrame(apply));
    observer.observe(root,{subtree:true,childList:true,characterData:true});
  }
  setTimeout(apply,500);
  setTimeout(apply,1500);
})();
