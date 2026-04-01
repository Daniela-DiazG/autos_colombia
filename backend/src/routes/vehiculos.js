//info: GET /api/vehiculos — lista. POST /api/vehiculos — registrar.

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/vehiculoController');

router.get('/',  controller.listar);
router.post('/', controller.crear);
router.get('/:placa/detalles', controller.obtenerDetalles);

module.exports = router;