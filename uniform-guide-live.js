(()=>{
  const SUPABASE_URL='https://usoqblqosmnqsogddgtc.supabase.co';
  const SUPABASE_KEY='sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964';
  const map={service_coat:'#service',lightweight_jacket:'#lightweight',ocp:'#ocp',pt_gear:'#pt'};
  const defaults={service_coat:{url:'/assets/service-coat.jpg',alt:'AFJROTC service coat reference photo'}};

  function addStyles(){
    if(document.getElementById('uniformGuideLiveStyles'))return;
    const s=document.createElement('style');s.id='uniformGuideLiveStyles';s.textContent=`
      .figure-stage.has-live-photo{padding:14px;background:#fff}.figure-stage.has-live-photo svg,.figure-stage.has-live-photo .callout{display:none!important}.uniform-guide-live-photo{display:block;width:100%;max-height:560px;object-fit:contain;border-radius:12px}.figure-stage.has-live-photo .image-label{z-index:2;box-shadow:0 4px 14px rgba(15,23,42,.12)}
    `;document.head.appendChild(s);
  }

  function placePhoto(slot,url,alt){
    const section=document.querySelector(map[slot]);if(!section)return;
    const stage=section.querySelector('.figure-stage');if(!stage)return;
    let img=stage.querySelector('.uniform-guide-live-photo');
    if(!img){img=document.createElement('img');img.className='uniform-guide-live-photo';stage.appendChild(img);}
    img.src=url;img.alt=alt||'AFJROTC uniform reference photo';stage.classList.add('has-live-photo');
    const caption=section.querySelector('.figure-caption');if(caption)caption.textContent='Photo reference maintained by AFJROTC staff. Follow current unit instructions for authorized wear and placement.';
  }

  async function init(){
    if(!window.supabase)return;
    addStyles();
    const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    const {data,error}=await client.from('uniform_guide_images').select('slot,storage_path,alt_text');
    const rows=error?[]:(data||[]);
    if(error)console.error('Uniform guide photos',error);
    const bySlot=new Map(rows.map(row=>[row.slot,row]));
    Object.entries(defaults).forEach(([slot,item])=>{if(!bySlot.has(slot))placePhoto(slot,item.url,item.alt);});
    rows.forEach(row=>{
      const url=client.storage.from('uniform-guide').getPublicUrl(row.storage_path).data.publicUrl;
      placePhoto(row.slot,url,row.alt_text);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();