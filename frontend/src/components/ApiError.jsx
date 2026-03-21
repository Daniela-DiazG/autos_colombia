import {G,T} from "../styles/global";

function ApiError({ msg, onRetry }) {
  return (
    <div style={{ ...G.alert("error"), display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span>⚠ {msg}</span>
      {onRetry && <button style={G.btnSecondary} onClick={onRetry}>Reintentar</button>}
    </div>
  );
}

export default ApiError;