CREATE TABLE celda (
    id_celda INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(20)
);

CREATE TABLE vehiculo (
    placa VARCHAR(10) PRIMARY KEY,
    tipo VARCHAR(50)
);

CREATE TABLE registro (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    placa         VARCHAR(10),
    fecha_entrada DATETIME,
    fecha_salida  DATETIME,
    id_celda INT,
    FOREIGN KEY (placa) REFERENCES vehiculo(placa),
    FOREIGN KEY (id_celda) REFERENCES celda(id_celda)
);

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario     INT PRIMARY KEY AUTO_INCREMENT,
    nombre         VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(30)  NOT NULL,
    -- valores: 'CC', 'TI', 'CE', 'Pasaporte'
    documento      VARCHAR(20)  NOT NULL UNIQUE,
    telefono       VARCHAR(20),
    placa          VARCHAR(10)  NOT NULL,
    id_celda       INT,
    estado         VARCHAR(20)  DEFAULT 'activo',
    -- valores: 'activo', 'inactivo'
    FOREIGN KEY (placa)    REFERENCES vehiculo(placa),
    FOREIGN KEY (id_celda) REFERENCES celda(id_celda)
);

CREATE TABLE pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL,
    fecha_pago DATE NOT NULL,
    numero_comprobante VARCHAR(50),
    meses_pagados INT NOT NULL DEFAULT 1,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP, -- Para auditoría (RNF-01)
    FOREIGN KEY (placa) REFERENCES vehiculo(placa)
);

ALTER TABLE usuario 
ADD COLUMN fecha_vencimiento DATE NULL AFTER estado;