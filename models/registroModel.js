const db = require("../db/conexion");

exports.registrarVehiculo = (placa, tipo, callback) => {
    const sql = "INSERT INTO vehiculo (placa, tipo) VALUES (?,?)";
    db.query(sql, [placa, tipo], callback);
};

exports.registrarEntrada = (placa, callback) => {

    const buscarCelda = "SELECT id_celda FROM celda WHERE estado='disponible' LIMIT 1";

    db.query(buscarCelda, (err, result) => {

        if (err) return callback(err);

        if (result.length === 0) {
            return callback("No hay celdas disponibles");
        }

        const celda = result[0].id_celda;

        const registrar = `
        INSERT INTO registro (placa, fecha_entrada, id_celda)
        VALUES (?, NOW(), ?)
        `;

        db.query(registrar, [placa, celda], (err) => {

            if (err) return callback(err);

            const ocuparCelda = "UPDATE celda SET estado='ocupado' WHERE id_celda=?";

            db.query(ocuparCelda, [celda], callback);
        });
    });
};

exports.registrarSalida = (placa, callback) => {

    const buscar = `
    SELECT id_registro, id_celda 
    FROM registro 
    WHERE placa=? AND fecha_salida IS NULL
    `;

    db.query(buscar, [placa], (err, result) => {

        if (err) return callback(err);

        if (result.length === 0) {
            return callback("Vehículo no encontrado");
        }

        const registro = result[0];

        const salida = `
        UPDATE registro
        SET fecha_salida = NOW()
        WHERE id_registro = ?
        `;

        db.query(salida, [registro.id_registro], (err) => {

            if (err) return callback(err);

            const liberar = `
            UPDATE celda 
            SET estado='disponible'
            WHERE id_celda=?
            `;

            db.query(liberar, [registro.id_celda], callback);
        });
    });
};