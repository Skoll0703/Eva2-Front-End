const STORAGE_KEY = "mascotasVeterinaria";
let mascotas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function obtenerDatos() {
    const nombreMascota = document.getElementById("nombreMascota").value.trim();
    const especieMascota = document.getElementById("especieMascota").value.trim();
    const nombrePropietario = document.getElementById("nombrePropietario").value.trim();
    const edadMascota = document.getElementById("edadMascota").value.trim();
    const estadoMascota = document.getElementById("estadoMascota").value.trim();

    return {
        nombre: nombreMascota,
        especie: especieMascota,
        propietario: nombrePropietario,
        edad: Number(edadMascota),
        estado: estadoMascota
    };
}

function validarDatos(datos) {
    const { nombre, especie, propietario, edad, estado } = datos;

    if (!nombre || !especie || !propietario || edad === "" || !estado) {
        mostrarMensaje("Por favor, complete todos los campos.");
        return false;
    }

    if (Number.isNaN(edad) || edad < 0) {
        mostrarMensaje("Por favor, ingrese una edad válida.");
        return false;
    }

    return true;
}

function guardarMascotas() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas));
}

function agregarMascota() {
    const datos = obtenerDatos();

    if (!validarDatos(datos)) {
        return;
    }

    mascotas.push(datos);
    guardarMascotas();
    limpiarFormulario();
    mostrarMensaje("Mascota agregada correctamente.");
    mostrarMascotas();
}

function mostrarMascotas() {
    const listaMascotas = document.getElementById("listaMascotas");
    listaMascotas.innerHTML = "";

    if (mascotas.length === 0) {
        const mensajeVacio = document.createElement("li");
        mensajeVacio.textContent = "No hay mascotas registradas.";
        listaMascotas.appendChild(mensajeVacio);
    } else {
        mascotas.forEach((mascota, index) => {
            const mascotaItem = document.createElement("li");
            mascotaItem.textContent = `Nombre: ${mascota.nombre}, Especie: ${mascota.especie}, Propietario: ${mascota.propietario}, Edad: ${mascota.edad}, Estado: ${mascota.estado}`;

            const botonPendiente = document.createElement("button");
            botonPendiente.textContent = "Pendiente";
            botonPendiente.addEventListener("click", () => {
                mascotas[index].estado = "Pendiente";
                guardarMascotas();
                mostrarMensaje(`Estado actualizado a pendiente para ${mascota.nombre}.`);
                mostrarMascotas();
            });

            const botonAtendida = document.createElement("button");
            botonAtendida.textContent = "Atendida";
            botonAtendida.addEventListener("click", () => {
                mascotas[index].estado = "Atendida";
                guardarMascotas();
                mostrarMensaje(`Estado actualizado a atendida para ${mascota.nombre}.`);
                mostrarMascotas();
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", () => {
                mascotas.splice(index, 1);
                guardarMascotas();
                mostrarMensaje("Información de la mascota eliminada correctamente.");
                mostrarMascotas();
            });

            mascotaItem.appendChild(botonPendiente);
            mascotaItem.appendChild(botonAtendida);
            mascotaItem.appendChild(botonEliminar);
            listaMascotas.appendChild(mascotaItem);
        });
    }

    actualizarContador();
}

function actualizarContador() {
    const contador = document.getElementById("mascotasRegistradas");
    const pendientes = document.getElementById("mascotasPendientes");
    const atendidas = document.getElementById("mascotasAtendidas");

    const totalPendientes = mascotas.filter(mascota => mascota.estado === "Pendiente").length;
    const totalAtendidas = mascotas.filter(mascota => mascota.estado === "Atendida").length;

    contador.textContent = `Mascotas Registradas: ${mascotas.length}`;
    pendientes.textContent = `Mascotas Pendientes: ${totalPendientes}`;
    atendidas.textContent = `Mascotas Atendidas: ${totalAtendidas}`;
}

function mostrarMensaje(mensaje) {
    document.getElementById("mensaje").textContent = mensaje;
}

function limpiarFormulario() {
    document.getElementById("nombreMascota").value = "";
    document.getElementById("especieMascota").value = "";
    document.getElementById("nombrePropietario").value = "";
    document.getElementById("edadMascota").value = "";
    document.getElementById("estadoMascota").value = "";
}

document.getElementById("btnAgregar").addEventListener("click", agregarMascota);
mostrarMascotas();

