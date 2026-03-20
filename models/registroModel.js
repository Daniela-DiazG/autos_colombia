//Consultas SQL sobre la tabla registro: registrar entrada/salida, listar registros por placa o celda.

const db = require('../db/db');

const registrarEntrada = (datos, callback) => {
  db.query(
    `INSERT INTO registro (fecha_entrada, placa, id_celda)
     VALUES (NOW(), ?, ?)`,
    [datos.placa, datos.id_celda],
    callback
  );
};

const registrarSalida = (id_registro, callback) => {
  db.query(
    `UPDATE registro SET fecha_salida = NOW()
     WHERE id_registro = ?`,
    [id_registro],
    callback
  );
};

const obtenerTodos = (callback) => {
  db.query(
    `SELECT r.*, v.tipo
     FROM registro r
     JOIN vehiculo v ON r.placa = v.placa
     ORDER BY r.fecha_entrada DESC`,
    callback
  );
};

module.exports = { registrarEntrada, registrarSalida, obtenerTodos };