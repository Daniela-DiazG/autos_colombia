import { useState } from 'react';
import {G,T} from '../styles/global';
import useApi from '../hooks/useApi';
import Spinner from '../components/Spinner';
import ApiError from '../components/ApiError';
import Icons from '../components/Icons';

function Vehiculos() {
  const { data, loading, error, reload } = useApi("/vehiculos");
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState({ placa:"", tipo:"Carro" });
  const [saving, setSaving] = useState(false);
  const [alert,  setAlert]  = useState(null);
  const [search, setSearch] = useState("");

  const showAlert = (type, msg) => { setAlert({type,msg}); setTimeout(() => setAlert(null), 3500); };

  const guardar = async () => {
    if (!form.placa) { showAlert("error","La placa es obligatoria."); return; }
    setSaving(true);
    try {
      await apiFetch("/vehiculos", { method:"POST", body: JSON.stringify({ placa: form.placa.toUpperCase(), tipo: form.tipo }) });
      showAlert("success","Vehículo registrado correctamente.");
      setModal(false); setForm({ placa:"", tipo:"Carro" }); reload();
    } catch(e) { showAlert("error", e.message); }
    setSaving(false);
  };

  const vehiculos = data || [];
  const filtered  = vehiculos.filter(v =>
    v.placa.toLowerCase().includes(search.toLowerCase()) ||
    v.tipo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={G.pageHeader}>
        <div>
          <div style={G.pageTitle}>Vehículos</div>
          <div style={G.pageSubtitle}>{vehiculos.length} registrados</div>
        </div>
        <button style={G.btnPrimary} onClick={() => setModal(true)}><Icons name="plus" /> Nuevo vehículo</button>
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
          <thead><tr>{["Placa","Tipo"].map(h => <th key={h} style={G.th}>{h}</th>)}</tr></thead>
          <tbody>
            {loading
              ? <tr><td colSpan={2}><Spinner /></td></tr>
              : filtered.length === 0
                ? <tr><td colSpan={2} style={G.empty}>No hay vehículos registrados.</td></tr>
                : filtered.map(v => (
                  <tr key={v.placa}>
                    <td style={G.td}><b style={{ color:T.teal }}>{v.placa}</b></td>
                    <td style={G.td}><span style={G.badge(T.teal, T.tealLight)}>{v.tipo}</span></td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Registrar vehículo" onClose={() => setModal(false)}>
          <div style={G.formGroup}>
            <label style={G.label}>Placa *</label>
            <input style={G.input} placeholder="Ej: ABC123" value={form.placa}
              onChange={e => setForm(p => ({...p, placa:e.target.value.toUpperCase()}))} />
          </div>
          <div style={G.formGroup}>
            <label style={G.label}>Tipo *</label>
            <select style={G.select} value={form.tipo} onChange={e => setForm(p => ({...p, tipo:e.target.value}))}>
              {["Carro","Moto","Camioneta","Bicicleta"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <button style={G.btnSecondary} onClick={() => setModal(false)}>Cancelar</button>
            <button style={{ ...G.btnPrimary, opacity: saving ? 0.7:1 }} onClick={guardar} disabled={saving}>
              <Icons name="check" /> {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
 export default Vehiculos;