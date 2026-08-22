(()=>{
  const SUPABASE_URL='https://usoqblqosmnqsogddgtc.supabase.co';
  const SUPABASE_KEY='sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964';
  const map={service_coat:'#service',lightweight_jacket:'#lightweight',ocp:'#ocp',pt_gear:'#pt'};

  function addStyles(){
    if(document.getElementById('uniformGuideLiveStyles'))return;
    const s=document.createElement('style');s.id='uniformGuideLiveStyles';s.textContent=`
      .figure-stage.has-live-photo{padding:14px;background:#fff}.figure-stage.has-live-photo svg,.figure-stage.has-live-photo .callout{display:none!important}.uniform-guide-live-photo{display:block;width:100%;max-height:560px;object-fit:contain;border-radius:12px}.figure-stage.has-live-photo .image-label{z-index:2;box-shadow:0 4px 14px rgba(15,23,42,.12)}
    `;document.head.appendChild(s);
  }

  async function init(){
    if(!window.supabase)return;
    addStyles();
    const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    const {data,error}=await client.from('uniform_guide_images').select('slot,storage_path,alt_text');
    if(error){console.error('Uniform guide photos',error);return;}
    (data||[]).forEach(row=>{
      const section=document.querySelector(map[row.slot]);if(!section)return;
      const stage=section.querySelector('.figure-stage');if(!stage)return;
      const url=client.storage.from('uniform-guide').getPublicUrl(row.storage_path).data.publicUrl;
      let img=stage.querySelector('.uniform-guide-live-photo');
      if(!img){img=document.createElement('img');img.className='uniform-guide-live-photo';stage.appendChild(img);}
      img.src=url;img.alt=row.alt_text||'AFJROTC uniform reference photo';stage.classList.add('has-live-photo');
      const caption=section.querySelector('.figure-caption');if(caption)caption.textContent='Photo reference maintained by AFJROTC staff. Follow current unit instructions for authorized wear and placement.';
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();