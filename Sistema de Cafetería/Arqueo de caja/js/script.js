document.addEventListener("DOMContentLoaded", function () {
    function calcularTotal() {
        const valores = {
            "20ctvs": 0.20, "50ctvs": 0.50, "1bs": 1, "2bs": 2, "5bs": 5,
            "10bs": 10, "20bs": 20, "50bs": 50, "100bs": 100, "200bs": 200
        };

        let total = 0;
        Object.keys(valores).forEach(id => {
            const cantidad = parseFloat(document.getElementById(id).value) || 0;
            total += cantidad * valores[id];
        });

        document.getElementById("totalCalculado").textContent = total.toFixed(2);
    }

    document.querySelectorAll(".form-group input").forEach(input => {
        input.addEventListener("input", calcularTotal);
    });

    // ✅ Mostrar la fecha y hora actual en el título
    function actualizarFechaHora() {
        const ahora = new Date().toLocaleString();
        document.getElementById("fechaHora").textContent = ahora;
    }
    setInterval(actualizarFechaHora, 1000); // Actualiza cada segundo

    const arqueoGuardado = localStorage.getItem("arqueoCaja");

    if (arqueoGuardado) {
        const datos = JSON.parse(arqueoGuardado);

        document.querySelectorAll("#formularioArqueo input").forEach(input => {
            input.value = datos[input.name];
            input.setAttribute("disabled", true);
        });

        document.querySelector(".btn-guardar").style.display = "none";
        document.getElementById("totalCalculado").textContent = datos.total;
    }

    document.getElementById("formularioArqueo").addEventListener("submit", function (event) {
        event.preventDefault();

        if (localStorage.getItem("arqueoCaja")) {
            alert("El arqueo ya fue registrado hoy.");
            return;
        }

        const datos = {};
        document.querySelectorAll("#formularioArqueo input").forEach(input => {
            datos[input.name] = input.value;
        });

        datos.total = document.getElementById("totalCalculado").textContent;
        datos.fechaHora = new Date().toLocaleString(); // ✅ Guarda la fecha y hora solo una vez

        localStorage.setItem("arqueoCaja", JSON.stringify(datos));
        localStorage.setItem("ultimoArqueoFecha", new Date().toISOString().split("T")[0]);

        alert("Arqueo guardado con éxito.");
        location.reload();
    });

    document.getElementById("verDetallesBtn").addEventListener("click", function () {
        const listaDetalles = document.getElementById("detallesLista");
        listaDetalles.innerHTML = "";

        const arqueoGuardado = JSON.parse(localStorage.getItem("arqueoCaja"));

        if (!arqueoGuardado) {
            alert("No hay arqueo registrado.");
            return;
        }

        Object.keys(arqueoGuardado).forEach(key => {
            if (key !== "total" && key !== "fechaHora") {
                const cantidad = arqueoGuardado[key];
                if (cantidad > 0) {
                    const li = document.createElement("li");
                    li.textContent = `${key}: ${cantidad} unidades`;
                    listaDetalles.appendChild(li);
                }
            }
        });

        document.getElementById("detalleFecha").textContent = arqueoGuardado.fechaHora; // ✅ Se mantiene estática
        document.getElementById("detalleUsuario").textContent = "Usuario Genérico";
        document.getElementById("detallesArqueo").style.display = "block";
    });

    function resetArqueo() {
        const ultimoArqueo = localStorage.getItem("ultimoArqueoFecha");
        const hoy = new Date().toISOString().split("T")[0];

        if (ultimoArqueo !== hoy) {
            localStorage.removeItem("arqueoCaja");
            localStorage.setItem("ultimoArqueoFecha", hoy);
            location.reload();
        }
    }

    resetArqueo();
});




function nuevoDia() {
    // Obtener la última fecha guardada en localStorage
    let ultimaFecha = localStorage.getItem("ultimoArqueoFecha");

    if (!ultimaFecha) {
        ultimaFecha = new Date().toISOString().split("T")[0]; // Si no hay fecha guardada, tomar la de hoy
    }

    // Convertir a objeto Date y sumar un día
    let nuevaFecha = new Date(ultimaFecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + 1);

    // Formatear la nueva fecha como YYYY-MM-DD
    let nuevaFechaStr = nuevaFecha.toISOString().split("T")[0];

    // Guardar la nueva fecha simulada en localStorage
    localStorage.setItem("ultimoArqueoFecha", nuevaFechaStr);

    // Recargar la página para aplicar los cambios
    location.reload();
}


/* Alerta de ingredientes bajos */
document.addEventListener("DOMContentLoaded", function () {
    let notificacionesVistas = false;
    let ultimoContadorVisto = 0;

    const campana = document.getElementById("campana-alerta");
    if (!campana) {
        console.error("No se encontró el elemento con id 'campana-alerta'");
        return;
    }

    const campanaImg = campana.querySelector("img");
    if (campanaImg) {
        campanaImg.src = "img/IconoAlerta.svg";
    }

    const contadorAlertas = document.getElementById("contador-alertas");

    // Crear modal
    const modal = document.createElement("div");
    modal.id = "modal-alerta";
    modal.innerHTML = `
        <div id="modal-contenido">
            <h2 style="margin: 25px; color: white;">Alertas de Stock</h2>
            <div id="contenedor-alertas"></div>
            <button id="cerrar-modal">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Función para cargar alertas
    function cargarAlertas() {
        fetch("alerta.php")
            .then(response => response.json())
            .then(alertas => {
                const newCount = alertas.length;
                if (newCount > 0 && (!notificacionesVistas || newCount > ultimoContadorVisto)) {
                    contadorAlertas.style.display = "block";
                    contadorAlertas.innerText = newCount;
                    ultimoContadorVisto = newCount;
                    notificacionesVistas = false;
                } else {
                    contadorAlertas.style.display = "none";
                }

                const contenedorAlertas = document.getElementById("contenedor-alertas");
                contenedorAlertas.innerHTML = alertas.length > 0
                    ? alertas.map(alerta => `
                        <div class="alert-card">
                            <p><strong>Producto:</strong> ${alerta.nombre}</p>
                            <p><strong>Stock Disponible:</strong> ${alerta.stock_disponible}</p>
                            <p>El producto ${alerta.nombre} tiene un stock disponible de ${alerta.stock_disponible}. El stock de ${alerta.nombre} está bajo. Compra más.</p>
                        </div>
                    `).join("")
                    : `<p style="text-align: center;">No hay alertas</p>`;

                // Agregar evento de clic a las cards
                document.querySelectorAll(".alert-card").forEach(card => {
                    card.addEventListener("click", () => {
                        window.location.href = "../Inventario/interfaz.php";
                    });
                });
            })
            .catch(err => console.error("Error al cargar alertas:", err));
    }

    // Eventos
    campana.addEventListener("click", () => {
        cargarAlertas();
        modal.style.display = "block";
    });

    document.getElementById("cerrar-modal").addEventListener("click", () => {
        modal.style.display = "none";
        notificacionesVistas = true;
        contadorAlertas.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            notificacionesVistas = true;
            contadorAlertas.style.display = "none";
        }
    });

    // Cargar alertas al inicio y cada 60 segundos
    cargarAlertas();
    setInterval(cargarAlertas, 60000);
});
