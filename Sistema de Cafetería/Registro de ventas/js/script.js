const carrusel = document.getElementById('carrusel');
const indicadoresContainer = document.getElementById('indicadores');
const tablaProductosBody = document.querySelector('.TablaProductos tbody'); // tbody de la tabla
let productos = [];
let items = []; // Arreglo para almacenar los productos agregados al pedido
let posicionActual = 0;
let enTransicion = false;

// Obtener productos desde la base de datos
fetch('get_products.php')
  .then(response => response.json())
  .then(data => {
    productos = data;
    generarCards();
    generarIndicadores();
    actualizarBotones();
    cargarClases(); // Cargar las clases al inicio
  })
  .catch(error => console.error('Error al cargar productos:', error));

// Generar las cards del carrusel dinámicamente
function generarCards(productosParaMostrar = productos) {
  carrusel.innerHTML = productosParaMostrar.map(producto => `
    <div class="card" data-id="${producto.id}">
      <div class="menuCard">
        <button onclick="seleccionarTipo(this, ${producto.id}, 'entero')">Entero</button>
        <button onclick="seleccionarTipo(this, ${producto.id}, 'porcion')">Porción</button>
      </div>
      <div class="contenidoCard">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <p>${producto.nombre}</p>
      </div>
      <div class="funcionesCard">
        <h4>Cantidad</h4>
        <input type="number" min="0" value="0" onchange="actualizarCantidad(this, ${producto.id})">
        <button onclick="incrementarCantidad(${producto.id})">+</button>
      </div>
    </div>
  `).join('');
}

// Generar indicadores para el carrusel
function generarIndicadores() {
  const numPaginas = Math.ceil(productos.length / getCardsPerView());
  indicadoresContainer.innerHTML = Array(numPaginas).fill().map((_, i) => `
    <div class="indicador ${i === 0 ? 'activo' : ''}" onclick="irAPagina(${i})"></div>
  `).join('');
}

// Retorna el número de cards visibles según el ancho de la pantalla
function getCardsPerView() {
  const width = window.innerWidth;
  if (width < 480) return 1;
  if (width < 768) return 2;
  if (width < 1024) return 3;
  return 4;
}

function moverCarrusel(direccion) {
  if (enTransicion) return;
  const cardsPerView = getCardsPerView();
  const maxPosition = productos.length - cardsPerView;
  const nuevaPosicion = posicionActual + direccion;
  if (nuevaPosicion < 0 || nuevaPosicion > maxPosition) return;
  enTransicion = true;
  posicionActual = nuevaPosicion;
  const desplazamiento = -(posicionActual * (100 / cardsPerView));
  carrusel.style.transform = `translateX(${desplazamiento}%)`;
  actualizarIndicadores();
  actualizarBotones();
  setTimeout(() => enTransicion = false, 500);
}

function irAPagina(pagina) {
  const cardsPerView = getCardsPerView();
  posicionActual = pagina;
  const desplazamiento = -(pagina * (100 / cardsPerView));
  carrusel.style.transform = `translateX(${desplazamiento}%)`;
  actualizarIndicadores();
  actualizarBotones();
}

function actualizarIndicadores() {
  const indicadores = document.querySelectorAll('.indicador');
  indicadores.forEach((ind, i) => {
    ind.classList.toggle('activo', i === posicionActual);
  });
}

function actualizarBotones() {
  const prevBtn = document.querySelector('.boton-carrusel.prev');
  const nextBtn = document.querySelector('.boton-carrusel.next');
  const cardsPerView = getCardsPerView();
  prevBtn.disabled = posicionActual === 0;
  nextBtn.disabled = posicionActual >= productos.length - cardsPerView;
}

// Marca el tipo de producto seleccionado (entero o porción)
function seleccionarTipo(btn, productoId, tipo) {
  const card = btn.closest('.card');
  const botones = card.querySelectorAll('.menuCard button');
  botones.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Si requieres guardar el tipo en el objeto, puedes hacerlo aquí.
}

// Asegura que la cantidad no sea menor a 0
function actualizarCantidad(input, productoId) {
  input.value = Math.max(0, parseInt(input.value) || 0);
}

// Función que se ejecuta al presionar el botón "+" en una card
function incrementarCantidad(productoId) {
  const cantidadInput = document.querySelector(`.card[data-id="${productoId}"] input[type="number"]`);
  const cantidad = parseInt(cantidadInput.value) || 0;

  if (cantidad > 0) {
    const producto = productos.find(p => p.id == productoId);
    if (!producto) {
      alert("Producto no encontrado.");
      return;
    }

    items.push({
      id: producto.id,
      nombre: producto.nombre,
      clase: producto.categoria, // Cambia 'producto.clase' por 'producto.categoria'
      cantidad: cantidad,
      precio_unitario: producto.precio,
      precio_total: producto.precio * cantidad
    });

    actualizarTabla();
    cantidadInput.value = 0;
  } else {
    alert("Ingrese una cantidad mayor que cero.");
  }
}


