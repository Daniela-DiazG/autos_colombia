//info: Consultas SQL sobre la tabla usuario: crear, obtenerTodos, buscarPorDocumento, desactivar, obtenerCeldaPorId.

const db = require('../config/db');

const crear = (datos, callback) => {
  db.query(
    `INSERT INTO usuario
       (nombre, tipo_documento, documento, telefono, placa, id_celda)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [datos.nombre, datos.tipo_documento, datos.documento,
     datos.telefono, datos.placa, datos.id_celda],
    callback
  );
};

const obtenerTodos = (callback) => {
  db.query(
    `SELECT u.id_usuario, u.nombre, u.tipo_documento, u.documento,
            u.telefono, u.placa, u.estado, u.id_celda,
            c.estado AS celda_estado
     FROM usuario u
     LEFT JOIN celda c ON u.id_celda = c.id_celda
     WHERE u.estado = 'activo'
     ORDER BY u.id_usuario DESC`,
    callback
  );
};

const buscarPorDocumento = (documento, callback) => {
  db.query(
    `SELECT u.*, c.estado AS celda_estado
     FROM usuario u
     LEFT JOIN celda c ON u.id_celda = c.id_celda
     WHERE u.documento = ?`,
    [documento],
    callback
  );
};

const desactivar = (id_usuario, callback) => {
  db.query(
    `UPDATE usuario
     SET estado = 'inactivo', id_celda = NULL
     WHERE id_usuario = ?`,
    [id_usuario],
    callback
  );
};

const obtenerCeldaPorId = (id_usuario, callback) => {
  db.query(
    'SELECT id_celda FROM usuario WHERE id_usuario = ?',
    [id_usuario],
    callback
  );
};

module.exports = {
  crear, obtenerTodos, buscarPorDocumento,
  desactivar, obtenerCeldaPorId
};