(()=>{
const SUPABASE_URL='https://usoqblqosmnqsogddgtc.supabase.co';
const SUPABASE_KEY='sb_publishable_05451iVZPXWcag_IRyOv0g_rNlLA964';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
window.adminSupabase=sb;
const ADMIN_ROLES=['command_staff','instructor'];
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
let profile=null;
let profiles=[];
function roleLabel(r){return r==='command_staff'?'Command Staff':r==='class_leader'?'Class Leader':r==='instructor'?'Instructor':'Cadet'}
function fmtHours(n){const x=Number(n||0);return x.toLocaleString(undefined,{maximumFractionDigits:1})}
function fmtDateOnly(d){if(!d)return'';const [y,m,day]=d.split('-').map(Number);return new Date(Date.UTC(y,m-1,day)).toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'})}
function timeAgo(value){if(!value)return'';const ms=Date.now()-new Date(value).getTime();const min=Math.max(0,Math.floor(ms/60000));if(min<60)return `${min}m ago`;const h=Math.floor(min/60);if(h<24)return `${h}h ago`;const d=Math.floor(h/24);return `${d}d ago`}
function setGate(message=''){if($('gateStatus'))$('gateStatus').textContent=message}
function showGate(){ $('accessGate')?.classList.remove('hidden'); $('adminShell')?.classList.add('hidden'); }
function showApp(){ $('accessGate')?.classList.add('hidden'); $('adminShell')?.classList.remove('hidden'); }
async function loadProfile(user){const {data,error}=await sb.from('profiles').select('*').eq('id',user.id).single();if(error)throw error;return data}
async function start(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session){showGate();return}
  try{
    profile=await loadProfile(session.user);
    if(!ADMIN_ROLES.includes(profile?.role)){setGate('This account does not have Command Center access.');showGate();return}
    showApp();await renderCommandCenter();
  }catch(err){console.error(err);setGate('Could not verify your account. Please sign in again.');showGate()}
}
async function safeQuery(promise,fallback=[]){try{const {data,error}=await promise;if(error){console.warn(error);return fallback}return data??fallback}catch(e){console.warn(e);return fallback}}
async function renderCommandCenter(){
  $('adminUserName').textContent=profile.full_name||'Command Staff';
  $('adminUserRole').textContent=roleLabel(profile.role);
  $('welcomeName').textContent=profile.full_name?`Welcome back, ${profile.full_name.split(' ')[0]}.`:'Welcome back.';
  const now=new Date();
  $('dateMain').textContent=now.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  $('dateSub').textContent=now.toLocaleDateString('en-US',{weekday:'long'})+' · '+now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
  const today=now.toISOString().slice(0,10);
  const weekEnd=new Date(now);weekEnd.setDate(weekEnd.getDate()+7);const weekEndStr=weekEnd.toISOString().slice(0,10);
  const [p,s,e,a,l,g,u]=await Promise.all([
    safeQuery(sb.from('profiles').select('id,full_name,role,flight,position,created_at')),
    safeQuery(sb.from('community_service_hours').select('id,cadet_id,hours,organization,description,service_date,created_at').order('created_at',{ascending:false}).limit(60)),
    safeQuery(sb.from('events').select('*').gte('event_date',today).order('event_date',{ascending:true}).limit(30)),
    safeQuery(sb.from('announcements').select('*').order('created_at',{ascending:false}).limit(30)),
    safeQuery(sb.from('leadership_point_awards').select('*').order('created_at',{ascending:false}).limit(60)),
    safeQuery(sb.from('gallery_photos').select('*').order('created_at',{ascending:false}).limit(60)),
    safeQuery(sb.from('uniform_guide_images').select('*'))
  ]);
  profiles=p;const cadets=p.filter(x=>x.role!=='instructor');
  const totalHours=s.reduce((sum,x)=>sum+Number(x.hours||0),0);
  const pendingGallery=g.filter(x=>!x.approved).length;
  const slots=['service_coat','lightweight_jacket','ocp','pt_gear'];
  const filled=new Set(u.map(x=>x.slot));const missingUniform=Math.max(0,slots.filter(x=>!filled.has(x)).length);
  const priority=a.filter(x=>x.priority).length;
  const openTasks=pendingGallery+missingUniform+priority;
  $('statCadets').textContent=cadets.length;
  $('statHours').textContent=fmtHours(totalHours);
  $('statEvents').textContent=e.length;
  $('statTasks').textContent=openTasks;
  $('statTaskNote').textContent=openTasks?'Needs your attention':'All clear';
  renderEvents(e.slice(0,4));
  const leadershipTotal=l.reduce((sum,x)=>sum+Number(x.points||0),0);
  $('snapCommand').textContent=p.filter(x=>x.role==='command_staff').length;
  $('snapLeaders').textContent=p.filter(x=>x.role==='class_leader').length;
  $('snapLeadership').textContent=leadershipTotal.toLocaleString();
  $('snapUniform').textContent=`${filled.size}/4`;
  renderActivity({service:s.slice(0,10),announcements:a.slice(0,10),leadership:l.slice(0,10),gallery:g.slice(0,10)});
  const eventsWeek=e.filter(x=>x.event_date>=today&&x.event_date<=weekEndStr).length;
  renderAttention({pendingGallery,missingUniform,priority,eventsWeek});
}
function renderEvents(events){const box=$('eventList');if(!events.length){box.innerHTML='<p style="color:var(--muted);font-size:12px">No upcoming events.</p>';return}box.innerHTML=events.map(ev=>{const [y,m,d]=ev.event_date.split('-').map(Number);const dt=new Date(Date.UTC(y,m-1,d));return `<div class="event-row"><div class="event-date"><b>${dt.toLocaleDateString('en-US',{month:'short',timeZone:'UTC'}).toUpperCase()}</b><strong>${d}</strong></div><div class="event-copy"><b>${esc(ev.title)}</b><span>${esc((ev.start_time||'').slice(0,5))}${ev.end_time?' – '+esc(ev.end_time.slice(0,5)):''}${ev.location?' · '+esc(ev.location):''}</span></div></div>`}).join('')}
function renderActivity(data){const people=Object.fromEntries(profiles.map(p=>[p.id,p.full_name||'Cadet']));const items=[];data.service.forEach(x=>items.push({t:x.created_at,icon:'◷',kind:'green',title:`${people[x.cadet_id]||'Cadet'} logged ${fmtHours(x.hours)} service hours`,sub:x.organization||x.description||'Community service'}));data.announcements.forEach(x=>items.push({t:x.created_at,icon:'◉',kind:'gold',title:'Announcement posted',sub:x.title}));data.leadership.forEach(x=>items.push({t:x.created_at,icon:'★',kind:'purple',title:`${people[x.cadet_id]||'Cadet'} received ${x.points} leadership points`,sub:x.reason||'Leadership award'}));data.gallery.forEach(x=>items.push({t:x.created_at,icon:'▧',kind:'blue',title:x.approved?'Gallery photo added':'Gallery photo awaiting review',sub:x.caption||'Photo upload'}));items.sort((a,b)=>new Date(b.t)-new Date(a.t));const box=$('activityList');box.innerHTML=items.slice(0,6).map(x=>`<div class="activity-row"><div class="activity-dot ${x.kind}">${x.icon}</div><div class="activity-copy"><b>${esc(x.title)}</b><span>${esc(x.sub)}</span></div><div class="activity-time">${esc(timeAgo(x.t))}</div></div>`).join('')||'<p style="color:var(--muted);font-size:12px">No recent activity yet.</p>'}
function renderAttention(x){const cards=[
  {n:x.pendingGallery,label:'Gallery photos awaiting review',action:'content'},
  {n:x.missingUniform,label:'Uniform Guide photo slots missing',action:'uniform'},
  {n:x.priority,label:'Priority announcements posted',action:'announcements'},
  {n:x.eventsWeek,label:'Events happening in the next 7 days',action:'calendar'}
];$('attentionGrid').innerHTML=cards.map(c=>`<article class="attention-card"><b>${c.n}</b><span>${esc(c.label)}</span><button type="button" data-attention="${c.action}">Open →</button></article>`).join('')}
function futureSection(name){alert(`${name} will be built as its own workspace inside the new Admin Control Center. The old dashboard is no longer being used.`)}
document.addEventListener('click',e=>{
  const att=e.target.closest('[data-attention]');if(att){const a=att.dataset.attention;if(a==='uniform')location.href='/uniform.html';else if(a==='announcements')location.href='/?open=announcements';else if(a==='calendar')location.href='/?open=calendar';else futureSection('Content & Communication');return}
  const future=e.target.closest('[data-future]');if(future){futureSection(future.dataset.future);return}
});
$('loginForm')?.addEventListener('submit',async e=>{e.preventDefault();setGate('Signing in…');const fd=new FormData(e.currentTarget);const {error}=await sb.auth.signInWithPassword({email:String(fd.get('email')||'').trim(),password:String(fd.get('password')||'')});if(error){setGate(error.message);return}setGate('');await start()});
$('signOutBtn')?.addEventListener('click',async()=>{await sb.auth.signOut();location.reload()});
start();
})();