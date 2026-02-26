export default function Modal({title, onClose, children}){
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div style={{fontWeight:700,fontSize:18}}>{title}</div>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}
