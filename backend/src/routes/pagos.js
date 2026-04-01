const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/pagoController');

router.post('/', controller.registrarPago);

module.exports = router;
