import  { useState } from 'react';
import {G,T} from './styles/global';
import Icons from './components/Icons';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehiculos from './pages/Vehiculos';
import Usuarios from './pages/Usuarios';
import Celdas from './pages/Celdas';
import Registros from './pages/Registros';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view,     setView]     = useState("dashboard");

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const navItems = [
    { key:"dashboard", label:"Dashboard", icon:<Icons name={"dash"} /> },
    { key:"vehiculos", label:"Vehículos", icon:<Icons name={"car"} size={16}/> },
    { key:"usuarios",  label:"Usuarios",  icon:<Icons name={"users"} /> },
    { key:"celdas",    label:"Celdas",    icon:<Icons name={"grid"} /> },
    { key:"registros", label:"Registros", icon:<Icons name={"list"} /> },
  ];

  return (
    <div style={G.page}>
      <aside style={G.sidebar}>
        <div style={G.sidebarLogo}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, background:T.tealMid, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icons name={"car"} />
            </div>
            <div>
              <div style={G.sidebarLogoText}>Autos Colombia</div>
              <div style={G.sidebarSub}>Parqueadero</div>
            </div>
          </div>
        </div>
        <nav style={G.sidebarNav}>
          {navItems.map(item => (
            <div key={item.key} style={G.navItem(view===item.key)} onClick={() => setView(item.key)}>
              {item.icon}{item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ ...G.navItem(false), borderLeft:"none" }} onClick={() => setLoggedIn(false)}>
            <Icons name={"logout"} /> Cerrar sesión
          </div>
        </div>
      </aside>

      <main style={G.main}>
        {view === "dashboard" && <Dashboard />}
        {view === "vehiculos" && <Vehiculos />}
        {view === "usuarios"  && <Usuarios />}
        {view === "celdas"    && <Celdas />}
        {view === "registros" && <Registros />}
      </main>
    </div>
  );
}