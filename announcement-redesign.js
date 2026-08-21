(()=>{
  const ROLE_NAMES={cadet:'Cadet',class_leader:'Class Leader',command_staff:'Command Staff',instructor:'Instructor',admin:'Command Staff'};
  const MANAGER_ROLES=new Set(['command_staff','instructor','admin']);
  let commentRows=[];
  let selectedFilter='all';
  let searchText='';

  const page=()=>document.getElementById('public-announcements');
  const safe=v=>typeof esc==='function'?esc(v):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const manager=()=>!!currentProfile&&MANAGER_ROLES.has(currentProfile.role);
  const fmtDate=value=>{
    if(!value)return '';
    const d=new Date(value);
    if(Number.isNaN(d.getTime()))return '';
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  };
  const fmtTime=value=>{
    if(!value)return '';
    const d=new Date(value);
    if(Number.isNaN(d.getTime()))return '';
    const diff=Math.max(0,Date.now()-d.getTime());
    if(diff<60000)return 'Just now';
    if(diff<3600000)return `${Math.floor(diff/60000)} min ago`;
    if(diff<86400000)return `${Math.floor(diff/3600000)} hr ago`;
    return fmtDate(value);
  };
  const preview=text=>{
    const t=String(text||'').trim();
    return t.length>220?t.slice(0,217).trimEnd()+'…':t;
  };
  const initials=name=>String(name||'Cadet').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'C';
  const normalizedCategory=cat=>{
    const c=String(cat||'General').toLowerCase();
    if(c.includes('reminder'))return 'reminder';
    if(c.includes('community')||c.includes('service'))return 'service';
    if(c.includes('event')||c.includes('trip')||c.includes('drill')||c.includes('competition'))return 'events';
    return 'general';
  };

  function addStyles(){
    if(document.getElementById('announcementRedesignStyles'))return;
    const s=document.createElement('style');
    s.id='announcementRedesignStyles';
    s.textContent=`
      #public-announcements{max-width:none!important;padding:0!important;background:#f4f6f8!important}
      .ann-page-top{background:linear-gradient(135deg,#0a1b31,#202b38);color:#fff;padding:44px 5% 36px}
      .ann-page-top .ann-eyebrow{color:#ffd83d;text-transform:uppercase;letter-spacing:.13em;font-size:11px;font-weight:900}
      .ann-page-top h1{font-size:44px;margin:7px 0 9px;color:#fff}
      .ann-page-top p{color:#c5ced9;max-width:650px;line-height:1.6;margin:0}
      .ann-main{padding:28px 5% 48px;max-width:1450px;margin:auto}
      .ann-toolbar{display:flex;gap:12px;justify-content:space-between;align-items:center;margin-bottom:20px}
      .ann-filters{display:flex;gap:8px;flex-wrap:wrap}
      .ann-filter{border:1px solid #dce2e8;background:#fff;color:#172033;border-radius:999px;padding:9px 13px;font-size:12px;font-weight:800;cursor:pointer}
      .ann-filter.active{background:#ffd83d;border-color:#ffd83d;color:#111827}
      .ann-search{border:1px solid #dce2e8;background:#fff;border-radius:11px;padding:11px 13px;min-width:230px;color:#172033}
      .ann-featured{background:linear-gradient(135deg,#121c2b,#273342);border-radius:18px;color:#fff;padding:26px;margin-bottom:22px;display:grid;grid-template-columns:1fr auto;gap:24px;align-items:start}
      .ann-featured .ann-tag{background:#ffd83d;color:#111827}
      .ann-featured h2{font-size:29px;margin:11px 0 9px;color:#fff}
      .ann-featured p{color:#c8d0db;line-height:1.6;max-width:800px;margin:0 0 12px}
      .ann-meta{font-size:11px;color:#89929d}
      .ann-featured .ann-meta{color:#aeb8c4}
      .ann-btn{border:0;background:#ffd83d;color:#111827;border-radius:10px;padding:11px 15px;font-weight:900;cursor:pointer}
      .ann-layout{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:20px}
      .ann-feed{display:grid;gap:14px}
      .ann-post{background:#fff;border:1px solid #dfe5ea;border-radius:16px;padding:19px;min-width:0}
      .ann-post-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
      .ann-post h3{font-size:18px;margin:9px 0 6px;color:#111827}
      .ann-tag{display:inline-block;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;background:#edf3fb;color:#245b88}
      .ann-preview,.ann-full{margin:0;color:#69737e;font-size:13px;line-height:1.58;white-space:pre-wrap}
      .ann-full{display:none}.ann-post.expanded .ann-preview{display:none}.ann-post.expanded .ann-full{display:block}
      .ann-post-actions{display:flex;align-items:center;gap:12px;margin-top:15px;padding-top:13px;border-top:1px solid #edf0f3;flex-wrap:wrap}
      .ann-text-btn{border:0;background:transparent;color:#155f90;font-weight:900;padding:4px 0;cursor:pointer}
      .ann-comment-count{margin-left:auto;font-size:11px;color:#838d98}
      .ann-sidebar{display:grid;gap:14px;align-content:start}
      .ann-side-card{background:#fff;border:1px solid #dfe5ea;border-radius:16px;padding:18px}
      .ann-side-card h3{font-size:15px;margin:0 0 12px;color:#111827}
      .ann-side-card p{font-size:12px;color:#707a85;line-height:1.5}
      .ann-category-row{display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid #edf0f3;font-size:12px;color:#334155}
      .ann-category-row:first-of-type{border-top:0}
      .ann-thread{display:none;margin-top:15px;border-top:1px solid #edf0f3;padding-top:14px}.ann-thread.open{display:block}
      .ann-comment{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f0f2f5}.ann-comment:last-of-type{border-bottom:0}
      .ann-avatar{width:34px;height:34px;border-radius:50%;background:#ffd83d;color:#111827;display:grid;place-items:center;font-size:11px;font-weight:900;flex:none}
      .ann-comment-body{min-width:0;flex:1}.ann-comment-body b{font-size:12px;color:#111827}.ann-role{font-size:9px;text-transform:uppercase;letter-spacing:.05em;margin-left:6px;color:#858f99}
      .ann-comment-body p{font-size:12px;color:#626d78;margin:4px 0 2px;line-height:1.45;white-space:pre-wrap}.ann-comment-body small{font-size:10px;color:#929aa3}
      .ann-delete-comment{border:0;background:transparent;color:#a22f2f;font-size:10px;font-weight:800;cursor:pointer;margin-left:8px}
      .ann-comment-form{display:flex;gap:8px;margin-top:10px}.ann-comment-form input{flex:1;min-width:0;border:1px solid #d8dee4;border-radius:10px;padding:10px 12px;background:#fff;color:#172033;font-size:13px;margin:0}.ann-comment-form button{border:0;border-radius:10px;padding:10px 13px;background:#ffd83d;color:#111827;font-weight:900;cursor:pointer}
      .ann-signin-note,.ann-locked{font-size:11px;color:#7c8690;margin-top:10px}.ann-signin-note button{border:0;background:transparent;color:#155f90;font-weight:900;cursor:pointer;padding:0}
      .ann-admin-note{background:#fff8da;border:1px solid #ead98f;border-radius:12px;padding:13px;font-size:11px;color:#6f5b0a}
      .ann-admin-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.ann-admin-actions button{border:1px solid #d7c46d;background:#fffdf2;color:#5e500a;border-radius:8px;padding:7px 9px;font-size:10px;font-weight:900;cursor:pointer}
      .ann-empty{background:#fff;border:1px solid #dfe5ea;border-radius:16px;padding:25px;color:#687586;text-align:center}
      @media(max-width:850px){.ann-layout{grid-template-columns:1fr}.ann-sidebar{grid-template-columns:1fr 1fr}.ann-featured{grid-template-columns:1fr}.ann-toolbar{align-items:stretch;flex-direction:column}.ann-search{width:100%;min-width:0}}
      @media(max-width:560px){.ann-page-top,.ann-main{padding-left:18px;padding-right:18px}.ann-page-top h1{font-size:36px}.ann-sidebar{grid-template-columns:1fr}.ann-post-head{flex-direction:column}.ann-featured h2{font-size:24px}.ann-comment-form{flex-direction:column}.ann-comment-count{margin-left:0;width:100%}}
    `;
    document.head.appendChild(s);
  }

  async function loadComments(){
    const {data,error}=await sb.from('announcement_comments').select('*').order('created_at',{ascending:true});
    if(error){console.error('Announcement comments load error',error);commentRows=[];return;}
    commentRows=data||[];
  }

  const commentsFor=id=>commentRows.filter(c=>String(c.announcement_id)===String(id));

  function commentHtml(c){
    const canDelete=sessionUser&&(sessionUser.id===c.author_id||manager());
    return `<div class="ann-comment" data-comment-id="${c.id}"><div class="ann-avatar">${safe(initials(c.author_name))}</div><div class="ann-comment-body"><div><b>${safe(c.author_name||'Cadet')}</b><span class="ann-role">${safe(ROLE_NAMES[c.author_role]||c.author_role||'Cadet')}</span>${canDelete?`<button class="ann-delete-comment" data-delete-ann-comment="${c.id}">Remove</button>`:''}</div><p>${safe(c.message)}</p><small>${safe(fmtTime(c.created_at))}</small></div></div>`;
  }

  function threadHtml(a){
    const rows=commentsFor(a.id);
    const enabled=a.comments_enabled!==false;
    let footer='';
    if(!enabled)footer='<div class="ann-locked">Comments are closed for this announcement.</div>';
    else if(sessionUser)footer=`<form class="ann-comment-form" data-comment-form="${a.id}"><input maxlength="500" required placeholder="Write a comment…" aria-label="Write a comment"><button type="submit">Post</button></form>`;
    else footer='<div class="ann-signin-note">Sign in to join the discussion. <button type="button" data-ann-signin>Sign In</button></div>';
    return `<div class="ann-thread" id="ann-thread-${a.id}">${rows.map(commentHtml).join('')||'<div class="ann-signin-note">No comments yet.</div>'}${footer}</div>`;
  }

  function postHtml(a){
    const rows=commentsFor(a.id), count=rows.length;
    return `<article class="ann-post" data-announcement-id="${a.id}" data-category="${normalizedCategory(a.category)}" data-search="${safe(`${a.title||''} ${a.message||''} ${a.category||''} ${a.author_name||''}`.toLowerCase())}"><div class="ann-post-head"><div><span class="ann-tag">${safe(a.category||'General')}</span><h3>${safe(a.title||'Announcement')}</h3></div><div class="ann-meta">${safe(fmtDate(a.created_at))}</div></div><p class="ann-preview">${safe(preview(a.message))}</p><p class="ann-full">${safe(a.message||'')}</p><div class="ann-meta" style="margin-top:8px">Posted by ${safe(a.author_name||'AFJROTC Staff')}</div><div class="ann-post-actions"><button type="button" class="ann-text-btn" data-read-more="${a.id}">${String(a.message||'').length>220?'Read more':'View post'}</button><button type="button" class="ann-text-btn" data-toggle-comments="${a.id}">Comments</button><span class="ann-comment-count">${count?`${count} comment${count===1?'':'s'}`:'No comments yet'}</span>${manager()?`<button type="button" class="ann-text-btn" data-toggle-comment-lock="${a.id}">${a.comments_enabled===false?'Open comments':'Close comments'}</button>`:''}</div>${threadHtml(a)}</article>`;
  }

  function featuredHtml(a){
    if(!a)return '<div class="ann-empty">No announcements have been posted yet.</div>';
    return `<section class="ann-featured" data-category="${normalizedCategory(a.category)}" data-search="${safe(`${a.title||''} ${a.message||''} ${a.category||''}`.toLowerCase())}"><div><span class="ann-tag">${a.priority?'Important':'Latest'} · ${safe(a.category||'General')}</span><h2>${safe(a.title||'Announcement')}</h2><p>${safe(a.message||'')}</p><div class="ann-meta">Posted by ${safe(a.author_name||'AFJROTC Staff')} • ${safe(fmtDate(a.created_at))}</div></div><button type="button" class="ann-btn" data-featured-comments="${a.id}">Discussion · ${commentsFor(a.id).length}</button></section><div id="ann-featured-thread-wrap">${threadHtml(a).replace('class="ann-thread"', 'class="ann-thread" data-featured-thread="1"')}</div>`;
  }

  function countsHtml(rows){
    const counts={general:0,reminder:0,service:0,events:0};
    rows.forEach(a=>counts[normalizedCategory(a.category)]++);
    return `<div class="ann-category-row"><span>General</span><b>${counts.general}</b></div><div class="ann-category-row"><span>Reminders</span><b>${counts.reminder}</b></div><div class="ann-category-row"><span>Community Service</span><b>${counts.service}</b></div><div class="ann-category-row"><span>Unit Events</span><b>${counts.events}</b></div>`;
  }

  function getAnnouncements(){
    try{return Array.isArray(announcements)?[...announcements]:[];}catch{return [];}
  }

  function applyFilters(){
    const q=searchText.trim().toLowerCase();
    document.querySelectorAll('#public-announcements .ann-post').forEach(el=>{
      const category=el.dataset.category||'general';
      const text=(el.dataset.search||'').toLowerCase();
      el.style.display=(selectedFilter==='all'||category===selectedFilter)&&(!q||text.includes(q))?'':'none';
    });
    const visible=[...document.querySelectorAll('#public-announcements .ann-post')].some(x=>x.style.display!=='none');
    const feed=document.getElementById('annFeed');
    const old=document.getElementById('annNoResults');
    if(!visible&&!old&&feed){const e=document.createElement('div');e.id='annNoResults';e.className='ann-empty';e.textContent='No announcements match that search.';feed.appendChild(e);}else if(visible&&old)old.remove();
  }

  function renderPage(){
    const root=page();if(!root)return;
    const rows=getAnnouncements().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    const featured=rows.find(a=>a.priority)||rows[0]||null;
    const rest=featured?rows.filter(a=>String(a.id)!==String(featured.id)):rows;
    root.innerHTML=`<section class="ann-page-top"><div class="ann-eyebrow">Program Updates</div><h1>Announcements</h1><p>Official updates, reminders, events, and information from Gwynn Park High School AFJROTC.</p></section><div class="ann-main"><div class="ann-toolbar"><div class="ann-filters"><button class="ann-filter active" data-ann-filter="all">All</button><button class="ann-filter" data-ann-filter="general">General</button><button class="ann-filter" data-ann-filter="reminder">Reminders</button><button class="ann-filter" data-ann-filter="service">Community Service</button><button class="ann-filter" data-ann-filter="events">Unit Events</button></div><input class="ann-search" id="annSearch" placeholder="Search announcements" aria-label="Search announcements"></div><div id="annFeatured">${featuredHtml(featured)}</div><div class="ann-layout"><section class="ann-feed" id="annFeed">${rest.map(postHtml).join('')||(!featured?'<div class="ann-empty">No announcements yet.</div>':'<div class="ann-empty">More announcements will appear here.</div>')}</section><aside class="ann-sidebar"><section class="ann-side-card"><h3>Announcement Categories</h3>${countsHtml(rows)}</section><section class="ann-side-card"><h3>About Comments</h3><p>Signed-in cadets and staff can ask questions or respond directly under an announcement.</p><div class="ann-admin-note">Command Staff and Instructors can remove comments or close a discussion when needed.</div></section></aside></div></div>`;
    selectedFilter='all';searchText='';
  }

  async function refresh(){await loadComments();renderPage();}

  async function submitComment(form){
    if(!sessionUser)return document.getElementById('signInBtn')?.click();
    const input=form.querySelector('input');const message=input?.value.trim();if(!message)return;
    const button=form.querySelector('button');if(button){button.disabled=true;button.textContent='Posting…';}
    const announcementId=form.dataset.commentForm;
    const {error}=await sb.from('announcement_comments').insert({announcement_id:Number(announcementId),author_id:sessionUser.id,message});
    if(error){alert(error.message);if(button){button.disabled=false;button.textContent='Post';}return;}
    await refresh();
    document.getElementById(`ann-thread-${announcementId}`)?.classList.add('open');
  }

  document.addEventListener('submit',e=>{
    const form=e.target.closest('[data-comment-form]');if(!form)return;e.preventDefault();submitComment(form);
  });

  document.addEventListener('click',async e=>{
    const filter=e.target.closest('[data-ann-filter]');
    if(filter){selectedFilter=filter.dataset.annFilter;document.querySelectorAll('#public-announcements [data-ann-filter]').forEach(b=>b.classList.toggle('active',b===filter));applyFilters();return;}
    const read=e.target.closest('[data-read-more]');
    if(read){const card=read.closest('.ann-post');card?.classList.toggle('expanded');read.textContent=card?.classList.contains('expanded')?'Show less':'Read more';return;}
    const comments=e.target.closest('[data-toggle-comments]');
    if(comments){document.getElementById(`ann-thread-${comments.dataset.toggleComments}`)?.classList.toggle('open');return;}
    const featured=e.target.closest('[data-featured-comments]');
    if(featured){document.getElementById(`ann-thread-${featured.dataset.featuredComments}`)?.classList.toggle('open');return;}
    if(e.target.closest('[data-ann-signin]')){document.getElementById('signInBtn')?.click();return;}
    const del=e.target.closest('[data-delete-ann-comment]');
    if(del){const {error}=await sb.from('announcement_comments').delete().eq('id',Number(del.dataset.deleteAnnComment));if(error)return alert(error.message);await refresh();return;}
    const lock=e.target.closest('[data-toggle-comment-lock]');
    if(lock){const id=Number(lock.dataset.toggleCommentLock);const a=getAnnouncements().find(x=>Number(x.id)===id);if(!a)return;const {error}=await sb.from('announcements').update({comments_enabled:a.comments_enabled===false}).eq('id',id);if(error)return alert(error.message);await loadPublicData();await refresh();return;}
  });

  document.addEventListener('input',e=>{if(e.target.id==='annSearch'){searchText=e.target.value;applyFilters();}});

  function hookNav(){
    document.querySelectorAll('[data-public="announcements"]').forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,80)));
  }

  function init(){addStyles();hookNav();setTimeout(refresh,500);setTimeout(refresh,1500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  sb.auth.onAuthStateChange(()=>setTimeout(refresh,120));
})();