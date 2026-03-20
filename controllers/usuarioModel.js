//Valida campos obligatorios (nombre, tipo_documento, documento, placa), verifica que la placa exista, busca celda disponible, registra usuario y la ocupa. Al desactivar, libera la celda.

const usuarioModel = require('../models/usuarioModel');
const celdaModel   = require('../models/celdaModel');
const db           = require('../db/db');

const TIPOS_DOC = ['CC', 'TI', 'CE', 'Pasaporte'];

const listar = (req, res) => {
  usuarioModel.obtenerTodos((err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios.' });
    res.json(rows);
  });
};

const buscar = (req, res) => {
  const { documento } = req.query;
  if (!documento)
    return res.status(400).json({ error: 'Documento requerido.' });

  usuarioModel.buscarPorDocumento(documento, (err, rows) => {
    if (err)  return res.status(500).json({ error: 'Error en la búsqueda.' });
    if (!rows.length)
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json(rows[0]);
  });
};

const crear = (req, res) => {
  const { nombre, tipo_documento, documento, telefono, placa } = req.body;

  if (!nombre || !tipo_documento || !documento || !placa)
    return res.status(400).json({
      error: 'Nombre, tipo de documento, documento y placa son obligatorios.'
    });

  if (!TIPOS_DOC.includes(tipo_documento))
    return res.status(400).json({
      error: `Tipo de documento inválido. Opciones: ${TIPOS_DOC.join(', ')}.`
    });

  // Verificar que la placa exista en vehiculo
  db.query('SELECT placa FROM vehiculo WHERE placa = ?',
    [placa.toUpperCase()], (err, vehiculos) => {
    if (err) return res.status(500).json({ error: 'Error verificando vehículo.' });
    if (!vehiculos.length)
      return res.status(400).json({
        error: `Placa ${placa} no registrada. Regístrala primero en Vehículos.`
      });

    // Buscar celda disponible
    celdaModel.obtenerDisponible((err2, celdas) => {
      if (err2) return res.status(500).json({ error: 'Error buscando celda.' });
      if (!celdas.length)
        return res.status(400).json({ error: 'No hay celdas disponibles.' });

      const celda = celdas[0];
      const datos = {
        nombre, tipo_documento, documento, telefono,
        placa: placa.toUpperCase(), id_celda: celda.id_celda
      };

      usuarioModel.crear(datos, (err3, result) => {
        if (err3) {
          if (err3.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ error: 'El documento ya está registrado.' });
          return res.status(500).json({ error: 'Error al registrar usuario.' });
        }
        celdaModel.ocupar(celda.id_celda, () => {});
        res.status(201).json({
          mensaje : 'Usuario registrado correctamente.',
          id_usuario : result.insertId,
          id_celda   : celda.id_celda
        });
      });
    });
  });
};

const desactivar = (req, res) => {
  const { id } = req.params;
  usuarioModel.obtenerCeldaPorId(id, (err, rows) => {
    if (err)   return res.status(500).json({ error: 'Error al obtener usuario.' });
    if (!rows.length)
      return res.status(404).json({ error: 'Usuario no encontrado.' });

    const id_celda = rows[0].id_celda;
    usuarioModel.desactivar(id, (err2) => {
      if (err2) return res.status(500).json({ error: 'Error al desactivar usuario.' });
      if (id_celda) celdaModel.liberar(id_celda, () => {});
      res.json({ mensaje: 'Usuario desactivado y celda liberada correctamente.' });
    });
  });
};

module.exports = { listar, buscar, crear, desactivar };