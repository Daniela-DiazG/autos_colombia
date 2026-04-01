import { useState } from 'react';
import { G, T } from '../styles/global';
import apiFetch from '../services/apiFetch';

export default function ConsultarPlaca() {
  const [placaInput, setPlacaInput] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pagoDatos, setPagoDatos] = useState({
    fecha_pago: new Date().toISOString().split('T')[0],
    numero_comprobante: '',
    meses_pagados: 1
  });
  const [pagoStatus, setPagoStatus] = useState({ loading: false, error: '', success: '' });

  const buscarPlaca = async (e) => {
    e?.preventDefault();
    if (!placaInput.trim()) return;

    setLoading(true);
    setErrorBusqueda('');
    setResultado(null);
    setPagoStatus({ loading: false, error: '', success: '' });

    try {
      const data = await apiFetch(`/vehiculos/${placaInput.trim()}/detalles`);
      setResultado(data);
    } catch (err) {
      setErrorBusqueda(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    const d = new Date(fecha);
    const opciones = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    return d.toLocaleDateString('es-ES', opciones);
  };

  const estaAlDia = (fecha) => {
    if (!fecha) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const limit = new Date(fecha);
    limit.setHours(0,0,0,0);
    return limit >= today;
  };

  const handlePagarMensualidad = async (e) => {
    e.preventDefault();
    if (!pagoDatos.fecha_pago || !pagoDatos.numero_comprobante || !pagoDatos.meses_pagados) {
      setPagoStatus(prev => ({ ...prev, error: 'Todos los campos son obligatorios.' }));
      return;
    }

    setPagoStatus({ loading: true, error: '', success: '' });
    try {
      await apiFetch('/pagos', {
        method: 'POST',
        body: JSON.stringify({
          placa: resultado.placa,
          ...pagoDatos
        })
      });
      setPagoStatus({ loading: false, error: '', success: 'Pago registrado exitosamente.' });
      
      // Recargar datos
      await buscarPlaca();
      
      // Cerrar modal tras 2 segundos si todo fue bien
      setTimeout(() => {
        setModalAbierto(false);
        setPagoStatus({ loading: false, error: '', success: '' });
        setPagoDatos({ fecha_pago: new Date().toISOString().split('T')[0], numero_comprobante: '', meses_pagados: 1 });
      }, 2000);

    } catch (error) {
      setPagoStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {!resultado ? (
        // VISTA 1: Buscador
        <div style={{ ...G.card, padding: '60px 40px', textAlign: 'center', marginTop: 100 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: T.textDark, marginBottom: 24 }}>Consultar placa</h2>
          <form style={{ maxWidth: 400, margin: '0 auto' }} onSubmit={buscarPlaca}>
            <div style={{ marginBottom: 24, textAlign: 'left' }}>
              <label style={G.label}>Número de placa</label>
              <input
                type="text"
                placeholder="Ingrese su número de placa"
                style={G.input}
                value={placaInput}
                onChange={(e) => setPlacaInput(e.target.value.toUpperCase())}
              />
            </div>
            {errorBusqueda && <div style={G.alert('danger')}>{errorBusqueda}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{ ...G.btnPrimary, margin: '0 auto', padding: '10px 40px', background: T.sidebarNav ? '#0a362f' : T.teal }} // Forzando dark teal de la imagen 1
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>
      ) : (
        // VISTA 2: Detalles
        <div style={{ marginTop: 20 }}>
          <div style={{ padding: '0 20px', marginBottom: 40 }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 30%) 1fr', gap: '24px 10px', fontSize: 16, color: T.textMid, textAlign: 'left', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: T.textDark }}>Placa del vehiculo</div>
                <div>{resultado.placa}</div>

                <div style={{ fontWeight: 700, color: T.textDark }}>Tipo de vehiculo</div>
                <div>{resultado.tipo}</div>

                <div style={{ fontWeight: 700, color: T.textDark }}>Fecha de vencimiento</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {formatearFecha(resultado.fecha_vencimiento)}
                  <span style={G.badge(
                    estaAlDia(resultado.fecha_vencimiento) ? T.success : T.danger, 
                    estaAlDia(resultado.fecha_vencimiento) ? T.successBg : T.dangerBg
                  )}>
                    {estaAlDia(resultado.fecha_vencimiento) ? 'Al día' : 'En mora'}
                  </span>
                </div>

                <div style={{ fontWeight: 700, color: T.textDark }}>Celda asignada</div>
                <div>{resultado.celda_asignada || 'Ninguna'}</div>

                <div style={{ fontWeight: 700, color: T.textDark }}>Nombre:</div>
                <div>{resultado.nombre_dueno || '-'}</div>

                <div style={{ fontWeight: 700, color: T.textDark }}>Teléfono:</div>
                <div>{resultado.telefono || '-'}</div>
             </div>
          </div>

          <div style={{ ...G.card, padding: '40px', textAlign: 'center', background: '#f4faf9' }}>
             <h3 style={{ fontSize: 20, fontWeight: 700, color: T.textDark, marginBottom: 30 }}>Acciones</h3>
             <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                <button 
                  style={{ ...G.btnPrimary, background: '#0a362f', borderRadius: 4 }}
                  onClick={() => setModalAbierto(true)}
                >
                  Pagar mensualidad
                </button>
                <button style={{ ...G.btnPrimary, background: '#0a362f', borderRadius: 4 }}>Editar vehiculo</button>
                <button style={{ ...G.btnPrimary, background: '#0a362f', borderRadius: 4 }}>Desactivar vehiculo</button>
             </div>
          </div>
          
          {resultado.historial_pagos && resultado.historial_pagos.length > 0 && (
            <div style={{ ...G.card, marginTop: 20 }}>
              <table style={G.table}>
                <thead>
                  <tr>
                    <th style={G.th}>Fecha de Pago</th>
                    <th style={G.th}>Comprobante</th>
                    <th style={{ ...G.th, textAlign: 'center' }}>Meses Pagados</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.historial_pagos.map((pago, idx) => (
                    <tr key={idx}>
                      <td style={G.td}>{formatearFecha(pago.fecha_pago)}</td>
                      <td style={G.td}>#{pago.numero_comprobante}</td>
                      <td style={{ ...G.td, textAlign: 'center' }}>{pago.meses_pagados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button style={G.btnSecondary} onClick={() => setResultado(null)}>Volver a buscar</button>
          </div>
        </div>
      )}

      {/* MODAL PAGO */}
      {modalAbierto && (
        <div style={G.modal}>
          <div style={{ ...G.modalOverlay, background: 'rgba(0,0,0,0.5)' }} onClick={() => setModalAbierto(false)}></div>
          <div style={{ ...G.modalBox, padding: '40px 50px', background: '#f4faf9', borderRadius: 12 }}>
             {pagoStatus.success && <div style={G.alert('success')}>{pagoStatus.success}</div>}
             {pagoStatus.error && <div style={G.alert('danger')}>{pagoStatus.error}</div>}
             
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: T.textDark, margin: 0 }}>Placa del vehiculo</h3>
                <span style={{ fontSize: 18, color: T.textMid }}>{resultado?.placa}</span>
             </div>

             <form onSubmit={handlePagarMensualidad}>
                <div style={{ marginBottom: 20 }}>
                   <label style={G.label}>Fecha de pago</label>
                   <input 
                      type="date" 
                      style={G.input} 
                      value={pagoDatos.fecha_pago}
                      onChange={(e) => setPagoDatos({ ...pagoDatos, fecha_pago: e.target.value })}
                   />
                   <div style={{ fontSize: 11, color: T.textLight, marginTop: 4 }}>* Por defecto se marca la fecha de hoy</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                   <label style={G.label}>numero de comprobante</label>
                   <input 
                      type="text" 
                      placeholder="Ingrese su numero de comprobante"
                      style={G.input}
                      value={pagoDatos.numero_comprobante}
                      onChange={(e) => setPagoDatos({ ...pagoDatos, numero_comprobante: e.target.value })}
                   />
                </div>
                <div style={{ marginBottom: 30 }}>
                   <label style={G.label}>Meses pagados</label>
                   <select 
                      style={G.select}
                      value={pagoDatos.meses_pagados}
                      onChange={(e) => setPagoDatos({ ...pagoDatos, meses_pagados: Number(e.target.value) })}
                   >
                     <option value={1}>1 mes</option>
                     <option value={2}>2 meses</option>
                     <option value={3}>3 meses</option>
                     <option value={6}>6 meses</option>
                     <option value={12}>12 meses</option>
                   </select>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <button type="submit" style={{ ...G.btnPrimary, background: '#0a362f', margin: '0 auto', padding: '10px 30px' }} disabled={pagoStatus.loading}>
                    {pagoStatus.loading ? 'Registrando...' : 'Registrar pago'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
