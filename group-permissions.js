const GROUP_CREATOR_ROLES=["class_leader","command_staff","instructor"];
const canCreateGroups=()=>!!currentProfile&&GROUP_CREATOR_ROLES.includes(currentProfile.role);

function ensureClassLeaderGroupCreator(){
  const page=$("public-groups");
  if(!page)return;
  let box=$("classLeaderGroupCreator");
  if(!box){
    const layout=page.querySelector(".group-layout");
    if(!layout)return;
    layout.insertAdjacentHTML("beforebegin",`
      <article id="classLeaderGroupCreator" class="panel hidden" style="margin-bottom:20px">
        <div class="panel-title">CREATE GROUP</div>
        <p class="muted">Class Leaders can create private group discussions and choose who can join.</p>
        <form id="classLeaderGroupForm">
          <label>Group name<input id="classLeaderGroupName" required placeholder="Example: Alpha Flight"></label>
          <label>Description<textarea id="classLeaderGroupDescription" maxlength="300" placeholder="What is this group for?"></textarea></label>
          <label>Members</label>
          <div id="classLeaderMemberPicker" class="member-picker"><p class="muted">Loading members…</p></div>
          <button class="primary" type="submit">Create Group</button>
          <p id="classLeaderGroupStatus" class="muted"></p>
        </form>
      </article>`);
    box=$("classLeaderGroupCreator");
    $("classLeaderGroupForm").addEventListener("submit",createClassLeaderGroup);
  }

  const show=currentProfile?.role==="class_leader";
  box.classList.toggle("hidden",!show);
  if(show)loadClassLeaderMemberPicker();
}

async function loadClassLeaderMemberPicker(){
  const picker=$("classLeaderMemberPicker");
  if(!picker||currentProfile?.role!=="class_leader")return;
  const {data,error}=await sb.rpc("list_group_candidates");
  if(error){
    picker.innerHTML="<p class='muted'>Could not load members.</p>";
    console.error(error);
    return;
  }
  const rows=(data||[]).filter(p=>p.id!==sessionUser?.id);
  picker.innerHTML=rows.map(p=>`<label class="member-choice"><input type="checkbox" name="classLeaderMember" value="${p.id}"><span>${esc(p.full_name)} <small>(${esc(roleLabel(p.role))})</small></span></label>`).join("")||"<p class='muted'>No other members found.</p>";
}

async function createClassLeaderGroup(e){
  e.preventDefault();
  if(currentProfile?.role!=="class_leader"||!sessionUser)return;
  const status=$("classLeaderGroupStatus");
  const name=$("classLeaderGroupName").value.trim();
  const description=$("classLeaderGroupDescription").value.trim()||null;
  if(!name)return;
  status.textContent="Creating group…";

  const {data:group,error}=await sb.from("discussion_groups").insert({
    name,
    description,
    created_by:sessionUser.id
  }).select("*").single();

  if(error){status.textContent=error.message;return;}

  const selected=[...document.querySelectorAll('input[name="classLeaderMember"]:checked')].map(x=>x.value);
  const memberIds=[...new Set([sessionUser.id,...selected])];
  const {error:memberError}=await sb.from("discussion_group_members").insert(memberIds.map(user_id=>({group_id:group.id,user_id})));
  if(memberError){
    status.textContent="Group created, but some members could not be added.";
  }else{
    status.textContent="Group created.";
  }
  e.target.reset();
  await loadGroups();
  await loadClassLeaderMemberPicker();
}

const previousRenderAuthForGroups=renderAuth;
renderAuth=function(){
  previousRenderAuthForGroups();
  ensureClassLeaderGroupCreator();
};

const previousLoadSessionForGroups=loadSession;
loadSession=async function(){
  await previousLoadSessionForGroups();
  ensureClassLeaderGroupCreator();
};

ensureClassLeaderGroupCreator();
