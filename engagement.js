(()=>{
  let postComments=[];
  let nameMap={};

  const canDeleteComment=c=>!!sessionUser&&(c.author_id===sessionUser.id||["command_staff","instructor"].includes(currentProfile?.role));
  const personName=id=>nameMap[id]||"AFJROTC Member";
  const when=ts=>new Date(ts).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"});

  function commentsFor(type,id){return postComments.filter(c=>c.target_type===type&&c.target_id===String(id));}
  function commentsUI(type,id){
    const rows=commentsFor(type,id);
    return `<div class="post-comments" data-comments-for="${type}:${esc(String(id))}">
      <div class="comment-list">${rows.map(c=>`<div class="comment-row"><div><b>${esc(personName(c.author_id))}</b><small>${esc(when(c.created_at))}</small><p>${esc(c.comment)}</p></div>${canDeleteComment(c)?`<button class="comment-delete" type="button" data-delete-comment="${c.id}" aria-label="Delete comment by ${esc(personName(c.author_id))}">Delete</button>`:""}</div>`).join("")||"<p class='muted comment-empty'>No comments yet.</p>"}</div>
      ${sessionUser?`<form class="comment-form" data-comment-type="${type}" data-comment-id="${esc(String(id))}"><label class="sr-only" for="comment-${type}-${esc(String(id))}">Add a comment</label><input id="comment-${type}-${esc(String(id))}" maxlength="500" required placeholder="Add a comment…"><button type="submit">Post</button></form>`:`<p class="comment-signin muted">Sign in to comment.</p>`}
    </div>`;
  }

  async function loadEngagement(){
    const ids=[
      ...announcements.map(x=>x.author_id),
      ...posts.map(x=>x.author_id),
      ...galleryPhotos.map(x=>x.uploader_id),
      ...postComments.map(x=>x.author_id)
    ].filter(Boolean);
    const unique=[...new Set(ids)];
    if(unique.length){
      const {data}=await sb.from("profiles").select("id,full_name,email").in("id",unique);
      nameMap=Object.fromEntries((data||[]).map(p=>[p.id,p.full_name||p.email||"AFJROTC Member"]));
    }
  }

  async function loadComments(){
    const {data,error}=await sb.from("post_comments").select("*").order("created_at",{ascending:true});
    if(error){console.error("Comments load error",error);postComments=[];return;}
    postComments=data||[];
    await loadEngagement();
  }

  function namedAnnouncementCard(a){
    const name=a.author_name||personName(a.author_id);
    return `<article class="card announcement-card post-with-comments"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p><small class="post-author">Posted by <b>${esc(name)}</b>${a.created_at?` • ${esc(when(a.created_at))}`:""}</small>${commentsUI("announcement",a.id)}</article>`;
  }

  function renderNamedPosts(){
    if($("publicAnnouncements"))$("publicAnnouncements").innerHTML=announcements.map(namedAnnouncementCard).join("")||"<p>No announcements yet.</p>";
    if($("publicHomeAnnouncements"))$("publicHomeAnnouncements").innerHTML=announcements.slice(0,3).map(namedAnnouncementCard).join("")||"<p>No announcements yet.</p>";
    if($("cadetAnnouncements"))$("cadetAnnouncements").innerHTML=announcements.slice(0,4).map(namedAnnouncementCard).join("")||"<p class='muted'>No announcements yet.</p>";

    if($("publicPosts"))$("publicPosts").innerHTML=posts.map(p=>`<article class="post post-with-comments"><b>${esc(p.title||"Cadet Post")}</b><p>${esc(p.message)}</p><small class="post-author">Posted by <b>${esc(personName(p.author_id))}</b>${p.created_at?` • ${esc(when(p.created_at))}`:""}</small>${commentsUI("message",p.id)}</article>`).join("")||"<p>No approved posts yet.</p>";
  }

  function renderNamedGallery(){
    if(!$("publicGallery"))return;
    const approved=galleryPhotos.filter(p=>p.approved);
    $("publicGallery").innerHTML=approved.map(p=>`<article class="photo-card post-with-comments"><img src="${galleryPublicUrl(p.storage_path)}" alt="${esc(p.caption||"AFJROTC gallery photo")}" loading="lazy"><div class="photo-caption"><p>${esc(p.caption||"")}</p><small class="post-author">Posted by <b>${esc(personName(p.uploader_id))}</b> • ${esc(when(p.created_at))}</small>${commentsUI("photo",p.id)}</div></article>`).join("")||"<p class='muted'>No gallery photos have been approved yet.</p>";
  }

  const previousLoadPublicData=loadPublicData;
  loadPublicData=async function(){
    await previousLoadPublicData();
    await loadComments();
    renderNamedPosts();
  };

  const previousLoadGallery=loadGallery;
  loadGallery=async function(){
    await previousLoadGallery();
    await loadComments();
    renderNamedGallery();
  };

  const previousRenderPublic=renderPublic;
  renderPublic=function(){previousRenderPublic();renderNamedPosts();};
  const previousRenderGallery=renderGallery;
  renderGallery=function(){previousRenderGallery();renderNamedGallery();};

  const previousRenderAuth=renderAuth;
  renderAuth=function(){previousRenderAuth();renderNamedPosts();renderNamedGallery();};

  document.addEventListener("submit",async e=>{
    const form=e.target.closest(".comment-form");
    if(!form)return;
    e.preventDefault();
    if(!sessionUser){alert("Sign in to comment.");return;}
    const input=form.querySelector("input");
    const comment=input.value.trim();
    if(!comment)return;
    const btn=form.querySelector("button");
    btn.disabled=true;
    const {error}=await sb.from("post_comments").insert({target_type:form.dataset.commentType,target_id:form.dataset.commentId,author_id:sessionUser.id,comment});
    btn.disabled=false;
    if(error){alert(error.message);return;}
    input.value="";
    await loadComments();
    renderNamedPosts();renderNamedGallery();
  });

  document.addEventListener("click",async e=>{
    const btn=e.target.closest("[data-delete-comment]");
    if(!btn)return;
    const {error}=await sb.from("post_comments").delete().eq("id",btn.dataset.deleteComment);
    if(error){alert(error.message);return;}
    await loadComments();renderNamedPosts();renderNamedGallery();
  });

  loadComments().then(()=>{renderNamedPosts();renderNamedGallery();});
})();
