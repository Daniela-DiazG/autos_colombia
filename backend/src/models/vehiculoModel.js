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

module.exports = { crear, obtenerTodos };