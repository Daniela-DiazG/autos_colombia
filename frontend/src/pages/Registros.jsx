import { useState } from 'react';
import {G,T} from '../styles/global';
import useApi from '../hooks/useApi';
import Spinner from '../components/Spinner';
import ApiError from '../components/ApiError';
import Icons from '../components/Icons';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import apiFetch from '../services/apiFetch';

function Registros() {
  const { data, loading, error, reload } = useApi("/registros");
  const { data: vehiculos }              = useApi("/vehiculos");
  const [modal,  setModal]  = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert,  setAlert]  = useState(null);
  const [search, setSearch] = useState("");
  const [form,   setForm]   = useState({ placa:"" });

  const showAlert = (type, msg) => { setAlert({type,msg}); setTimeout(() => setAlert(null), 3500); };

  const registrarEntrada = async () => {
    const p = form.placa.toUpperCase();
    if (!p) return showAlert("error","La placa es obligatoria.");
    setSaving(true);
    try {
      const res = await apiFetch("/registros/entrada", { method:"POST", body: JSON.stringify({ placa: p }) });
      showAlert("success", `Entrada registrada. Celda #${res.id_celda}`);
      setModal(false); setForm({ placa:"" }); reload();
    } catch(e) { showAlert("error", e.message); }
    setSaving(false);
  };

  const registrarSalida = async (id) => {
    try {
      await apiFetch(`/registros/${id}/salida`, { method:"PUT" });
      showAlert("success","Salida registrada correctamente.");
      reload();
    } catch(e) { showAlert("error", e.message); }
  };

  const registros = data || [];
  const filtered  = registros.filter(r =>
    r.placa.toLowerCase().includes(search.toLowerCase()) ||
    (r.tipo||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={G.pageHeader}>
        <div>
          <div style={G.pageTitle}>Registros</div>
          <div style={G.pageSubtitle}>Entradas y salidas de vehículos</div>
        </div>
        <button style={G.btnPrimary} onClick={() => setModal(true)}><Icons name="plus" /> Registrar entrada</button>
      </div>

      <Alert alert={alert} />
      {error && <ApiError msg={error} onRetry={reload} />}

      <div style={G.card}>
        <div style={G.searchBar}>
          <Icons name="search" />
          <input style={G.searchInput} placeholder="Buscar por placa o tipo..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table style={G.table}>
          <thead>
            <tr>{["Placa","Tipo","Celda","Entrada","Salida","Estado","Acción"].map(h =>
              <th key={h} style={G.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={7}><Spinner /></td></tr>
              : filtered.length === 0
                ? <tr><td colSpan={7} style={G.empty}>No hay registros.</td></tr>
                : filtered.map(r => (
                  <tr key={r.id_registro}>
                    <td style={G.td}><b style={{ color:T.teal }}>{r.placa}</b></td>
                    <td style={G.td}>{r.tipo || "—"}</td>
                    <td style={G.td}>#{r.id_celda}</td>
                    <td style={G.td}>{r.fecha_entrada}</td>
                    <td style={G.td}>{r.fecha_salida || <span style={{ color:T.textLight }}>En curso</span>}</td>
                    <td style={G.td}>
                      <span style={G.badge(r.fecha_salida ? T.textMid : T.success, r.fecha_salida ? "#F0F0F0" : T.successBg)}>
                        {r.fecha_salida ? "Finalizado" : "Activo"}
                      </span>
                    </td>
                    <td style={G.td}>
                      {!r.fecha_salida && (
                        <button style={G.btnSecondary} onClick={() => registrarSalida(r.id_registro)}>
                          Registrar salida
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Registrar entrada" onClose={() => setModal(false)}>
          <div style={G.formGroup}>
            <label style={G.label}>Placa del vehículo *</label>
            <input style={G.input} placeholder="Ej: ABC123" value={form.placa}
              onChange={e => setForm({ placa:e.target.value.toUpperCase() })} />
            {vehiculos && (
              <div style={{ fontSize:11, color:T.textMid, marginTop:5 }}>
                Registradas: {vehiculos.map(v => v.placa).join(", ")}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <button style={G.btnSecondary} onClick={() => setModal(false)}>Cancelar</button>
            <button style={{ ...G.btnPrimary, opacity: saving?0.7:1 }} onClick={registrarEntrada} disabled={saving}>
              <Icons name="check" /> {saving ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default Registros;