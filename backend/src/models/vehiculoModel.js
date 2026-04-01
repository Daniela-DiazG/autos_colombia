//info: Consultas SQL sobre la tabla vehiculo: registrar placa, listar vehículos.

const db = require('../config/db');

const crear = (datos, callback) => {
  db.query(
    'INSERT INTO vehiculo (placa, tipo) VALUES (?, ?)',
    [datos.placa, datos.tipo],
    callback
  );
};

const obtenerTodos = (callback) => {
  db.query('SELECT * FROM vehiculo', callback);
};

const obtenerDetallesPorPlaca = (placa, callback) => {
  const query = `
    SELECT 
      v.placa, 
      v.tipo, 
      u.fecha_vencimiento, 
      c.id_celda as celda_asignada, 
      u.nombre as nombre_dueno, 
      u.telefono 
    FROM vehiculo v
    LEFT JOIN usuario u ON v.placa = u.placa
    LEFT JOIN celda c ON u.id_celda = c.id_celda
    WHERE v.placa = ?
  `;
  db.query(query, [placa], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback({ kind: 'not_found' }, null);
    callback(null, results[0]);
  });
};

module.exports = { crear, obtenerTodos, obtenerDetallesPorPlaca };