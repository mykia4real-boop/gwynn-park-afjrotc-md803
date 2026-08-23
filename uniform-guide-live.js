(()=>{
  const SUPABASE_URL='https://usoqblqosmnqsogddgtc.supabase.co';
  const SUPABASE_KEY='sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964';
  const map={service_coat:'#service',lightweight_jacket:'#lightweight',ocp:'#ocp',pt_gear:'#pt'};
  const labels={service_coat:'Service Coat',lightweight_jacket:'Lightweight Jacket',ocp:'OCPs',pt_gear:'Military-Issued PT Gear'};
  const defaults={service_coat:{url:'/assets/service-coat.jpg',alt:'AFJROTC service coat reference photo'}};

  function addStyles(){
    if(document.getElementById('uniformGuideLiveStyles'))return;
    const s=document.createElement('style');s.id='uniformGuideLiveStyles';s.textContent=`
      .figure-stage.has-live-photo{padding:14px;background:#fff;min-height:0!important;display:block!important}
      .figure-stage.has-live-photo svg,.figure-stage.has-live-photo .callout{display:none!important}
      .uniform-guide-live-photo{display:block!important;width:100%!important;height:auto!important;max-width:100%!important;max-height:560px;object-fit:contain;border-radius:12px;visibility:visible!important;opacity:1!important;position:relative!important;z-index:1}
      .figure-stage.has-live-photo .image-label{z-index:2;box-shadow:0 4px 14px rgba(15,23,42,.12)}
      .guide-card .embedded-uniform-photo{margin:14px 0 16px;border-radius:16px;overflow:hidden;background:#f7f9fc;border:1px solid rgba(130,155,180,.22)}
      .guide-card .embedded-uniform-photo .figure-stage{min-height:0!important;padding:10px!important;background:#fff!important}
      .guide-card .embedded-uniform-photo img{display:block!important;width:100%!important;height:auto!important;max-height:520px!important;object-fit:contain!important}
      @media(max-width:620px){
        .uniform-figure:has(.uniform-guide-live-photo){min-height:0!important}
        .figure-stage.has-live-photo{padding:10px!important;min-height:0!important;width:100%!important;overflow:visible!important}
        .uniform-guide-live-photo{width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;border-radius:10px!important}
        .guide-card .embedded-uniform-photo{margin:12px 0 14px!important;border-radius:14px!important}
        .guide-card .embedded-uniform-photo .figure-stage{padding:8px!important}
        .guide-card .embedded-uniform-photo img{width:100%!important;max-height:none!important;min-height:0!important}
      }
    `;document.head.appendChild(s);
  }

  function findEmbeddedCard(slot){
    const target=labels[slot];
    if(!target)return null;
    return [...document.querySelectorAll('#public-uniform-guide .guide-card')].find(card=>{
      const h=card.querySelector('h2,h3');
      return h && h.textContent.trim()===target;
    })||null;
  }

  function ensureEmbeddedStage(card,slot){
    let wrap=card.querySelector(`.embedded-uniform-photo[data-slot="${slot}"]`);
    if(wrap)return wrap.querySelector('.figure-stage');
    wrap=document.createElement('div');
    wrap.className='embedded-uniform-photo';
    wrap.dataset.slot=slot;
    const stage=document.createElement('div');
    stage.className='figure-stage';
    wrap.appendChild(stage);
    const chip=card.querySelector('.guide-chip');
    const heading=card.querySelector('h2,h3');
    if(heading) heading.insertAdjacentElement('afterend',wrap);
    else if(chip) chip.insertAdjacentElement('afterend',wrap);
    else card.prepend(wrap);
    return stage;
  }

  function resolve(slot){
    const standalone=document.querySelector(map[slot]);
    if(standalone){
      const stage=standalone.querySelector('.figure-stage');
      if(stage)return {section:standalone,stage};
    }
    const card=findEmbeddedCard(slot);
    if(card)return {section:card,stage:ensureEmbeddedStage(card,slot)};
    return null;
  }

  function placePhoto(slot,url,alt){
    const target=resolve(slot);if(!target)return false;
    const {section,stage}=target;
    let img=stage.querySelector('.uniform-guide-live-photo');
    if(!img){img=document.createElement('img');img.className='uniform-guide-live-photo';stage.appendChild(img);}
    img.alt=alt||'AFJROTC uniform reference photo';img.loading='eager';img.decoding='async';
    img.onload=()=>stage.classList.add('has-live-photo');
    img.onerror=()=>{console.error('Could not load uniform guide photo',slot,url);stage.classList.remove('has-live-photo');};
    img.src=url;
    if(img.complete&&img.naturalWidth>0)stage.classList.add('has-live-photo');
    const caption=section.querySelector('.figure-caption');if(caption)caption.textContent='Photo reference maintained by AFJROTC staff. Follow current unit instructions for authorized wear and placement.';
    return true;
  }

  async function init(){
    if(!window.supabase){setTimeout(init,120);return}
    addStyles();
    const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    const {data,error}=await client.from('uniform_guide_images').select('slot,storage_path,alt_text');
    const rows=error?[]:(data||[]);if(error)console.error('Uniform guide photos',error);
    const bySlot=new Map(rows.map(row=>[row.slot,row]));
    const apply=()=>{
      Object.entries(defaults).forEach(([slot,item])=>{if(!bySlot.has(slot))placePhoto(slot,item.url,item.alt);});
      rows.forEach(row=>{const url=client.storage.from('uniform-guide').getPublicUrl(row.storage_path).data.publicUrl;placePhoto(row.slot,url,row.alt_text);});
    };
    apply();setTimeout(apply,500);setTimeout(apply,1500);setTimeout(apply,3000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();