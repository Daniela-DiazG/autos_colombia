function Login({ onLogin }) {
  const [form, setForm] = useState({ user:"", pass:"" });
  const [err,  setErr]  = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!form.user || !form.pass) { setErr("Ingresa usuario y contraseña."); return; }
    setLoading(true); setErr("");
    // Si tienes endpoint de auth: await apiFetch("/auth/login", { method:"POST", body:JSON.stringify(form) })
    // Por ahora validación local hasta tener el endpoint
    await new Promise(r => setTimeout(r, 400));
    if (form.user === "admin" && form.pass === "1234") { onLogin(); }
    else { setErr("Credenciales incorrectas. Usa admin / 1234"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bgPage, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"40px", width:360, boxShadow:"0 12px 40px rgba(30,80,70,0.12)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, background:T.teal, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
            <Icon.car />
          </div>
          <div style={{ fontSize:18, fontWeight:700, color:T.textDark }}>Autos Colombia</div>
          <div style={{ fontSize:12, color:T.textMid, marginTop:3 }}>Sistema de parqueadero</div>
        </div>
        {err && <div style={G.alert("error")}>{err}</div>}
        <div style={G.formGroup}>
          <label style={G.label}>Usuario</label>
          <input style={G.input} placeholder="admin" value={form.user}
            onChange={e => setForm(p => ({...p, user:e.target.value}))}
            onKeyDown={e => e.key==="Enter" && handle()} />
        </div>
        <div style={G.formGroup}>
          <label style={G.label}>Contraseña</label>
          <input style={G.input} type="password" placeholder="••••••" value={form.pass}
            onChange={e => setForm(p => ({...p, pass:e.target.value}))}
            onKeyDown={e => e.key==="Enter" && handle()} />
        </div>
        <button style={{ ...G.btnPrimary, width:"100%", justifyContent:"center", padding:"11px", marginTop:4, opacity: loading ? 0.7 : 1 }}
          onClick={handle} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <div style={{ fontSize:11, color:T.textLight, textAlign:"center", marginTop:14 }}>Demo: admin / 1234</div>
      </div>
    </div>
  );
}
export default Login;