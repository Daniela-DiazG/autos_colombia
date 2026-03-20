//Valida y procesa las peticiones de vehículos. Llama a vehiculoModel para registrar o consultar.

const vehiculoModel = require('../models/vehiculoModel');

const listar = (req, res) => {
  vehiculoModel.obtenerTodos((err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener vehículos.' });
    res.json(rows);
  });
};

const crear = (req, res) => {
  const { placa, tipo } = req.body;
  if (!placa || !tipo)
    return res.status(400).json({ error: 'Placa y tipo son obligatorios.' });

  vehiculoModel.crear({ placa: placa.toUpperCase(), tipo }, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY')
        return res.status(400).json({ error: 'La placa ya está registrada.' });
      return res.status(500).json({ error: 'Error al registrar vehículo.' });
    }
    res.status(201).json({ mensaje: 'Vehículo registrado correctamente.' });
  });
};

module.exports = { listar, crear };