(()=>{
  const BUCKET='message-board';
  let boardAuthors={};

  function css(){
    if(document.getElementById('messageBoardV53Styles'))return;
    const s=document.createElement('style');
    s.id='messageBoardV53Styles';
    s.textContent=`
      .board53-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:18px}.board53-head h1{margin:0 0 5px;font-size:2rem}.board53-head p{margin:0;color:#64748b}.board53-new{background:#ffd83d!important;color:#071528!important;border:0!important;font-weight:850!important;padding:12px 18px!important;border-radius:12px!important}
      .board53-banner{display:flex;align-items:center;gap:12px;padding:14px 16px;margin-bottom:18px;border:1px solid #f0cf58;border-radius:14px;background:#fff8d9;color:#5d4700}.board53-banner strong{display:block}.board53-shell{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:20px;align-items:start}.board53-main{min-width:0}.board53-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.board53-tabs{display:flex;gap:6px;padding:4px;background:#fff;border:1px solid #e2e8f0;border-radius:13px}.board53-tabs button{border:0;background:transparent;border-radius:9px;padding:9px 13px;font:inherit;font-weight:750;cursor:pointer}.board53-tabs button.active{background:#0b1b31;color:#fff}.board53-search{min-width:230px;max-width:340px;width:100%}
      .board53-composer{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:18px;margin-bottom:14px;box-shadow:0 8px 24px rgba(15,23,42,.05)}.board53-composer.hidden{display:none}.board53-composer label{display:grid;gap:6px;margin-bottom:12px;font-weight:750}.board53-composer input,.board53-composer textarea{width:100%;box-sizing:border-box}.board53-composer textarea{min-height:120px}.board53-composer-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.board53-file-note{font-size:.82rem;color:#64748b;margin-top:-5px}.board53-status{font-size:.9rem;margin-top:10px;color:#475569}
      .board53-feed{display:grid;gap:14px}.board53-post{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:18px 20px;box-shadow:0 8px 24px rgba(15,23,42,.045)}.board53-meta{display:flex;align-items:center;gap:9px;flex-wrap:wrap;color:#64748b;font-size:.88rem}.board53-avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#eaf2ff;color:#0b1b31;font-weight:900;flex:0 0 auto}.board53-posttop{display:grid;grid-template-columns:42px 1fr auto;gap:12px;align-items:start}.board53-tag{display:inline-flex;align-items:center;border-radius:999px;padding:4px 8px;background:#e8f1ff;color:#07559a;font-size:.72rem;font-weight:850;text-transform:uppercase;letter-spacing:.04em}.board53-post h3{margin:8px 0 6px;font-size:1.18rem}.board53-post p{margin:0;color:#475569;line-height:1.55;white-space:pre-wrap}.board53-time{font-size:.8rem;color:#64748b;white-space:nowrap}.board53-photo{display:block;width:100%;max-height:520px;object-fit:cover;border-radius:14px;margin-top:14px;border:1px solid #e2e8f0}.board53-actions{display:flex;gap:8px;margin-top:14px}.board53-actions button{border:1px solid #dbe3ee;background:#fff;border-radius:9px;padding:7px 10px;font-weight:750}.board53-actions .danger{color:#a61b1b;background:#fff5f5;border-color:#f0caca}
      .board53-side{display:grid;gap:14px;position:sticky;top:18px}.board53-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;box-shadow:0 8px 24px rgba(15,23,42,.045)}.board53-card h3{margin:0 0 12px;font-size:.9rem;letter-spacing:.04em}.board53-card p{color:#64748b;font-size:.9rem;line-height:1.45}.board53-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.board53-stat{text-align:center;padding:8px 3px}.board53-stat b{display:block;font-size:1.25rem}.board53-stat small{color:#64748b;font-size:.7rem}.board53-admin-note{padding:10px 12px;border-radius:11px;background:#f8fafc;color:#475569;font-size:.86rem;line-height:1.45}
      @media(max-width:950px){.board53-shell{grid-template-columns:1fr}.board53-side{position:static;grid-template-columns:repeat(2,minmax(0,1fr))}.board53-toolbar{align-items:stretch;flex-direction:column}.board53-search{max-width:none}.board53-head{align-items:stretch;flex-direction:column}.board53-composer-row{grid-template-columns:1fr}}
      @media(max-width:620px){.board53-side{grid-template-columns:1fr}.board53-tabs{overflow-x:auto}.board53-tabs button{white-space:nowrap}.board53-posttop{grid-template-columns:38px 1fr}.board53-time{grid-column:2}.board53-avatar{width:38px;height:38px}}
    `;
    document.head.appendChild(s);
  }

  const attachmentUrl=path=>path?sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl:'';
  const initials=name=>String(name||'Member').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'M';
  const when=value=>{
    const d=new Date(value); const sec=Math.max(1,(Date.now()-d.getTime())/1000);
    if(sec<3600)return `${Math.floor(sec/60)||1}m ago`;
    if(sec<86400)return `${Math.floor(sec/3600)}h ago`;
    if(sec<604800)return `${Math.floor(sec/86400)}d ago`;
    return d.toLocaleDateString();
  };

  async function loadAuthors(){
    const ids=[...new Set((posts||[]).map(p=>p.author_id).filter(Boolean))];
    boardAuthors={};
    if(!ids.length)return;
    const {data}=await sb.from('profiles').select('id,full_name').in('id',ids);
    (data||[]).forEach(p=>boardAuthors[p.id]=p.full_name||'Member');
  }

  function postCard(p,admin=false){
    const name=boardAuthors[p.author_id]||'AFJROTC Member';
    const own=sessionUser&&p.author_id===sessionUser.id;
    return `<article class="board53-post" data-board-post="${p.id}">
      <div class="board53-posttop">
        <div class="board53-avatar">${esc(initials(name))}</div>
        <div>
          <div class="board53-meta"><span class="board53-tag">General</span><span>Posted by ${esc(name)}</span>${p.pinned?'<span>📌 Pinned</span>':''}</div>
          <h3>${esc(p.title||'General Post')}</h3>
          <p>${esc(p.message)}</p>
          ${p.attachment_path?`<img class="board53-photo" src="${attachmentUrl(p.attachment_path)}" alt="Photo attachment from ${esc(name)}" loading="lazy">`:''}
          ${(admin||own)?`<div class="board53-actions"><button class="danger" data-board-delete="${p.id}" data-board-path="${esc(p.attachment_path||'')}">${admin?'Remove Post':'Delete My Post'}</button></div>`:''}
        </div>
        <span class="board53-time">${when(p.created_at)}</span>
      </div>
    </article>`;
  }

  function publicMarkup(){
    return `<div class="board53-head"><div><h1>Message Board</h1><p>Stay connected with the AFJROTC community.</p></div><button id="board53NewPost" class="board53-new ${sessionUser?'':'hidden'}" type="button">＋ New Post</button></div>
      <div class="board53-banner"><span>📣</span><div><strong>COMMUNITY BOARD</strong><span> Keep posts respectful and relevant to AFJROTC.</span></div></div>
      <div class="board53-shell"><div class="board53-main">
        <div class="board53-toolbar"><div class="board53-tabs"><button class="active" data-board-tab="all">All Posts</button><button data-board-tab="photos">Photos</button></div><input id="board53Search" class="board53-search" placeholder="Search posts..." aria-label="Search posts"></div>
        <form id="board53Composer" class="board53-composer ${sessionUser?'hidden':'hidden'}">
          <div class="board53-composer-row"><label>Post title<input id="board53Title" maxlength="120" placeholder="Optional"></label><label>Category<input value="General" disabled></label></div>
          <label>Message<textarea id="board53Message" maxlength="1000" required placeholder="Write your post..."></textarea></label>
          <label>Photo attachment (optional)<input id="board53Photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif"></label>
          <div class="board53-file-note">JPG, PNG, WEBP, or GIF • maximum 10 MB</div>
          <button class="primary" type="submit">Post to Message Board</button><div id="board53Status" class="board53-status"></div>
        </form>
        <div id="board53Feed" class="board53-feed"></div>
      </div><aside class="board53-side">
        <div class="board53-card"><h3>POSTING ACCESS</h3><p id="board53Access">${sessionUser?'Your account can create General posts and attach one photo.':'Guests can read posts. Sign in to create a General post or attach a photo.'}</p></div>
        <div class="board53-card"><h3>BOARD STATS</h3><div class="board53-stats"><div class="board53-stat"><b id="board53PostCount">0</b><small>Posts</small></div><div class="board53-stat"><b id="board53PeopleCount">0</b><small>People</small></div><div class="board53-stat"><b id="board53PhotoCount">0</b><small>Photos</small></div></div></div>
      </aside></div>`;
  }

  function adminMarkup(){
    return `<div class="board53-head"><div><h1>Message Board</h1><p>Moderate the same community board shown on the public site.</p></div></div>
      <div class="board53-banner"><span>🛡️</span><div><strong>MODERATION</strong><span> Account users can only create General posts. Photo attachments are supported.</span></div></div>
      <div class="board53-shell"><div class="board53-main"><div id="board53AdminFeed" class="board53-feed"></div></div><aside class="board53-side">
        <div class="board53-card"><h3>BOARD RULES</h3><div class="board53-admin-note">Signed-in users can create General posts only. Admins and instructors can remove any post from this page.</div></div>
        <div class="board53-card"><h3>BOARD STATS</h3><div class="board53-stats"><div class="board53-stat"><b>${posts.length}</b><small>Posts</small></div><div class="board53-stat"><b>${new Set(posts.map(p=>p.author_id).filter(Boolean)).size}</b><small>People</small></div><div class="board53-stat"><b>${posts.filter(p=>p.attachment_path).length}</b><small>Photos</small></div></div></div>
      </aside></div>`;
  }

  function renderFeed(){
    const feed=document.getElementById('board53Feed');
    if(!feed)return;
    const q=(document.getElementById('board53Search')?.value||'').trim().toLowerCase();
    const active=document.querySelector('[data-board-tab].active')?.dataset.boardTab||'all';
    const filtered=(posts||[]).filter(p=>active!=='photos'||p.attachment_path).filter(p=>!q||`${p.title||''} ${p.message||''} ${boardAuthors[p.author_id]||''}`.toLowerCase().includes(q));
    feed.innerHTML=filtered.map(p=>postCard(p,false)).join('')||'<div class="board53-card"><p>No posts match this view yet.</p></div>';
    const pc=document.getElementById('board53PostCount'), ppl=document.getElementById('board53PeopleCount'), ph=document.getElementById('board53PhotoCount');
    if(pc)pc.textContent=posts.length;if(ppl)ppl.textContent=new Set(posts.map(p=>p.author_id).filter(Boolean)).size;if(ph)ph.textContent=posts.filter(p=>p.attachment_path).length;
  }

  async function renderBoards(){
    await loadAuthors();
    const pub=document.getElementById('public-board');
    if(pub){pub.innerHTML=publicMarkup();wirePublic();renderFeed();}
    const admin=document.getElementById('admin-board');
    if(admin){admin.innerHTML=adminMarkup();const f=document.getElementById('board53AdminFeed');if(f)f.innerHTML=posts.map(p=>postCard(p,true)).join('')||'<div class="board53-card"><p>No posts yet.</p></div>';}
  }

  function wirePublic(){
    document.getElementById('board53NewPost')?.addEventListener('click',()=>document.getElementById('board53Composer')?.classList.toggle('hidden'));
    document.getElementById('board53Search')?.addEventListener('input',renderFeed);
    document.querySelectorAll('[data-board-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-board-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderFeed();}));
    const form=document.getElementById('board53Composer');
    if(form)form.onsubmit=submitPost;
  }

  async function submitPost(e){
    e.preventDefault();
    if(!sessionUser)return alert('Sign in first.');
    const title=document.getElementById('board53Title').value.trim()||null;
    const message=document.getElementById('board53Message').value.trim();
    const file=document.getElementById('board53Photo').files[0]||null;
    const status=document.getElementById('board53Status');
    if(!message)return;
    if(file&&file.size>10*1024*1024){status.textContent='Photo must be 10 MB or smaller.';return;}
    if(file&&!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)){status.textContent='Please choose a JPG, PNG, WEBP, or GIF image.';return;}
    status.textContent=file?'Uploading photo...':'Posting...';
    let path=null;
    if(file){
      const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
      path=`${sessionUser.id}/${crypto.randomUUID()}.${ext}`;
      const {error:upErr}=await sb.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false});
      if(upErr){status.textContent=upErr.message;return;}
    }
    const {error}=await sb.from('message_posts').insert({author_id:sessionUser.id,title,message,category:'General',attachment_path:path,approved:true});
    if(error){if(path)await sb.storage.from(BUCKET).remove([path]);status.textContent=error.message;return;}
    e.target.reset();status.textContent='Posted!';
    await loadPublicData();
  }

  document.addEventListener('click',async e=>{
    const del=e.target.closest('[data-board-delete]');
    if(!del)return;
    if(!confirm('Remove this post?'))return;
    const id=del.dataset.boardDelete,path=del.dataset.boardPath||'';
    const {error}=await sb.from('message_posts').delete().eq('id',id);
    if(error)return alert(error.message);
    if(path)await sb.storage.from(BUCKET).remove([path]);
    await loadPublicData();
    if(typeof renderAdmin==='function'&&!document.getElementById('adminApp')?.classList.contains('hidden'))renderAdmin();
  });

  const oldRenderPublic=renderPublic;
  renderPublic=function(){oldRenderPublic();setTimeout(renderBoards,0);};
  const oldRenderAuth=renderAuth;
  renderAuth=function(){oldRenderAuth();setTimeout(renderBoards,0);};
  const oldRenderAdmin=renderAdmin;
  renderAdmin=function(){oldRenderAdmin();setTimeout(renderBoards,0);};

  css();
  setTimeout(renderBoards,150);
})();