import {G,T} from '../styles/global';

function Alert({ alert }) {
  if (!alert) return null;
  return <div style={G.alert(alert.type)}>{alert.msg}</div>;
}
export default Alert;