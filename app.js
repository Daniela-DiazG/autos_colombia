const express = require('express');
const path    = require('path');
const app     = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const vehiculosRoutes = require('./routes/vehiculos');
const registrosRoutes = require('./routes/registros');
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/registros', registrosRoutes);


const usuariosRoutes = require('./routes/usuarios');
const celdasRoutes   = require('./routes/celdas');
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/celdas',   celdasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor en http://localhost:${PORT}`)
);