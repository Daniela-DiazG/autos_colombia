//info: Consultas SQL sobre la tabla celda: obtenerTodas, obtenerDisponible, ocupar, liberar.

const db = require('../config/db');

const obtenerTodas = (callback) => {
  db.query(
    `SELECT c.id_celda, c.estado, u.nombre AS usuario
     FROM celda c
     LEFT JOIN usuario u
       ON c.id_celda = u.id_celda AND u.estado = 'activo'
     ORDER BY c.id_celda`,
    callback
  );
};

const obtenerDisponible = (callback) => {
  db.query(
    "SELECT * FROM celda WHERE estado = 'disponible' LIMIT 1",
    callback
  );
};

const ocupar = (id_celda, callback) => {
  db.query(
    "UPDATE celda SET estado = 'ocupada' WHERE id_celda = ?",
    [id_celda], callback
  );
};

const liberar = (id_celda, callback) => {
  db.query(
    "UPDATE celda SET estado = 'disponible' WHERE id_celda = ?",
    [id_celda], callback
  );
};

module.exports = { obtenerTodas, obtenerDisponible, ocupar, liberar };