//info:Controla entrada/salida de vehículos. Actualiza celda al registrar entrada y calcula tiempo al registrar salida.

const registroModel = require('../models/registroModel');
const celdaModel    = require('../models/celdaModel');

const listar = (req, res) => {
  registroModel.obtenerTodos((err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener registros.' });
    res.json(rows);
  });
};

const entrada = (req, res) => {
  const { placa } = req.body;
  if (!placa) return res.status(400).json({ error: 'Placa requerida.' });

  celdaModel.obtenerDisponible((err, celdas) => {
    if (err)  return res.status(500).json({ error: 'Error buscando celda.' });
    if (!celdas.length)
      return res.status(400).json({ error: 'No hay celdas disponibles.' });

    const celda = celdas[0];
    registroModel.registrarEntrada(
      { placa: placa.toUpperCase(), id_celda: celda.id_celda },
      (err2, result) => {
        if (err2) return res.status(500).json({ error: 'Error al registrar entrada.' });
        celdaModel.ocupar(celda.id_celda, () => {});
        res.status(201).json({
          mensaje: 'Entrada registrada.',
          id_registro: result.insertId,
          id_celda: celda.id_celda
        });
      }
    );
  });
};

const salida = (req, res) => {
  const { id } = req.params;
  registroModel.registrarSalida(id, (err) => {
    if (err) return res.status(500).json({ error: 'Error al registrar salida.' });
    res.json({ mensaje: 'Salida registrada correctamente.' });
  });
};

module.exports = { listar, entrada, salida };