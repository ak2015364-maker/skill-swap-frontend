import { useEffect, useState } from "react";
import API from "../services/api";
import SkillCard from "../components/SkillCard";
import Modal from "../components/Modal";

function Dashboard({ setToken }) {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [mySkills, setMySkills] = useState([]);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("technology");
  const [formType, setFormType] = useState("offer");
  const [formExperience, setFormExperience] = useState(0);
  const [formEmployed, setFormEmployed] = useState(false);
  const [formEmployedYears, setFormEmployedYears] = useState(0);
  const [formEmployer, setFormEmployer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestTargetSkill, setRequestTargetSkill] = useState(null);
  const [selectedOfferedSkillId, setSelectedOfferedSkillId] = useState(null);
  const [confirmAdd, setConfirmAdd] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchAllSkills();
    fetchMySkills();
  }, []);

  // Listen for global skill removal events so the dashboard updates in real-time
  useEffect(() => {
    const handler = (e) => {
      fetchAllSkills();
      fetchMySkills();
    };
    window.addEventListener('skill:removed', handler);
    return () => window.removeEventListener('skill:removed', handler);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const res = await API.get("/skills");
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMySkills = async () => {
    try {
      const res = await API.get('/skills/my');
      setMySkills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
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

      await API.post('/skills/add', payload);
      setFormTitle(''); setFormDescription(''); setFormCategory('technology'); setFormType('offer'); setFormExperience(0); setFormEmployed(false); setFormEmployedYears(0); setFormEmployer('');
      fetchAllSkills();
      fetchMySkills();
      alert('Skill added');
    } catch (err) {
      console.error(err);
      alert('Failed to add skill');
    }
  };

  const handleRequest = async (skill) => {
    // require the requester to offer one of their skills (only 'offer' type)
    const availableOffers = (mySkills || []).filter(ms => ms.type === 'offer');
    if (availableOffers.length === 0) {
      alert("You don't have any skills marked as 'Offer'. Add an offering skill before sending a request.");
      return;
    }

    // open a modal to let user choose which of their offering skills to offer
    setRequestTargetSkill(skill);
    setSelectedOfferedSkillId(availableOffers[0]._id);
    setRequestModalOpen(true);
  };

  const confirmSendRequest = async () => {
    if (!requestTargetSkill) return;
    try {
      const payload = {
        offeredSkill: selectedOfferedSkillId,
        requestedSkill: requestTargetSkill._id,
        toUser: requestTargetSkill.user?._id || requestTargetSkill.user
      };
      await API.post('/swaps/create', payload);
      alert('Swap request sent!');
      setRequestModalOpen(false);
      setRequestTargetSkill(null);
      setSelectedOfferedSkillId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to send request: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = skills.filter(s => {
    // exclude skills created by current user
    if (user && s.user) {
      const ownerId = s.user._id || s.user;
      if (ownerId.toString() === user._id?.toString()) return false;
    }
    return s.title.toLowerCase().includes(query.toLowerCase()) || (s.category||'').toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="card hero">
        <div className="hero-left">
          <h1>Swap skills with your <span className="highlight">community</span></h1>
          <p className="muted">Find people who can teach what you want to learn and vice versa — connect instantly.</p>

          <div className="search" style={{marginTop:16}}>
            <input placeholder="Search skills or categories" value={query} onChange={(e)=>setQuery(e.target.value)} />
            <button className="btn">Explore</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-blob floaty" />
        </div>
      </div>

      {requestModalOpen && (
        <Modal title="Send Swap Request" onClose={()=>{setRequestModalOpen(false); setRequestTargetSkill(null); setSelectedOfferedSkillId(null);}}>
          <div style={{padding:6}}>
            <div style={{marginBottom:12}}>You're requesting <strong>{requestTargetSkill?.title}</strong>. Please choose one of your skills to offer in return.</div>
            <div style={{marginBottom:12}}>
              <select value={selectedOfferedSkillId || ''} onChange={e=>setSelectedOfferedSkillId(e.target.value)} style={{width:'100%'}}>
                {(mySkills||[]).filter(ms => ms.type === 'offer').map(ms => (
                  <option key={ms._id} value={ms._id}>{ms.title} • {ms.type}</option>
                ))}
              </select>
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn" onClick={()=>{setRequestModalOpen(false); setRequestTargetSkill(null); setSelectedOfferedSkillId(null);}}>Cancel</button>
              <button className="btn" onClick={confirmSendRequest}>Send Request</button>
            </div>
          </div>
        </Modal>
      )}

      <div style={{marginTop:18}}>
        <h3><strong>Add Skill</strong></h3>
        <div style={{marginTop:8}}>
          <button className="btn" onClick={()=>setShowModal(true)}>Add Skill</button>
        </div>

        {showModal && (
          <Modal title="Add Skill" onClose={()=>{setShowModal(false); setConfirmAdd(false);}}>
            {!confirmAdd ? (
              <form onSubmit={async (e)=>{
                e.preventDefault();
                try{
                  await handleAddSkill(e);
                  setConfirmAdd(true);
                }catch(err){
                  // handleAddSkill already alerts
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
                  <button type="button" className="btn" onClick={()=>{setShowModal(false); setConfirmAdd(false);}}>Cancel</button>
                  <button className="btn" type="submit">Add Skill</button>
                </div>
              </form>
            ) : (
              <div style={{textAlign:'center'}}>
                <div style={{fontWeight:700,marginBottom:8}}>Skill added successfully.</div>
                <div style={{marginBottom:12}}>Would you like to add another skill?</div>
                <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                  <button className="btn" onClick={()=>{
                    // reset form for another
                    setFormTitle(''); setFormDescription(''); setFormCategory('technology'); setFormType('offer'); setFormExperience(0); setFormEmployed(false); setFormEmployedYears(0); setFormEmployer('');
                    setConfirmAdd(false);
                  }}>Yes</button>
                  <button style={{background:'#64748b',color:'#fff',border:0,padding:'10px 14px',borderRadius:8}} onClick={()=>{ setShowModal(false); setConfirmAdd(false); }}>No</button>
                </div>
              </div>
            )}
          </Modal>
        )}

        <h3 style={{marginTop:18}}>Available Skills</h3>
        <div className="grid">
          {filtered.length === 0 ? (
            <div className="card">No skills found.</div>
          ) : (
            filtered.map(s=> <SkillCard key={s._id} skill={s} onRequest={handleRequest} />)
          )}
        </div>
      </div>

      <div style={{marginTop:20}} className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="profile">
            <div className="avatar">{user? user.username.charAt(0).toUpperCase(): 'U'}</div>
            <div>
              <div style={{fontWeight:700}}>{user? user.username: 'Guest'}</div>
              <div className="small muted">{user? user.email: 'Not logged in'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
