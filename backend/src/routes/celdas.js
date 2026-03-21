//info: GET /api/celdas — listar todas con estado.

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/celdaController');

router.get('/', controller.listar);

module.exports = router;