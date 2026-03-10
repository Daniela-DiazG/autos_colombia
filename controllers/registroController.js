const model = require("../models/registroModel");

exports.crearVehiculo = (req, res) => {

    const { placa, tipo } = req.body;

    model.registrarVehiculo(placa, tipo, (err) => {

        if (err) return res.send(err);

        res.send("Vehículo registrado");
    });
};

exports.entrada = (req, res) => {

    const { placa } = req.body;

    model.registrarEntrada(placa, (err) => {

        if (err) return res.send(err);

        res.send("Entrada registrada");
    });
};

exports.salida = (req, res) => {

    const { placa } = req.body;

    model.registrarSalida(placa, (err) => {

        if (err) return res.send(err);

        res.send("Salida registrada");
    });
};