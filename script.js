const STORAGE_KEY = "mascotasVeterinaria";
let mascotas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let filtroActual = "Todos";

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

    const estadoNormalizado = estado.trim().toLowerCase();

    if (estadoNormalizado !== "pendiente" && estadoNormalizado !== "atendida") {
        mostrarMensaje("Por favor, ingrese un estado valido (Pendiente/Atendida).");
        return false;
    }

    datos.estado = estadoNormalizado === "pendiente" ? "Pendiente" : "Atendida";
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

    const mascotasFiltradas = mascotas.filter(mascota => {
        if (filtroActual === "Todos") return true;
        return mascota.estado === filtroActual;
    });

    if (mascotasFiltradas.length === 0) {
        const mensajeVacio = document.createElement("li");
        mensajeVacio.textContent = "No hay mascotas registradas con este filtro.";
        listaMascotas.appendChild(mensajeVacio);
    } else {
        mascotasFiltradas.forEach((mascota, index) => {
            const mascotaItem = document.createElement("li");
            mascotaItem.className = "mb-3 rounded-xl bg-gray-50 p-3";

            const textoMascota = document.createElement("div");
            textoMascota.textContent = `Nombre: ${mascota.nombre}, Especie: ${mascota.especie}, Propietario: ${mascota.propietario}, Edad: ${mascota.edad}`;

            const estadoMascota = document.createElement("span");
            estadoMascota.textContent = `Estado: ${mascota.estado}`;
            estadoMascota.className = "mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold";
            if (mascota.estado === "Pendiente") {
                estadoMascota.classList.add("bg-yellow-100", "text-yellow-800");
            } else if (mascota.estado === "Atendida") {
                estadoMascota.classList.add("bg-green-100", "text-green-800");
            } else {
                estadoMascota.classList.add("bg-blue-100", "text-blue-800");
            }

            const botonPendiente = document.createElement("button");
            botonPendiente.textContent = "Pendiente";
            botonPendiente.className = "transition hover:-translate-y-1 hover:scale-105 hover:bg-yellow-500 mr-2 rounded-full bg-yellow-200 px-3 py-1 text-sm text-gray-700";
            botonPendiente.addEventListener("click", () => {
                const mascotaOriginal = mascotas.find(item => item.nombre === mascota.nombre && item.propietario === mascota.propietario);
                if (mascotaOriginal) {
                    mascotaOriginal.estado = "Pendiente";
                    guardarMascotas();
                    mostrarMensaje(`Estado actualizado a pendiente para ${mascota.nombre}.`);
                    mostrarMascotas();
                }
            });

            const botonAtendida = document.createElement("button");
            botonAtendida.textContent = "Atendida";
            botonAtendida.className = "transition hover:-translate-y-1 hover:scale-105 hover:bg-green-500 mr-2 rounded-full bg-green-200 px-3 py-1 text-sm text-gray-700";
            botonAtendida.addEventListener("click", () => {
                const mascotaOriginal = mascotas.find(item => item.nombre === mascota.nombre && item.propietario === mascota.propietario);
                if (mascotaOriginal) {
                    mascotaOriginal.estado = "Atendida";
                    guardarMascotas();
                    mostrarMensaje(`Estado actualizado a atendida para ${mascota.nombre}.`);
                    mostrarMascotas();
                }
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "transition hover:-translate-y-1 hover:scale-105 hover:bg-red-500 rounded-full bg-red-200 px-3 py-1 text-sm text-gray-700";
            botonEliminar.addEventListener("click", () => {
                const indexOriginal = mascotas.findIndex(item => item.nombre === mascota.nombre && item.propietario === mascota.propietario);
                if (indexOriginal !== -1) {
                    mascotas.splice(indexOriginal, 1);
                    guardarMascotas();
                    mostrarMensaje("Información de la mascota eliminada correctamente.");
                    mostrarMascotas();
                }
            });

            mascotaItem.appendChild(textoMascota);
            mascotaItem.appendChild(estadoMascota);
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
    const mensajeElemento = document.getElementById("mensaje");
    mensajeElemento.textContent = mensaje;
    mensajeElemento.className = "mt-3 rounded-full px-3 py-2 text-sm font-medium";

    if (mensaje.includes("pendiente")) {
        mensajeElemento.classList.add("bg-yellow-100", "text-yellow-800");
    } else if (mensaje.includes("atendida")) {
        mensajeElemento.classList.add("bg-green-100", "text-green-800");
    } else {
        mensajeElemento.classList.add("bg-blue-100", "text-blue-800");
    }
}

function limpiarFormulario() {
    document.getElementById("nombreMascota").value = "";
    document.getElementById("especieMascota").value = "";
    document.getElementById("nombrePropietario").value = "";
    document.getElementById("edadMascota").value = "";
    document.getElementById("estadoMascota").value = "";
}

function cambiarFiltro(nuevoFiltro) {
    filtroActual = nuevoFiltro;
    mostrarMascotas();
}

document.getElementById("btnAgregar").addEventListener("click", agregarMascota);

document.getElementById("filtroTodos").addEventListener("click", () => cambiarFiltro("Todos"));
document.getElementById("filtroPendientes").addEventListener("click", () => cambiarFiltro("Pendiente"));
document.getElementById("filtroAtendidas").addEventListener("click", () => cambiarFiltro("Atendida"));

mostrarMascotas();

