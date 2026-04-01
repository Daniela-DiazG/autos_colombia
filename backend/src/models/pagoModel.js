//info: Consultas SQL sobre la tabla pago: registrar pago y actualizar fecha de vencimiento.

const db = require('../config/db');

const registrarPagoYActualizarVencimiento = (datosPago, callback) => {
  const { placa, fecha_pago, numero_comprobante, meses_pagados } = datosPago;

  // 1. Obtener el usuario actual para verificar su fecha de vencimiento
  db.query('SELECT id_usuario, fecha_vencimiento FROM usuario WHERE placa = ? LIMIT 1', [placa], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback({ kind: 'not_found', message: 'No se encontró un usuario con esa placa.' });

    const usuario = results[0];
    let vencimientoActual = usuario.fecha_vencimiento ? new Date(usuario.fecha_vencimiento) : null;
    let fechaBase = new Date(); // Fecha actual

    // Si la fecha actual <= vencimientoActual, la fecha base es el vencimiento actual
    if (vencimientoActual && fechaBase <= vencimientoActual) {
      fechaBase = vencimientoActual;
    }

    // Calcular nueva fecha: sumar N meses
    let nuevaFechaVencimiento = new Date(fechaBase);
    nuevaFechaVencimiento.setMonth(nuevaFechaVencimiento.getMonth() + parseInt(meses_pagados, 10));

    // Formatear a YYYY-MM-DD para MySQL
    const formattedDate = nuevaFechaVencimiento.toISOString().split('T')[0];

    // 2. Iniciar transacción
    db.beginTransaction(errTransaction => {
      if (errTransaction) return callback(errTransaction);

      // Insertar pago
      db.query(
        'INSERT INTO pago (placa, fecha_pago, numero_comprobante, meses_pagados) VALUES (?, ?, ?, ?)',
        [placa, fecha_pago, numero_comprobante, meses_pagados],
        (errInsert) => {
          if (errInsert) {
            return db.rollback(() => callback(errInsert));
          }

          // Actualizar usuario
          db.query(
            'UPDATE usuario SET fecha_vencimiento = ? WHERE id_usuario = ?',
            [formattedDate, usuario.id_usuario],
            (errUpdate) => {
              if (errUpdate) {
                return db.rollback(() => callback(errUpdate));
              }

              db.commit(errCommit => {
                if (errCommit) {
                  return db.rollback(() => callback(errCommit));
                }
                callback(null, { nuevaFechaVencimiento: formattedDate });
              });
            }
          );
        }
      );
    });
  });
};

module.exports = { registrarPagoYActualizarVencimiento };
