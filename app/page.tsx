'use client';
import { useEffect, useMemo, useState } from 'react';

type Staff={id:string;name:string;active:boolean};
type Issue={id:string;staff_name:string;issue_type:string;location:string;description:string;immediate_action:string|null;priority:string;status:string;responsible_person:string|null;due_date:string|null;completion_date:string|null;manager_comments:string|null;corrective_action:string|null;created_at:string;photo_url:string|null};

export default function Page(){
 const [tab,setTab]=useState<'report'|'manager'>('report'); const [staff,setStaff]=useState<Staff[]>([]); const [issues,setIssues]=useState<Issue[]>([]); const [msg,setMsg]=useState(''); const [manager,setManager]=useState(false); const [pin,setPin]=useState(''); const [filter,setFilter]=useState('Open'); const [newStaff,setNewStaff]=useState('');
 const [form,setForm]=useState({staff_name:'',issue_type:'Hazard / Safety',location:'Workshop',description:'',immediate_action:'',priority:'Medium'}); const [photo,setPhoto]=useState<File|null>(null);
 const load=async()=>{ const [s,i]=await Promise.all([fetch('/api/manager/staff'),fetch('/api/issues')]); const sj=await s.json(), ij=await i.json(); if(sj.staff)setStaff(sj.staff); if(ij.issues)setIssues(ij.issues); };
 useEffect(()=>{load()},[]);
 const submit=async()=>{setMsg(''); const r=await fetch('/api/issues',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const j=await r.json(); if(!r.ok){setMsg(j.error||'Could not submit issue');return;} if(photo){const fd=new FormData();fd.append('file',photo);const p=await fetch(`/api/issues/${j.issue.id}/photo`,{method:'POST',body:fd});const pj=await p.json(); if(!p.ok)setMsg(`Issue saved, but photo failed: ${pj.error}`);}
 if(!msg)setMsg('Issue submitted successfully.'); setForm({staff_name:'',issue_type:'Hazard / Safety',location:'Workshop',description:'',immediate_action:'',priority:'Medium'});setPhoto(null);await load(); };
 const login=async()=>{const r=await fetch('/api/manager/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pin})}); if(r.ok){setManager(true);setPin('');setMsg('Manager access enabled.')}else{const j=await r.json();setMsg(j.error||'Login failed')}};
 const saveIssue=async(id:string,patch:Record<string,unknown>)=>{const r=await fetch(`/api/manager/issues/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)});const j=await r.json();if(!r.ok){setMsg(j.error||'Update failed');return;}setMsg('Issue updated.');await load();};
 const addStaff=async()=>{const r=await fetch('/api/manager/staff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:newStaff})});const j=await r.json();if(!r.ok){setMsg(j.error||'Could not add staff');return;}setNewStaff('');await load();setMsg('Staff member added.');};
 const shown=useMemo(()=>issues.filter(x=>filter==='All'||(filter==='Open'?x.status!=='Closed':x.status==='Closed')),[issues,filter]);
 const open=issues.filter(x=>x.status!=='Closed').length, high=issues.filter(x=>x.status!=='Closed'&&x.priority==='High').length, overdue=issues.filter(x=>x.status!=='Closed'&&x.due_date&&x.due_date<new Date().toISOString().slice(0,10)).length;
 return <main className="wrap">
  <div className="top"><button className={`tab ${tab==='report'?'active':''}`} onClick={()=>setTab('report')}>Report an Issue</button><button className={`tab ${tab==='manager'?'active':''}`} onClick={()=>setTab('manager')}>Manager Issues</button></div>
  {tab==='report'&&<>
   <div className="card"><h2>Report an Issue</h2><p className="muted">Use this form to report hazards, quality concerns, equipment issues, workplace problems or other matters requiring follow-up.</p>
    <div className="grid">
     <div className="field"><label>Staff member</label><select value={form.staff_name} onChange={e=>setForm({...form,staff_name:e.target.value})}><option value="">Select staff member</option>{staff.filter(s=>s.active).map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</select></div>
     <div className="field"><label>Issue type</label><select value={form.issue_type} onChange={e=>setForm({...form,issue_type:e.target.value})}><option>Hazard / Safety</option><option>Quality / NCR</option><option>Equipment / Tool</option><option>Vehicle / Production</option><option>Housekeeping</option><option>Process / Procedure</option><option>Other</option></select></div>
     <div className="field"><label>Area / Location</label><select value={form.location} onChange={e=>setForm({...form,location:e.target.value})}><option>Workshop</option><option>Warehouse</option><option>Office</option><option>Engineering</option><option>Yard</option><option>Vehicle</option><option>Other</option></select></div>
     <div className="field"><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></div>
     <div className="field" style={{gridColumn:'1/-1'}}><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe what happened or what you observed."/></div>
     <div className="field" style={{gridColumn:'1/-1'}}><label>Immediate action taken</label><textarea value={form.immediate_action} onChange={e=>setForm({...form,immediate_action:e.target.value})} placeholder="e.g. isolated equipment, cleaned spill, advised supervisor"/></div>
     <div className="field" style={{gridColumn:'1/-1'}}><label>Photo (optional)</label><input type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0]||null)}/><div className="muted">Maximum 8 MB.</div></div>
    </div>
    <button className="btn primary" onClick={submit}>SUBMIT ISSUE</button><div className="msg">{msg}</div>
   </div>
  </>}
  {tab==='manager'&&<>
   {!manager?<div className="card"><h2>Manager Access</h2><div className="field"><label>Manager PIN</label><input type="password" inputMode="numeric" value={pin} onChange={e=>setPin(e.target.value)} /></div><br/><button className="btn primary" onClick={login}>LOGIN</button><div className="msg">{msg}</div></div>:<>
    <div className="grid4"><div className="metric"><span className="muted">Open issues</span><b>{open}</b></div><div className="metric"><span className="muted">High priority</span><b>{high}</b></div><div className="metric"><span className="muted">Overdue</span><b>{overdue}</b></div><div className="metric"><span className="muted">Closed</span><b>{issues.filter(x=>x.status==='Closed').length}</b></div></div>
    <div className="card"><div className="row"><div><h2>Issue Register</h2><div className="muted">Manage actions, responsibility, due dates and closure.</div></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>Open</option><option>Closed</option><option>All</option></select></div>{shown.map(i=><IssueCard key={i.id} issue={i} save={saveIssue}/>)}</div>
    <div className="card"><h2>Staff for Issue Reporting</h2><div className="row"><div className="field" style={{flex:1}}><label>Add staff member</label><input value={newStaff} onChange={e=>setNewStaff(e.target.value)} placeholder="Name"/></div><button className="btn" onClick={addStaff}>ADD STAFF</button></div><div className="muted" style={{marginTop:10}}>{staff.map(s=>s.name).join(', ')}</div></div>
    <div className="msg">{msg}</div>
   </>}
  </>}
 </main>
}

function IssueCard({issue,save}:{issue:Issue;save:(id:string,p:Record<string,unknown>)=>Promise<void>}){
 const [x,setX]=useState({priority:issue.priority,responsible_person:issue.responsible_person||'',due_date:issue.due_date||'',status:issue.status,completion_date:issue.completion_date||'',corrective_action:issue.corrective_action||'',manager_comments:issue.manager_comments||''});
 return <div className="issue"><div className="row"><div><b>{issue.issue_type}</b> <span className={`badge ${issue.priority==='High'?'high':''} ${issue.status==='Closed'?'closed':''}`}>{issue.priority} · {issue.status}</span><div className="muted">{issue.staff_name||'Unknown'} · {issue.location} · {new Date(issue.created_at).toLocaleString()}</div></div></div><p>{issue.description}</p>{issue.immediate_action&&<p className="small"><b>Immediate action:</b> {issue.immediate_action}</p>}{issue.photo_url&&<img className="photo" src={issue.photo_url} alt="Issue attachment"/>}
 <div className="grid3">
  <div className="field"><label>Priority</label><select value={x.priority} onChange={e=>setX({...x,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></div>
  <div className="field"><label>Responsible person</label><input value={x.responsible_person} onChange={e=>setX({...x,responsible_person:e.target.value})}/></div>
  <div className="field"><label>Due date</label><input type="date" value={x.due_date} onChange={e=>setX({...x,due_date:e.target.value})}/></div>
  <div className="field"><label>Status</label><select value={x.status} onChange={e=>setX({...x,status:e.target.value})}><option>Open</option><option>Under Review</option><option>Action Required</option><option>Closed</option></select></div>
  <div className="field"><label>Completion date</label><input type="date" value={x.completion_date} onChange={e=>setX({...x,completion_date:e.target.value})}/></div>
  <div className="field"><label>Corrective action</label><input value={x.corrective_action} onChange={e=>setX({...x,corrective_action:e.target.value})}/></div>
  <div className="field" style={{gridColumn:'1/-1'}}><label>Manager comments</label><textarea value={x.manager_comments} onChange={e=>setX({...x,manager_comments:e.target.value})}/></div>
 </div><div className="actions"><button className="btn primary" onClick={()=>save(issue.id,x)}>SAVE CHANGES</button></div></div>
}
