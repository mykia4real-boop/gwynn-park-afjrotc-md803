(()=>{
  const ROLES=['command_staff','instructor'];
  const slots=[
    ['service_coat','Service Coat'],
    ['lightweight_jacket','Lightweight Jacket'],
    ['ocp','OCPs'],
    ['pt_gear','PT Gear']
  ];
  let rows={};
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const publicUrl=path=>sb.storage.from('uniform-guide').getPublicUrl(path).data.publicUrl;

  function addStyles(){
    if(document.getElementById('ugAdminStyles'))return;
    const s=document.createElement('style');s.id='ugAdminStyles';s.textContent=`
      #uniformGuideAdmin{background:#fff;border:1px solid #dfe6ee;border-radius:18px;padding:22px;margin:20px 0;box-shadow:0 8px 26px rgba(15,23,42,.05)}
      #uniformGuideAdmin h2{margin:0;color:#071d38}.uga-intro{color:#64748b;margin:6px 0 18px}.uga-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.uga-card{border:1px solid #e0e6ed;border-radius:16px;padding:16px;background:#f8fafc}.uga-card h3{margin:0 0 10px;color:#0b1f3a}.uga-preview{height:210px;border-radius:13px;border:1px dashed #cbd5e1;background:#fff;display:grid;place-items:center;overflow:hidden;margin-bottom:12px;color:#8492a6;text-align:center;padding:8px}.uga-preview img{width:100%;height:100%;object-fit:contain}.uga-card label{display:block;font-weight:800;color:#334155;font-size:12px;margin-top:10px}.uga-card input[type=file],.uga-card input[type=text]{display:block;width:100%;box-sizing:border-box;margin-top:6px}.uga-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.uga-save,.uga-remove{border:0;border-radius:10px;padding:10px 13px;font-weight:900;cursor:pointer}.uga-save{background:#ffd43b;color:#071d38}.uga-remove{background:#fee2e2;color:#991b1b}.uga-remove[disabled]{opacity:.45;cursor:not-allowed}.uga-status{min-height:20px;margin-top:12px;font-size:12px;color:#536174}.uga-note{margin-top:14px;background:#fff8d7;border:1px solid #efd980;border-radius:12px;padding:11px 13px;font-size:12px;color:#66531a}.uga-jump{border:0;background:#ffd43b;color:#071d38;border-radius:10px;padding:9px 12px;font-weight:900;cursor:pointer;margin-left:8px}
      @media(max-width:800px){.uga-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  async function loadRows(){
    const {data,error}=await sb.from('uniform_guide_images').select('*');
    if(error)throw error;
    rows={};(data||[]).forEach(r=>rows[r.slot]=r);
  }

  function render(){
    const root=document.getElementById('uniformGuideAdmin');if(!root)return;
    root.innerHTML=`<h2>Uniform Guide Photos</h2><p class="uga-intro">Upload or replace the real photos shown in the Uniform Guide. Changes appear on the guide automatically.</p><div class="uga-grid">${slots.map(([key,label])=>{
      const r=rows[key];
      return `<section class="uga-card" data-slot="${key}"><h3>${label}</h3><div class="uga-preview" id="ugaPreview-${key}">${r?`<img src="${esc(publicUrl(r.storage_path))}" alt="${esc(r.alt_text||label)}">`:'No photo uploaded yet'}</div><label>Choose photo<input id="ugaFile-${key}" type="file" accept="image/png,image/jpeg,image/webp"></label><label>Alt text<input id="ugaAlt-${key}" type="text" maxlength="160" value="${esc(r?.alt_text||`${label} uniform reference photo`)}"></label><div class="uga-actions"><button class="uga-save" type="button" data-upload-uniform="${key}">${r?'Replace Photo':'Upload Photo'}</button><button class="uga-remove" type="button" data-remove-uniform="${key}" ${r?'':'disabled'}>Remove</button></div><div class="uga-status" id="ugaStatus-${key}"></div></section>`;
    }).join('')}</div><div class="uga-note">Accepted files: JPG, PNG, or WebP, up to 8 MB. Only Command Staff and Instructors can change these photos.</div>`;
  }

  async function upload(slot){
    const input=document.getElementById(`ugaFile-${slot}`),status=document.getElementById(`ugaStatus-${slot}`),alt=document.getElementById(`ugaAlt-${slot}`);
    const file=input?.files?.[0];
    if(!file){status.textContent='Choose a photo first.';return;}
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){status.textContent='Use a JPG, PNG, or WebP image.';return;}
    if(file.size>8*1024*1024){status.textContent='That image is larger than 8 MB.';return;}
    status.textContent='Uploading…';
    const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const path=`${slot}/${Date.now()}-${safeName}`;
    const {error:upErr}=await sb.storage.from('uniform-guide').upload(path,file,{contentType:file.type,cacheControl:'3600',upsert:false});
    if(upErr){status.textContent=upErr.message;return;}
    const previous=rows[slot]?.storage_path;
    const {error:dbErr}=await sb.from('uniform_guide_images').upsert({slot,storage_path:path,alt_text:(alt?.value||'').trim(),updated_at:new Date().toISOString(),updated_by:sessionUser.id},{onConflict:'slot'});
    if(dbErr){await sb.storage.from('uniform-guide').remove([path]);status.textContent=dbErr.message;return;}
    if(previous&&previous!==path)await sb.storage.from('uniform-guide').remove([previous]);
    await loadRows();render();document.getElementById(`ugaStatus-${slot}`).textContent='Photo updated.';
  }

  async function remove(slot){
    const r=rows[slot];if(!r)return;
    const status=document.getElementById(`ugaStatus-${slot}`);status.textContent='Removing…';
    const {error:storageErr}=await sb.storage.from('uniform-guide').remove([r.storage_path]);
    if(storageErr){status.textContent=storageErr.message;return;}
    const {error}=await sb.from('uniform_guide_images').delete().eq('slot',slot);
    if(error){status.textContent=error.message;return;}
    await loadRows();render();
  }

  function preview(slot){
    const input=document.getElementById(`ugaFile-${slot}`),box=document.getElementById(`ugaPreview-${slot}`),file=input?.files?.[0];if(!file||!box)return;
    const url=URL.createObjectURL(file);box.innerHTML=`<img src="${url}" alt="Selected preview">`;
  }

  async function mount(){
    if(document.getElementById('uniformGuideAdmin'))return;
    if(typeof sb==='undefined'||typeof currentProfile==='undefined'||!currentProfile||!ROLES.includes(currentProfile.role))return;
    addStyles();
    const app=document.getElementById('adminApp');if(!app)return;
    const root=document.createElement('section');root.id='uniformGuideAdmin';
    const top=app.querySelector('.admin-top')||app.firstElementChild;
    if(top?.parentNode)top.parentNode.insertBefore(root,top.nextSibling);else app.prepend(root);
    const nav=app.querySelector('.admin-nav');
    if(nav&&!nav.querySelector('[data-jump-uniform-guide]')){const b=document.createElement('button');b.type='button';b.className='uga-jump';b.dataset.jumpUniformGuide='1';b.textContent='Uniform Guide Photos';b.addEventListener('click',()=>root.scrollIntoView({behavior:'smooth',block:'start'}));nav.appendChild(b);}
    await loadRows();render();
  }

  document.addEventListener('click',e=>{const up=e.target.closest('[data-upload-uniform]');if(up)upload(up.dataset.uploadUniform);const rm=e.target.closest('[data-remove-uniform]');if(rm&&!rm.disabled)remove(rm.dataset.removeUniform);});
  document.addEventListener('change',e=>{if(e.target?.id?.startsWith('ugaFile-'))preview(e.target.id.replace('ugaFile-',''));});
  let tries=0;const timer=setInterval(async()=>{tries++;try{await mount();if(document.getElementById('uniformGuideAdmin')||tries>50)clearInterval(timer);}catch(err){console.error('Uniform guide admin',err);if(tries>50)clearInterval(timer);}},300);
})();