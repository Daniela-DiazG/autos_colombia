//info: GET /api/registros — listar. POST /api/registros — entrada. PUT /api/registros/:id — salida.

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/registroController');

router.get('/',           controller.listar);
router.post('/entrada',   controller.entrada);
router.put('/:id/salida', controller.salida);

module.exports = router;