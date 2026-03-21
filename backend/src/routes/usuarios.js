//info: GET /api/usuarios — listar activos. GET /api/usuarios/buscar?documento= — buscar. POST /api/usuarios — crear. PUT /api/usuarios/:id/desactivar — dar de baja.

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/usuarioController');

router.get('/',               controller.listar);
router.get('/buscar',         controller.buscar);
router.post('/',              controller.crear);
router.put('/:id/desactivar', controller.desactivar);

module.exports = router;