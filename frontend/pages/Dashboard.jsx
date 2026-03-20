function Dashboard() {
  const { data: usuarios,  loading: lu, error: eu, reload: ru } = useApi("/usuarios");
  const { data: celdas,    loading: lc, error: ec, reload: rc } = useApi("/celdas");
  const { data: vehiculos, loading: lv, error: ev, reload: rv } = useApi("/vehiculos");
  const { data: registros, loading: lr, error: er, reload: rr } = useApi("/registros");

  const loading = lu || lc || lv || lr;
  const error   = eu || ec || ev || er;

  if (loading) return <Spinner />;
  if (error)   return <ApiError msg={error} onRetry={() => { ru(); rc(); rv(); rr(); }} />;

  const disp   = (celdas   || []).filter(c => c.estado === "disponible").length;
  const ocup   = (celdas   || []).filter(c => c.estado === "ocupada").length;
  const activos= (usuarios || []).length;

  const stats = [
    { label:"Vehículos registrados", value:(vehiculos||[]).length, color:T.teal },
    { label:"Usuarios activos",       value:activos,               color:T.teal },
    { label:"Celdas disponibles",     value:disp,                  color:T.success },
    { label:"Celdas ocupadas",        value:ocup,                  color:T.danger },
  ];

  return (
    <div>
      <div style={G.pageHeader}>
        <div>
          <div style={G.pageTitle}>Dashboard</div>
          <div style={G.pageSubtitle}>Resumen en tiempo real</div>
        </div>
        <button style={G.btnSecondary} onClick={() => { ru(); rc(); rv(); rr(); }}>
          <Icon.refresh /> Actualizar
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {stats.map(s => (
          <div key={s.label} style={G.statCard}>
            <div style={{ ...G.statNum, color:s.color }}>{s.value}</div>
            <div style={G.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mapa de celdas */}
      <div style={{ ...G.card, marginBottom:24 }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontWeight:700, fontSize:14 }}>Estado de celdas</div>
          <div style={{ display:"flex", gap:12, fontSize:12, color:T.textMid }}>
            <span><span style={{ width:10, height:10, borderRadius:3, background:T.success, display:"inline-block", marginRight:5 }}></span>Disponible</span>
            <span><span style={{ width:10, height:10, borderRadius:3, background:T.danger,  display:"inline-block", marginRight:5 }}></span>Ocupada</span>
          </div>
        </div>
        <div style={{ padding:"18px 20px", display:"flex", flexWrap:"wrap", gap:10 }}>
          {(celdas || []).map(c => (
            <div key={c.id_celda} style={{ width:70, height:56, borderRadius:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background: c.estado==="disponible" ? T.successBg : T.dangerBg, border:`1px solid ${c.estado==="disponible" ? "#A8DFC8" : "#F5BEBE"}`, fontSize:11, fontWeight:600, color: c.estado==="disponible" ? T.success : T.danger }}>
              <div style={{ fontSize:16, fontWeight:700 }}>{c.id_celda}</div>
              <div style={{ fontSize:10 }}>{c.estado==="disponible" ? "Libre" : "Ocupada"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Últimos registros */}
      <div style={G.card}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontWeight:700, fontSize:14 }}>Últimos registros</div>
        </div>
        <table style={G.table}>
          <thead><tr>{["Placa","Tipo","Celda","Entrada","Salida","Estado"].map(h => <th key={h} style={G.th}>{h}</th>)}</tr></thead>
          <tbody>
            {(registros||[]).slice(0,8).map(r => (
              <tr key={r.id_registro}>
                <td style={G.td}><b>{r.placa}</b></td>
                <td style={G.td}>{r.tipo}</td>
                <td style={G.td}>#{r.id_celda}</td>
                <td style={G.td}>{r.fecha_entrada}</td>
                <td style={G.td}>{r.fecha_salida || "—"}</td>
                <td style={G.td}>
                  <span style={G.badge(r.fecha_salida ? T.textMid : T.success, r.fecha_salida ? "#F0F0F0" : T.successBg)}>
                    {r.fecha_salida ? "Finalizado" : "En curso"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Dashboard;