document.addEventListener("DOMContentLoaded", function () {
    // Elementos de la interfaz
    const botonInventario = document.getElementById("botonInventario");
    const botonIngresos = document.getElementById("botonIngresos");
    const botonSalidas = document.querySelector(".botonSalidas");
    const buscador = document.getElementById("buscador");

    const listadoIngredientes = document.getElementById("listadoIngredientes");
    const listadoIngresos = document.getElementById("listadoIngresos");
    const listadoSalidas = document.getElementById("listadoSalidas");

    // Función para cargar los ingredientes desde la base de datos
    function cargarIngredientes() {
        fetch('ingredientes.php')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector("#listadoIngredientes tbody");
                tbody.innerHTML = ""; // Limpiar el contenido anterior

                if (data.length > 0) {
                    data.forEach(ingrediente => {
                        const tr = document.createElement("tr");

                        // Si el stock disponible es igual al stock mínimo, colorear la fila de rojo
                        if (ingrediente.stock_disponible == ingrediente.stock_minimo) {
                            tr.style.backgroundColor = "rgb(250, 72, 72)";
                            tr.style.color = "white";
                        }

                        tr.innerHTML = `
                            <td class="CeldaProductos">${ingrediente.nombre}</td>
                            <td class="CeldaProductos">${ingrediente.stock_disponible}</td>
                            <td class="CeldaProductos">${ingrediente.stock_minimo}</td>
                            <td class="CeldaProductos">${ingrediente.proveedor}</td>
                            <td class="CeldaProductos">${ingrediente.ultima_actualizacion}</td>
                            <td class="CeldaProductos">${ingrediente.estado}</td>
                        `;

                        tbody.appendChild(tr);
                    });
                } else {
                    const tr = document.createElement("tr");
                    tr.innerHTML = "<td colspan='6' class='CeldaProductos'>No hay ingredientes registrados.</td>";
                    tbody.appendChild(tr);
                }
            })
            .catch(error => console.error("Error al cargar los ingredientes:", error));
    }

    // Función para cargar los ingresos desde la base de datos
    function cargarIngresos() {
        fetch('ingresos.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos completos recibidos:", data); // Verifica que llegan todos los ingresos

                const tbody = document.querySelector("#listadoIngresos tbody");
                tbody.innerHTML = ""; // Limpiar antes de agregar nuevos ingresos

                if (data.length > 0) {
                    data.forEach((ingreso, index) => {
                        console.log(`Procesando ingreso ${index + 1}:`, ingreso); // Depuración

                        const tr = document.createElement("tr");

                        // Asegúrate de que los campos tengan valores por defecto si son null o undefined
                        const cantidad = ingreso.cantidad ?? "N/A";
                        const fechaIngreso = ingreso.fecha_ingreso ?? "N/A";
                        const clienteNombre = ingreso.cliente_nombre ?? "N/A";
                        const precioVenta = ingreso.precio_venta ?? "N/A";
                        const recetaNombre = ingreso.receta_nombre ?? "N/A";

                        tr.innerHTML = `
                            <td class="CeldaProductos">${cantidad}</td>
                            <td class="CeldaProductos">${fechaIngreso}</td>
                            <td class="CeldaProductos">${clienteNombre}</td>
                            <td class="CeldaProductos">${precioVenta}</td>
                            <td class="CeldaProductos">${recetaNombre}</td>
                        `;

                        tbody.appendChild(tr);
                    });
                } else {
                    console.warn("No se recibieron ingresos desde el servidor.");
                    const tr = document.createElement("tr");
                    tr.innerHTML = "<td colspan='5' class='CeldaProductos'>No hay ingresos registrados.</td>";
                    tbody.appendChild(tr);
                }
            })
            .catch(error => {
                console.error("Error al cargar los ingresos:", error);
                const tbody = document.querySelector("#listadoIngresos tbody");
                tbody.innerHTML = "<tr><td colspan='5' class='CeldaProductos'>Error al cargar los datos.</td></tr>";
            });
    }

    // Función para cargar las salidas desde la base de datos
    function cargarSalidas() {
        fetch('salidas.php')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector("#listadoSalidas tbody");
                tbody.innerHTML = "";

                if (data.length > 0) {
                    data.forEach(salida => {
                        const tr = document.createElement("tr");

                        tr.innerHTML = `
                            <td class="CeldaProductos">${salida.producto_nombre}</td>
                            <td class="CeldaProductos">${salida.cantidad}</td>
                            <td class="CeldaProductos">${salida.fecha_salida}</td>
                            <td class="CeldaProductos">${salida.costo}</td>
                        `;

                        tbody.appendChild(tr);
                    });
                } else {
                    const tr = document.createElement("tr");
                    tr.innerHTML = "<td colspan='4' class='CeldaProductos'>No hay salidas registradas.</td>";
                    tbody.appendChild(tr);
                }
            })
            .catch(error => console.error("Error al cargar las salidas:", error));
    }

    // Función para ocultar o mostrar el botón de Inventario
    function actualizarVisibilidadBotonInventario(mostrar) {
        botonInventario.style.display = mostrar ? "block" : "none";
    }

    // Evento para mostrar el Inventario
    botonInventario.addEventListener("click", function () {
        listadoIngredientes.style.display = "block";
        listadoIngresos.style.display = "none";
        listadoSalidas.style.display = "none";

        // Ocultar el botón Inventario (porque ya estamos en la vista de inventario)
        actualizarVisibilidadBotonInventario(false);

        // Recargar ingredientes
        cargarIngredientes();
    });

    // Evento para el botón de Ingresos
    botonIngresos.addEventListener("click", function () {
        listadoIngredientes.style.display = "none";
        listadoSalidas.style.display = "none";
        listadoIngresos.style.display = "block";

        // Mostrar el botón Inventario para regresar
        actualizarVisibilidadBotonInventario(true);

        // Cargar los ingresos
        cargarIngresos();
    });

    // Evento para el botón de Salidas
    botonSalidas.addEventListener("click", function () {
        listadoIngredientes.style.display = "none";
        listadoIngresos.style.display = "none";
        listadoSalidas.style.display = "block";

        // Mostrar el botón Inventario para regresar
        actualizarVisibilidadBotonInventario(true);

        // Cargar las salidas
        cargarSalidas();
    });

    // Función para filtrar en tiempo real
    function filtrarTabla() {
        let filtro = buscador.value.toLowerCase();
        let tablas = [listadoIngredientes, listadoIngresos, listadoSalidas];

        tablas.forEach(listado => {
            if (listado.style.display === "block") {
                let filas = listado.querySelectorAll("tbody tr");

                filas.forEach(fila => {
                    let textoFila = fila.textContent.toLowerCase();
                    fila.style.display = textoFila.includes(filtro) ? "" : "none";
                });
            }
        });
    }

    // Evento para la búsqueda en tiempo real
    buscador.addEventListener("input", filtrarTabla);

    // Cargar los ingredientes al inicio y ocultar el botón de Inventario
    cargarIngredientes();
    actualizarVisibilidadBotonInventario(false);
});










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
                        window.location.href = "interfaz.php";
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