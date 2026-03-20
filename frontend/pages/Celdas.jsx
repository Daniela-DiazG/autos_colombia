function Celdas() {
  const { data, loading, error, reload } = useApi("/celdas");
  const celdas = data || [];
  const disp   = celdas.filter(c => c.estado === "disponible").length;
  const ocup   = celdas.filter(c => c.estado === "ocupada").length;

  return (
    <div>
      <div style={G.pageHeader}>
        <div>
          <div style={G.pageTitle}>Celdas</div>
          <div style={G.pageSubtitle}>{disp} disponibles · {ocup} ocupadas</div>
        </div>
        <button style={G.btnSecondary} onClick={reload}><Icon.refresh /> Actualizar</button>
      </div>

      {error && <ApiError msg={error} onRetry={reload} />}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
        {[{ label:"Total", value:celdas.length, color:T.teal },
          { label:"Disponibles", value:disp, color:T.success },
          { label:"Ocupadas",    value:ocup, color:T.danger }
        ].map(s => (
          <div key={s.label} style={G.statCard}>
            <div style={{ ...G.statNum, color:s.color }}>{s.value}</div>
            <div style={G.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ ...G.card, marginBottom:20 }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ fontWeight:700, fontSize:14 }}>Mapa de celdas</div>
            </div>
            <div style={{ padding:"20px", display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(110px,1fr))", gap:12 }}>
              {celdas.map(c => (
                <div key={c.id_celda} style={{ borderRadius:12, padding:"14px 10px", textAlign:"center", background: c.estado==="disponible" ? T.successBg : T.dangerBg, border:`1.5px solid ${c.estado==="disponible" ? "#A8DFC8" : "#F5BEBE"}` }}>
                  <div style={{ fontSize:22, fontWeight:800, color: c.estado==="disponible" ? T.success : T.danger }}>
                    #{c.id_celda}
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, color: c.estado==="disponible" ? T.success : T.danger, margin:"4px 0 6px" }}>
                    {c.estado==="disponible" ? "Libre" : "Ocupada"}
                  </div>
                  {c.usuario && (
                    <div style={{ fontSize:10, color:T.textMid, background:"rgba(0,0,0,0.05)", borderRadius:4, padding:"2px 6px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {c.usuario}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={G.card}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ fontWeight:700, fontSize:14 }}>Detalle</div>
            </div>
            <table style={G.table}>
              <thead><tr>{["# Celda","Estado","Usuario asignado"].map(h => <th key={h} style={G.th}>{h}</th>)}</tr></thead>
              <tbody>
                {celdas.map(c => (
                  <tr key={c.id_celda}>
                    <td style={G.td}><b>#{c.id_celda}</b></td>
                    <td style={G.td}>
                      <span style={G.badge(c.estado==="disponible" ? T.success : T.danger, c.estado==="disponible" ? T.successBg : T.dangerBg)}>
                        {c.estado==="disponible" ? "Disponible" : "Ocupada"}
                      </span>
                    </td>
                    <td style={G.td}>{c.usuario || <span style={{ color:T.textLight }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
 export default Celdas;