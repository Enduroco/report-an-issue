'use client';
import { useEffect, useMemo, useState } from 'react';

type Staff={id:string;name:string;active:boolean};
type Issue={id:string;staff_name:string;issue_type:string;location:string;description:string;immediate_action:string|null;priority:string;status:string;responsible_person:string|null;due_date:string|null;completion_date:string|null;manager_comments:string|null;corrective_action:string|null;created_at:string;photo_url:string|null};
type AdminRole='manager'|'quality_control'|null;

const RESPONSIBLE_PEOPLE=['Jason','Josh','Jhon','John R','Danny','Lee-Anne'];

export default function Page(){
 const [siteChecked,setSiteChecked]=useState(false); const [siteAccess,setSiteAccess]=useState(false); const [sitePin,setSitePin]=useState('');
 const [tab,setTab]=useState<'report'|'manager'>('report'); const [staff,setStaff]=useState<Staff[]>([]); const [issues,setIssues]=useState<Issue[]>([]); const [msg,setMsg]=useState('');
 const [adminRole,setAdminRole]=useState<AdminRole>(null); const [pin,setPin]=useState(''); const [filter,setFilter]=useState('Open'); const [newStaff,setNewStaff]=useState('');
 const [form,setForm]=useState({staff_name:'',issue_type:'Hazard / Safety',location:'Workshop',description:'',immediate_action:'',priority:'Medium'}); const [photo,setPhoto]=useState<File|null>(null); const [submitting,setSubmitting]=useState(false); const [submitted,setSubmitted]=useState(false); const [submitNote,setSubmitNote]=useState('');

 const checkSite=async()=>{try{const r=await fetch('/api/site/status',{cache:'no-store'});const j=await r.json();setSiteAccess(Boolean(j.access));if(j.access)await load();}finally{setSiteChecked(true)}};
 const load=async()=>{ const [s,i]=await Promise.all([fetch('/api/manager/staff',{cache:'no-store'}),fetch('/api/issues',{cache:'no-store'})]); const sj=await s.json(), ij=await i.json(); if(sj.staff)setStaff(sj.staff); if(ij.issues)setIssues(ij.issues); };
 useEffect(()=>{checkSite()},[]);
 const siteLogin=async()=>{setMsg('');const r=await fetch('/api/site/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pin:sitePin})});const j=await r.json();if(!r.ok){setMsg(j.error||'Login failed');return;}setSiteAccess(true);setSitePin('');setMsg('');await load();};
 const siteLogout=async()=>{await fetch('/api/site/logout',{method:'POST'});setSiteAccess(false);setAdminRole(null);setIssues([]);setStaff([]);setTab('report');};
 const submit=async()=>{if(submitting)return;setSubmitting(true);setMsg('');setSubmitNote('');try{const r=await fetch('/api/issues',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const j=await r.json(); if(!r.ok){setMsg(j.error||'Could not submit issue');return;} let photoFailed=''; if(photo){const fd=new FormData();fd.append('file',photo);const p=await fetch(`/api/issues/${j.issue.id}/photo`,{method:'POST',body:fd});const pj=await p.json(); if(!p.ok)photoFailed=`The issue was saved, but the photo could not be uploaded: ${pj.error}`;}
 setSubmitNote(photoFailed);setSubmitted(true);setForm({staff_name:'',issue_type:'Hazard / Safety',location:'Workshop',description:'',immediate_action:'',priority:'Medium'});setPhoto(null);const camera=document.getElementById('cameraPhoto') as HTMLInputElement|null;const library=document.getElementById('libraryPhoto') as HTMLInputElement|null;if(camera)camera.value='';if(library)library.value='';await load();}finally{setSubmitting(false)} };
 const login=async()=>{setMsg('');const r=await fetch('/api/manager/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pin})}); const j=await r.json(); if(r.ok){setAdminRole(j.role==='quality_control'?'quality_control':'manager');setPin('');setMsg(j.role==='quality_control'?'Quality Control access enabled.':'Manager access enabled.');await load();}else setMsg(j.error||'Login failed')};
 const adminLogout=async()=>{await fetch('/api/manager/logout',{method:'POST'});setAdminRole(null);setMsg('Manager access logged out.');};
 const saveIssue=async(id:string,patch:Record<string,unknown>)=>{const r=await fetch(`/api/manager/issues/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)});const j=await r.json();if(!r.ok){setMsg(j.error||'Update failed');return;}setMsg('Issue updated.');await load();};
 const deleteIssue=async(id:string)=>{const reason=window.prompt('Reason for deleting this report? This will be retained in the audit record.');if(!reason?.trim())return;const r=await fetch(`/api/manager/issues/${id}/delete`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason})});const j=await r.json();if(!r.ok){setMsg(j.error||'Delete failed');return;}setMsg('Report removed from the active register.');await load();};
 const addStaff=async()=>{const r=await fetch('/api/manager/staff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:newStaff})});const j=await r.json();if(!r.ok){setMsg(j.error||'Could not add staff');return;}setNewStaff('');await load();setMsg('Staff member added.');};
 const today=new Date().toISOString().slice(0,10);
 const shown=useMemo(()=>issues.filter(x=>filter==='All'||(filter==='Open'?x.status!=='Closed':filter==='Closed'?x.status==='Closed':filter==='Overdue'?x.status!=='Closed'&&!!x.due_date&&x.due_date<today:filter==='High'?x.status!=='Closed'&&x.priority==='High':true)),[issues,filter,today]);
 const open=issues.filter(x=>x.status!=='Closed').length, high=issues.filter(x=>x.status!=='Closed'&&x.priority==='High').length, overdue=issues.filter(x=>x.status!=='Closed'&&x.due_date&&x.due_date<today).length;

 if(!siteChecked)return <main className="wrap"><div className="loginShell"><div className="brandMark">ENDUROCO</div><p className="muted">Loading Report an Issue…</p></div></main>;
 if(!siteAccess)return <main className="wrap"><div className="loginShell"><div className="brandMark">ENDUROCO</div><h1>Report an Issue</h1><p className="muted">This is a private EnduroCo application. Enter the site access PIN to continue.</p><div className="field"><label>Site access PIN</label><input type="password" inputMode="numeric" value={sitePin} onChange={e=>setSitePin(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')siteLogin()}}/></div><button className="btn primary full" onClick={siteLogin}>LOGIN</button><div className="msg">{msg}</div></div></main>;

 return <main className="wrap">
  {submitted&&<div className="submitOverlay" role="dialog" aria-modal="true" aria-labelledby="submitSuccessTitle"><div className="submitSuccess"><div className="successIcon">✓</div><h2 id="submitSuccessTitle">Issue submitted successfully</h2><p>Your report has been received and saved.</p>{submitNote&&<p className="submitWarning">{submitNote}</p>}<button className="btn primary full" onClick={()=>{setSubmitted(false);setSubmitNote('')}}>REPORT ANOTHER ISSUE</button></div></div>}
  <div className="appHeader"><div><div className="brandMark smallBrand">ENDUROCO</div><div className="muted">Report an Issue</div></div><button className="btn compact" onClick={siteLogout}>Log out</button></div>
  <div className="top"><button className={`tab ${tab==='report'?'active':''}`} onClick={()=>setTab('report')}>Report an Issue</button><button className={`tab ${tab==='manager'?'active':''}`} onClick={()=>setTab('manager')}>Manager Issues</button></div>
  {tab==='report'&&<>
   <div className="card"><h2>Report an Issue</h2><p className="muted">Report hazards, quality concerns, equipment issues, workplace problems or other matters requiring follow-up.</p>
    <div className="grid">
     <div className="field"><label>Staff member</label><select value={form.staff_name} onChange={e=>setForm({...form,staff_name:e.target.value})}><option value="">Select staff member</option>{staff.filter(s=>s.active).map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</select></div>
     <div className="field"><label>Issue type</label><select value={form.issue_type} onChange={e=>setForm({...form,issue_type:e.target.value})}><option>Hazard / Safety</option><option>Quality / NCR</option><option>Equipment / Tool</option><option>Vehicle / Production</option><option>Housekeeping</option><option>Process / Procedure</option><option>Other</option></select></div>
     <div className="field"><label>Area / Location</label><select value={form.location} onChange={e=>setForm({...form,location:e.target.value})}><option>Workshop</option><option>Warehouse</option><option>Office</option><option>Engineering</option><option>Yard</option><option>Vehicle</option><option>Other</option></select></div>
     <div className="field"><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></div>
     <div className="field spanAll"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe what happened or what you observed."/></div>
     <div className="field spanAll"><label>Immediate action taken</label><textarea value={form.immediate_action} onChange={e=>setForm({...form,immediate_action:e.target.value})} placeholder="e.g. isolated equipment, cleaned spill, advised supervisor"/></div>
     <div className="field spanAll"><label>Photo (optional)</label><div className="photoChoices"><label className="photoButton">📷 Take photo<input id="cameraPhoto" className="visuallyHidden" type="file" accept="image/*" capture="environment" onChange={e=>setPhoto(e.target.files?.[0]||null)}/></label><label className="photoButton">🖼 Choose existing photo<input id="libraryPhoto" className="visuallyHidden" type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0]||null)}/></label></div><div className="muted">{photo?`Selected: ${photo.name}`:'Maximum 8 MB. On a phone or tablet, Take photo opens the rear camera.'}</div></div>
    </div>
    <button className="btn primary full" onClick={submit} disabled={submitting}>{submitting?'SUBMITTING…':'SUBMIT ISSUE'}</button><div className="msg">{msg}</div>
   </div>
  </>}
  {tab==='manager'&&<>
   {!adminRole?<div className="card"><h2>Manager / Quality Control Access</h2><p className="muted">Managers can manage issues. Quality Control has the additional ability to remove unnecessary reports.</p><div className="field"><label>Manager or Quality Control PIN</label><input type="password" inputMode="numeric" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')login()}} /></div><br/><button className="btn primary" onClick={login}>LOGIN</button><div className="msg">{msg}</div></div>:<>
    <div className="adminBar"><span className="badge role">{adminRole==='quality_control'?'QUALITY CONTROL':'MANAGER'}</span><button className="btn compact" onClick={adminLogout}>Admin log out</button></div>
    <div className="grid4"><button className="metric metricButton" onClick={()=>setFilter('Open')}><span className="muted">Open issues</span><b>{open}</b></button><button className="metric metricButton" onClick={()=>setFilter('High')}><span className="muted">High priority</span><b>{high}</b></button><button className="metric metricButton" onClick={()=>setFilter('Overdue')}><span className="muted">Overdue</span><b>{overdue}</b></button><button className="metric metricButton" onClick={()=>setFilter('Closed')}><span className="muted">Closed</span><b>{issues.filter(x=>x.status==='Closed').length}</b></button></div>
    <div className="card"><div className="row"><div><h2>Issue Register</h2><div className="muted">Manage actions, responsibility, due dates and closure.</div></div><div className="field filterField"><label>Show</label><select value={filter} onChange={e=>setFilter(e.target.value)}><option>Open</option><option>Overdue</option><option>Closed</option><option>All</option></select></div></div>{shown.length?shown.map(i=><IssueCard key={i.id} issue={i} save={saveIssue} canDelete={adminRole==='quality_control'} remove={deleteIssue}/>):<div className="emptyState">No issues match this filter.</div>}</div>
    <div className="card"><h2>Staff for Issue Reporting</h2><div className="row"><div className="field grow"><label>Add staff member</label><input value={newStaff} onChange={e=>setNewStaff(e.target.value)} placeholder="Name"/></div><button className="btn" onClick={addStaff}>ADD STAFF</button></div><div className="muted staffList">{staff.map(s=>s.name).join(', ')}</div></div>
    <div className="msg">{msg}</div>
   </>}
  </>}
 </main>
}

function IssueCard({issue,save,canDelete,remove}:{issue:Issue;save:(id:string,p:Record<string,unknown>)=>Promise<void>;canDelete:boolean;remove:(id:string)=>Promise<void>}){
 const [x,setX]=useState({priority:issue.priority,responsible_person:issue.responsible_person||'',due_date:issue.due_date||'',status:issue.status,completion_date:issue.completion_date||'',corrective_action:issue.corrective_action||'',manager_comments:issue.manager_comments||''});
 const overdue=issue.status!=='Closed'&&!!issue.due_date&&issue.due_date<new Date().toISOString().slice(0,10);
 return <div className="issue"><div className="row"><div><b>{issue.issue_type}</b> <span className={`badge ${issue.priority==='High'?'high':''} ${issue.status==='Closed'?'closed':''}`}>{issue.priority} · {issue.status}</span>{overdue&&<span className="badge overdue">OVERDUE</span>}<div className="muted">{issue.staff_name||'Unknown'} · {issue.location} · {new Date(issue.created_at).toLocaleString()}</div></div></div><p>{issue.description}</p>{issue.immediate_action&&<p className="small"><b>Immediate action:</b> {issue.immediate_action}</p>}{issue.photo_url&&<a href={issue.photo_url} target="_blank" rel="noreferrer"><img className="photo" src={issue.photo_url} alt="Issue attachment"/></a>}
 <div className="grid3">
  <div className="field"><label>Priority</label><select value={x.priority} onChange={e=>setX({...x,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></div>
  <div className="field"><label>Responsible person</label><select value={x.responsible_person} onChange={e=>setX({...x,responsible_person:e.target.value})}><option value="">Select responsible person</option>{RESPONSIBLE_PEOPLE.map(name=><option key={name}>{name}</option>)}</select></div>
  <div className="field"><label>Due date</label><input type="date" value={x.due_date} onChange={e=>setX({...x,due_date:e.target.value})}/></div>
  <div className="field"><label>Status</label><select value={x.status} onChange={e=>setX({...x,status:e.target.value})}><option>Open</option><option>Under Review</option><option>Action Required</option><option>Closed</option></select></div>
  <div className="field"><label>Completion date</label><input type="date" value={x.completion_date} onChange={e=>setX({...x,completion_date:e.target.value})}/></div>
  <div className="field"><label>Corrective action</label><input value={x.corrective_action} onChange={e=>setX({...x,corrective_action:e.target.value})}/></div>
  <div className="field spanAll"><label>Manager comments</label><textarea value={x.manager_comments} onChange={e=>setX({...x,manager_comments:e.target.value})}/></div>
 </div><div className="actions"><button className="btn primary" onClick={()=>save(issue.id,x)}>SAVE CHANGES</button>{canDelete&&<button className="btn danger" onClick={()=>remove(issue.id)}>DELETE REPORT</button>}</div></div>
}
