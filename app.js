const express = require("express");
const app = express();

const rutas = require("./routes/registroRoutes");

app.use(express.json());

app.use("/api", rutas);

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});