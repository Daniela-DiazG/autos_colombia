const API = "http://localhost:3000/api";

function registrarVehiculo(){

    const placa = document.getElementById("placa").value;
    const tipo = document.getElementById("tipo").value;

    fetch(API + "/vehiculo", {
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({placa,tipo})
    })
    .then(res=>res.text())
    .then(data=>alert(data));
}

function registrarEntrada(){

    const placa = document.getElementById("placaEntrada").value;

    fetch(API + "/entrada", {
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({placa})
    })
    .then(res=>res.text())
    .then(data=>alert(data));
}

function registrarSalida(){

    const placa = document.getElementById("placaSalida").value;

    fetch(API + "/salida", {
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({placa})
    })
    .then(res=>res.text())
    .then(data=>alert(data));
}