import {G,T} from '../styles/global';

function Alert({ alert }) {
  if (!alert) return null;
  return <div style={{ ...G.alert(alert.type), zIndex:10000, position:"absolute", width:"100%",maxWidth:500, marginLeft:45  }}>{alert.msg}</div>;
}
export default Alert;