const express = require('express');
const path    = require('path');
const cors    = require('cors');
const app     = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const vehiculosRoutes = require('./src/routes/vehiculos');
const registrosRoutes = require('./src/routes/registros');
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/registros', registrosRoutes);


const usuariosRoutes = require('./src/routes/usuarios');
const celdasRoutes   = require('./src/routes/celdas');
const pagosRoutes    = require('./src/routes/pagos');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/celdas',   celdasRoutes);
app.use('/api/pagos',    pagosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor en http://localhost:${PORT}`)
);