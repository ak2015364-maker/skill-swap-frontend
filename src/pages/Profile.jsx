import { useEffect, useState } from "react";
import API from "../services/api";
import Modal from "../components/Modal";
import SkillCard from "../components/SkillCard";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [bioEdit, setBioEdit] = useState(false);
  const [bioSaving, setBioSaving] = useState(false);
  const [error, setError] = useState("");
  const [mySkills, setMySkills] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [skillToWithdraw, setSkillToWithdraw] = useState(null);
  const [contactAdminOpen, setContactAdminOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("technology");
  const [formType, setFormType] = useState("offer");
  const [formExperience, setFormExperience] = useState(0);
  const [formEmployed, setFormEmployed] = useState(false);
  const [formEmployedYears, setFormEmployedYears] = useState(0);
  const [formEmployer, setFormEmployer] = useState("");
  const [confirmAdd, setConfirmAdd] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setError("");
      const res = await API.get('/api/users/profile');
      setProfile(res.data);
      setForm(res.data);
      // fetch user's skills
      try{
        const s = await API.get('/api/skills/my');
        setMySkills(s.data);
      }catch(err){
        console.error('failed loading my skills', err);
      }
    } catch (err) {
      setError("Failed to load profile: " + (err.response?.data?.message || err.message || "Unknown error"));
      setProfile(null);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/api/users/profile', form);
      setEdit(false);
      fetchProfile();
    } catch (err) {
      console.error('Profile update error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      setError('Update failed: ' + msg);
      alert('Failed to update profile: ' + msg);
    }
    setSaving(false);
  };

  const handleBioSave = async (e) => {
    e?.preventDefault?.();
    setBioSaving(true);
    try {
      await API.put('/api/users/profile', { bio: form.bio });
      setBioEdit(false);
      fetchProfile();
    } catch (err) {
      console.error('Bio update error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      setError('Bio update failed: ' + msg);
      alert('Failed to update bio: ' + msg);
    }
    setBioSaving(false);
  };

  const handleAddSkill = async (e) => {
    e?.preventDefault?.();
    try {
      const payload = {
        title: formTitle,
        description: formDescription,
        category: formCategory,
        type: formType,
        experienceYears: Number(formExperience) || 0,
        employed: !!formEmployed,
        employedYears: Number(formEmployedYears) || 0,
        employer: formEmployer
      };
      await API.post('/api/skills/add', payload);
      // refresh profile and skills
      fetchProfile();
      setToast('Skill added');
      setTimeout(()=>setToast(''),3000);
    } catch (err) {
      console.error('Failed to add skill', err);
      alert('Failed to add skill: ' + (err.response?.data?.message || err.message));
    }
  };

  if (error) return <div className="card" style={{color:'red'}}>Profile error: {error}</div>;
  if (!profile) return <div className="card">Loading profile…</div>;

  return (
    <div>
      <div className="card" style={{display:'flex',gap:16,alignItems:'center'}}>
        <div className="avatar" style={{width:90,height:90,fontSize:28}}>{profile.username?.charAt(0).toUpperCase()}</div>
        <div>
          <div style={{fontSize:20,fontWeight:700}}>{profile.username}</div>
          <div className="small muted">{profile.email}</div>
        </div>
        <div style={{marginLeft:'auto'}}>
          {!edit && <button className="btn" onClick={()=>setEdit(true)}>Edit</button>}
        </div>
      </div>

      <div style={{marginTop:18}} className="card">
        <h3>Personal details</h3>
        {edit ? (
          <form onSubmit={handleSave} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:8}}>
            <div>
              <div className="small muted">College / Course</div>
              <input name="college" value={form.college||''} onChange={handleChange} />
            </div>
            <div>
              <div className="small muted">Occupation</div>
              <select name="occupation" value={form.occupation||''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="student">Student</option>
                <option value="employed">Employed</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <div className="small muted">Annual income</div>
              <input name="annualIncome" type="number" value={form.annualIncome||''} onChange={handleChange} />
            </div>
            <div>
              <div className="small muted">Location</div>
              <input name="country" placeholder="Country" value={form.country||''} onChange={handleChange} style={{marginBottom:4}} />
              <input name="state" placeholder="State" value={form.state||''} onChange={handleChange} />
            </div>
            <div style={{gridColumn:'1/3',marginTop:8}}>
              <button className="btn" type="submit" disabled={saving}>{saving?'Saving...':'Save'}</button>
              <button type="button" style={{marginLeft:8}} onClick={()=>setEdit(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:8}}>
            <div>
              <div className="small muted">College / Course</div>
              <div>{profile.college || '—'}</div>
            </div>
            <div>
              <div className="small muted">Occupation</div>
              <div>{profile.occupation || '—'}</div>
            </div>
            <div>
              <div className="small muted">Annual income</div>
              <div>{profile.annualIncome ? `$${profile.annualIncome}` : '—'}</div>
            </div>
            <div>
              <div className="small muted">Location</div>
              <div>{profile.state ? `${profile.country || ''}, ${profile.state}` : (profile.country || '—')}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{marginTop:18}} className="card">
        <h3>About</h3>
        {bioEdit ? (
          <div>
            <textarea name="bio" value={form.bio||''} onChange={handleChange} style={{width:'100%',minHeight:80}} />
            <div style={{marginTop:8}}>
              <button className="btn" onClick={handleBioSave} disabled={bioSaving}>{bioSaving ? 'Saving...' : 'Save Bio'}</button>
              <button type="button" style={{marginLeft:8}} onClick={()=>{setBioEdit(false); setForm({...form, bio: profile.bio});}}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div className="muted">{profile.bio || 'No bio provided.'}</div>
            <div>
              <button className="btn" onClick={()=>setBioEdit(true)}>Edit Bio</button>
            </div>
          </div>
        )}
      </div>

      <div style={{marginTop:18}} className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h3 style={{margin:0}}>My Skills</h3>
          <div>
            <button className="btn" onClick={()=>setShowAddModal(true)}>Add Skill</button>
          </div>
        </div>
        {mySkills.length === 0 ? (
          <div className="muted">No skills added yet.</div>
        ) : (
          <div className="grid">
            {mySkills.map(s=> (
              <div key={s._id}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>{s.title}</div>
                    <div className="small muted">{s.category} • {s.type} • {s.experienceYears || 0} yrs</div>
                    <div className="muted">{s.description}</div>
                  </div>
                  <div>
                    <button style={{background:'#ef4444',color:'#fff',border:0,padding:'8px 10px',borderRadius:8}} onClick={()=>{
                      setSkillToWithdraw(s);
                      setContactAdminOpen(true);
                    }}>Withdraw</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {confirmOpen && (
        <Modal title="Confirm withdraw" onClose={()=>{setConfirmOpen(false); setSkillToWithdraw(null);}}>
          <div style={{padding:6}}>
            <div style={{marginBottom:12}}>Are you sure you want to withdraw the skill <strong>{skillToWithdraw?.title}</strong>?</div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn" onClick={()=>{setConfirmOpen(false); setSkillToWithdraw(null);}}>Cancel</button>
              <button style={{background:'#ef4444',color:'#fff',border:0,padding:'8px 10px',borderRadius:8}} onClick={async ()=>{
                if(!skillToWithdraw) return;
                try{
                  await API.delete(`/api/skills/${skillToWithdraw._id}`);
                  setMySkills(ms=>ms.filter(x=>x._id!==skillToWithdraw._id));
                  // Notify other parts of the app that a skill was removed so they can refresh lists
                  try{ window.dispatchEvent(new CustomEvent('skill:removed', { detail: skillToWithdraw._id })); }catch(e){/* ignore */}
                  setToast('Skill withdrawn');
                }catch(err){
                  console.error('Withdraw error', err, err.response?.data);
                  const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
                  // show immediate feedback and include server response for debugging
                  alert('Failed to withdraw skill: ' + msg + '\nCheck server logs for details.');
                  setToast('Failed to withdraw skill: ' + msg);
                }
                setConfirmOpen(false);
                setSkillToWithdraw(null);
                setTimeout(()=>setToast(''),3000);
              }}>Withdraw</button>
            </div>
          </div>
        </Modal>
      )}
      {contactAdminOpen && (
        <Modal title="Contact admin" onClose={()=>{setContactAdminOpen(false); setSkillToWithdraw(null);}}>
          <div style={{padding:6}}>
            <div style={{marginBottom:12}}>To withdraw the skill <strong>{skillToWithdraw?.title}</strong>, please contact the admin.</div>
            <div className="small muted">You can reach out at <strong>ak2015364@gmail.com</strong> or use the support page.</div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
              <button className="btn" onClick={()=>{setContactAdminOpen(false); setSkillToWithdraw(null);}}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {showAddModal && (
        <Modal title="Add Skill" onClose={()=>{setShowAddModal(false); setConfirmAdd(false);}}>
          {!confirmAdd ? (
            <form onSubmit={async (e)=>{
              e.preventDefault();
              try{
                await handleAddSkill(e);
                setConfirmAdd(true);
              }catch(err){
                // handleAddSkill will alert on error
              }
            }}>
              <input placeholder="Skill name" value={formTitle} onChange={e=>setFormTitle(e.target.value)} required />
              <br /><br />
              <textarea placeholder="Description" value={formDescription} onChange={e=>setFormDescription(e.target.value)} />
              <br /><br />
              <div className="form-row">
                <select value={formCategory} onChange={e=>setFormCategory(e.target.value)}>
                  <option value="technology">Technology</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="esports">Esports</option>
                </select>
                <select value={formType} onChange={e=>setFormType(e.target.value)}>
                  <option value="offer">Offer (I can teach)</option>
                  <option value="want">Want (I want to learn)</option>
                </select>
              </div>
              <br />
              <div className="form-row">
                <input type="number" min="0" placeholder="Experience years" value={formExperience} onChange={e=>setFormExperience(e.target.value)} />
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <label className="small muted">Employed?</label>
                  <select value={formEmployed? 'yes':'no'} onChange={e=>setFormEmployed(e.target.value === 'yes')}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              <br />
              {formEmployed && (
                <div className="form-row">
                  <input type="number" min="0" placeholder="Years employed" value={formEmployedYears} onChange={e=>setFormEmployedYears(e.target.value)} />
                  <input placeholder="Company / Business" value={formEmployer} onChange={e=>setFormEmployer(e.target.value)} />
                </div>
              )}
              <br />
              <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                <button type="button" className="btn" onClick={()=>{setShowAddModal(false); setConfirmAdd(false);}}>Cancel</button>
                <button className="btn" type="submit">Add Skill</button>
              </div>
            </form>
          ) : (
            <div style={{textAlign:'center'}}>
              <div style={{fontWeight:700,marginBottom:8}}>Skill added successfully.</div>
              <div style={{marginBottom:12}}>Would you like to add another skill?</div>
              <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                <button className="btn" onClick={()=>{
                  setFormTitle(''); setFormDescription(''); setFormCategory('technology'); setFormType('offer'); setFormExperience(0); setFormEmployed(false); setFormEmployedYears(0); setFormEmployer('');
                  setConfirmAdd(false);
                }}>Yes</button>
                <button style={{background:'#64748b',color:'#fff',border:0,padding:'10px 14px',borderRadius:8}} onClick={()=>{ setShowAddModal(false); setConfirmAdd(false); }}>No</button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {toast && (
        <div className="toast">{toast}</div>
      )}
    </div>
  );
}
