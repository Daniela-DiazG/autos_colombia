import {G,T} from '../styles/global';

function Modal({ title, onClose, children }) {
  return (
    <div style={G.modal}>
      <div style={G.modalOverlay} onClick={onClose} />
      <div style={G.modalBox}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:18, fontWeight:700, color:T.textDark }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, color:T.textMid, cursor:"pointer" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;