//info: Lista todas las celdas con su estado. Permite cambiar estado manualmente si se necesita.

const celdaModel = require('../models/celdaModel');

const listar = (req, res) => {
  celdaModel.obtenerTodas((err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener celdas.' });
    res.json(rows);
  });
};

module.exports = { listar };