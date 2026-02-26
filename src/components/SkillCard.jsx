export default function SkillCard({skill, onRequest, onWithdraw}){
  return (
    <div className="skill-card card fade-in">
      <div className="skill-title">{skill.title}</div>
      <div className="skill-meta">{skill.description}</div>
      <div style={{marginTop:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="muted">{skill.type} • {skill.category}</div>
        <div style={{display:'flex',gap:8}}>
          {onRequest && <button className="btn" onClick={()=>onRequest(skill)}>Request</button>}
          {onWithdraw && <button style={{background:'#ef4444',color:'#fff',borderRadius:8,padding:'8px 10px',border:0}} onClick={()=>onWithdraw(skill)}>Withdraw</button>}
        </div>
      </div>
    </div>
  )
}
