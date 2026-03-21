import { useState } from 'react';
import {G,T} from '../styles/global';
import useApi from '../hooks/useApi';
import Spinner from '../components/Spinner';
import ApiError from '../components/ApiError';
import Icons from '../components/Icons';
import apiFetch from '../services/apiFetch';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

function Usuarios() {
  const { data, loading, error, reload } = useApi("/usuarios");
  const [modal,  setModal]  = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert,  setAlert]  = useState(null);
  const [search, setSearch] = useState("");
  const [form,   setForm]   = useState({ nombre:"", tipo_documento:"CC", documento:"", telefono:"", placa:"" });

  const showAlert = (type, msg) => { setAlert({type,msg}); setTimeout(() => setAlert(null), 3500); };

  const guardar = async () => {
    const { nombre, tipo_documento, documento, placa } = form;
    if (!nombre || !tipo_documento || !documento || !placa)
      return showAlert("error","Nombre, tipo de documento, documento y placa son obligatorios.");
    setSaving(true);
    try {
      const res = await apiFetch("/usuarios", { method:"POST", body: JSON.stringify({ ...form, placa: form.placa.toUpperCase() }) });
      showAlert("success", `Usuario registrado. Celda asignada: #${res.id_celda}`);
      setModal(false); setForm({ nombre:"", tipo_documento:"CC", documento:"", telefono:"", placa:"" });
      reload();
    } catch(e) { showAlert("error", e.message); }
    setSaving(false);
  };

  const darDeBaja = async (id, nombre) => {
    if (!window.confirm(`¿Dar de baja a ${nombre}? Se liberará su celda.`)) return;
    try {
      await apiFetch(`/usuarios/${id}/desactivar`, { method:"PUT" });
      showAlert("success","Usuario desactivado y celda liberada.");
      reload();
    } catch(e) { showAlert("error", e.message); }
  };

  const usuarios = data || [];
  const filtered = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.documento.includes(search) ||
    u.placa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={G.pageHeader}>
        <div>
          <div style={G.pageTitle}>Usuarios</div>
          <div style={G.pageSubtitle}>{usuarios.length} activos</div>
        </div>
        <button style={G.btnPrimary} onClick={() => setModal(true)}><Icons name="plus" /> Nuevo usuario</button>
      </div>

      <Alert alert={alert} />
      {error && <ApiError msg={error} onRetry={reload} />}

      <div style={G.card}>
        <div style={G.searchBar}>
          <Icons name="search" />
          <input style={G.searchInput} placeholder="Buscar por nombre, documento o placa..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table style={G.table}>
          <thead>
            <tr>{["Nombre","Tipo doc.","Documento","Teléfono","Placa","Celda","Estado","Acción"].map(h =>
              <th key={h} style={G.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={8}><Spinner /></td></tr>
              : filtered.length === 0
                ? <tr><td colSpan={8} style={G.empty}>No hay usuarios activos.</td></tr>
                : filtered.map(u => (
                  <tr key={u.id_usuario}>
                    <td style={G.td}><b>{u.nombre}</b></td>
                    <td style={G.td}><span style={G.badge(T.teal, T.tealLight)}>{u.tipo_documento}</span></td>
                    <td style={G.td}>{u.documento}</td>
                    <td style={G.td}>{u.telefono || "—"}</td>
                    <td style={G.td}><b style={{ color:T.teal }}>{u.placa}</b></td>
                    <td style={G.td}>#{u.id_celda}</td>
                    <td style={G.td}><span style={G.badge(T.success, T.successBg)}>Activo</span></td>
                    <td style={G.td}>
                      <button style={G.btnDanger} onClick={() => darDeBaja(u.id_usuario, u.nombre)}>
                        Dar de baja
                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Registrar usuario" onClose={() => setModal(false)}>
          <div style={G.formGroup}>
            <label style={G.label}>Nombre completo *</label>
            <input style={G.input} placeholder="Ej: María García" value={form.nombre}
              onChange={e => setForm(p => ({...p, nombre:e.target.value}))} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={G.formGroup}>
              <label style={G.label}>Tipo de documento *</label>
              <select style={G.select} value={form.tipo_documento}
                onChange={e => setForm(p => ({...p, tipo_documento:e.target.value}))}>
                {["CC","TI","CE","Pasaporte"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={G.formGroup}>
              <label style={G.label}>Número de documento *</label>
              <input style={G.input} placeholder="Ej: 1234567890" value={form.documento}
                onChange={e => setForm(p => ({...p, documento:e.target.value}))} />
            </div>
            <div style={G.formGroup}>
              <label style={G.label}>Teléfono</label>
              <input style={G.input} placeholder="Ej: 3001234567" value={form.telefono}
                onChange={e => setForm(p => ({...p, telefono:e.target.value}))} />
            </div>
            <div style={G.formGroup}>
              <label style={G.label}>Placa del vehículo *</label>
              <input style={G.input} placeholder="Ej: ABC123" value={form.placa}
                onChange={e => setForm(p => ({...p, placa:e.target.value.toUpperCase()}))} />
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <button style={G.btnSecondary} onClick={() => setModal(false)}>Cancelar</button>
            <button style={{ ...G.btnPrimary, opacity: saving?0.7:1 }} onClick={guardar} disabled={saving}>
              <Icons name="check" /> {saving ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default Usuarios;