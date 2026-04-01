//info: Controlador de pagos

const pagoModel = require('../models/pagoModel');

const registrarPago = (req, res) => {
  const { placa, fecha_pago, numero_comprobante, meses_pagados } = req.body;

  if (!placa || !fecha_pago || !numero_comprobante || !meses_pagados) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  pagoModel.registrarPagoYActualizarVencimiento(
    { placa, fecha_pago, numero_comprobante, meses_pagados },
    (err, result) => {
      if (err) {
        if (err.kind === 'not_found') {
          return res.status(404).json({ error: err.message });
        }
        console.error("Error al registrar pago:", err);
        return res.status(500).json({ error: 'Error interno del servidor al registrar pago.' });
      }

      res.status(201).json({
        mensaje: 'Pago registrado correctamente.',
        nuevaFechaVencimiento: result.nuevaFechaVencimiento
      });
    }
  );
};

module.exports = { registrarPago };
