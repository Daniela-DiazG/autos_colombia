const express = require("express");
const router = express.Router();

const controller = require("../controllers/registroController");

router.post("/vehiculo", controller.crearVehiculo);
router.post("/entrada", controller.entrada);
router.post("/salida", controller.salida);

module.exports = router;