function actualizarTabla() {
  const tbody = document.querySelector('.TablaProductos tbody');
  tbody.innerHTML = ""; // Limpiar la tabla
  let total = 0;

  items.forEach((item, index) => {
    total += item.precio_total;
    const fila = `<tr>
      <td>${item.id}</td>
      <td>${item.nombre}</td>
      <td>${item.clase}</td>
      <td>${item.cantidad}</td>
      <td>${item.precio_unitario}</td>
      <td>${item.precio_total}</td>
      <td><img src="img/IconoBasura.svg" alt="Eliminar" class="IconoEliminar" onclick="eliminarProducto(${index})"></td>
    </tr>`;
    tbody.innerHTML += fila;
  });

  document.getElementById("total").innerText = total;
}

// Elimina un producto del arreglo y actualiza la tabla
function eliminarProducto(index) {
  items.splice(index, 1);
  actualizarTabla();
}


// Función para cargar las clases en el select
function cargarClases() {
  fetch("get_classes.php")
    .then(response => response.json())
    .then(data => {
      const selectClases = document.getElementById("categorias");
      selectClases.innerHTML = "<option value='#'>Seleccione una categoría</option>";

      data.forEach(categoria => {
        let option = document.createElement("option");
        option.value = categoria.toLowerCase().replace(/\s+/g, "-");  // Normalizamos el nombre de la categoría
        option.textContent = categoria;
        selectClases.appendChild(option);
      });

      // Asignar el evento onchange para filtrar productos por categoría
      selectClases.addEventListener('change', function() {
        const categoriaSeleccionada = selectClases.value;

        // Filtrar productos según la categoría seleccionada
        let productosFiltrados = productos;
        if (categoriaSeleccionada !== "#") {
          productosFiltrados = productos.filter(producto => producto.categoria.toLowerCase().replace(/\s+/g, "-") === categoriaSeleccionada);
        }

        // Ordenar los productos alfabéticamente por nombre
        productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Actualizar la visualización de los productos filtrados
        generarCards(productosFiltrados); // Esta función debería generar las tarjetas de productos
        generarIndicadores(); // Si es necesario
        actualizarBotones(); // Si es necesario
      });
    })
    .catch(error => console.error("Error al cargar categorías:", error));
}


// Función para finalizar el pedido
function finalizarPedido() {
  var ci = document.getElementById("ci").value.trim();
  var nombre = document.getElementById("nombre").value.trim();

  if (items.length === 0) {
      alert("Agregue al menos un producto.");
      return;
  }

  if (!nombre || !ci) {
      alert("El nombre y el CI son obligatorios.");
      return;
  }

  // Asegurar que cada item tenga el ID del producto correcto
  items = items.map(item => ({
      id: item.id,  // ID del producto (clave foránea en detallepedido)
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario
  }));

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "insert_order.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          if (response.success) {
              alert(response.success);
              items = [];  
              document.getElementById("ci").value = "";
              document.getElementById("nombre").value = "";
              actualizarTabla();
          } else {
              alert("Error: " + response.error);
          }
      }
  };

  var datos = "ci=" + encodeURIComponent(ci) + "&nombre=" + encodeURIComponent(nombre) + "&items=" + encodeURIComponent(JSON.stringify(items));
  xhr.send(datos);
}


// Asignar la función al botón "Confirmar"
document.querySelector(".BtnConfirmar button").addEventListener("click", finalizarPedido);
  
document.addEventListener("DOMContentLoaded", function () {
    // Asignar el evento onclick al icono del buscador
    document.querySelector(".ImgBusqueda").addEventListener("click", buscarCliente);
});

function buscarCliente() {
    var ciInput = document.getElementById("ci");
    var nombreInput = document.getElementById("nombre");
    var ciEncontradoInput = document.getElementById("ciEncontrado");
    var ci = ciInput.value.trim();

    if (ci === "") {
        alert("Ingrese un CI válido.");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "get_client.php?ci=" + encodeURIComponent(ci), true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            if (respuesta.nombre === "") {
                // Cliente no encontrado: no borro el nombre si ya hay algo
                if(nombreInput.value.trim() === ""){
                    // Si está vacío, se deja así para que el usuario lo complete
                    alert("Cliente no encontrado. Se agregará a la base de datos. Por favor, ingrese el nombre.");
                } else {
                    alert("Cliente no encontrado. Se agregará a la base de datos.");
                    agregarCliente()
                }
                ciEncontradoInput.value = ci;
            } else {
                // Cliente encontrado
                nombreInput.value = respuesta.nombre;
                ciEncontradoInput.value = ci;
            }
        }
    };
    xhr.send();
}


function agregarCliente() {
    var ci = document.getElementById("ci").value.trim();
            var nombre = document.getElementById("nombre").value.trim();

            if (ci === "" || nombre === "") {
                alert("Debe ingresar un CI y un Nombre.");
                return;
            }

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "add_client.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    alert(xhr.responseText);
                }
            };

            var datos = "ci=" + encodeURIComponent(ci) + "&nombre=" + encodeURIComponent(nombre);
            xhr.send(datos);
        }

        document.addEventListener("DOMContentLoaded", function () {
            cargarClases();
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



        