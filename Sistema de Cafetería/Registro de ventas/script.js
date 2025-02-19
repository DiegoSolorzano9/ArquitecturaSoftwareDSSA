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
    // Buscar el producto usando comparación flexible
    const producto = productos.find(p => p.id == productoId);
    if (!producto) {
      alert("Producto no encontrado.");
      return;
    }

    items.push({
      id: producto.id,                        // Código del producto
      nombre: producto.nombre,                // Nombre del producto
      clase: producto.clase,                  // Clase (por ejemplo, bebida, snack, etc.)
      cantidad: cantidad,                     // Cantidad seleccionada
      precio_unitario: producto.precio,       // Precio unitario
      precio_total: producto.precio * cantidad // Subtotal = precio unitario * cantidad
    });

    actualizarTabla();
    // Resetear el input
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
      const selectClases = document.getElementById("categorias"); // El select aún se llama 'categorias'
      selectClases.innerHTML = "<option value='#'>Seleccione una clase</option>";

      data.forEach(clase => {
        let option = document.createElement("option");
        option.value = clase.toLowerCase().replace(/\s+/g, "-");
        option.textContent = clase;
        selectClases.appendChild(option);
      });

      // Asignar el evento onchange para filtrar productos por categoría
      selectClases.addEventListener('change', function() {
        const categoriaSeleccionada = selectClases.value;
        let productosFiltrados = productos;

        if (categoriaSeleccionada !== "#") {
          productosFiltrados = productos.filter(producto => producto.clase.toLowerCase().replace(/\s+/g, "-") === categoriaSeleccionada);
        }

        productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente
        generarCards(productosFiltrados); // Actualizar el carrusel
        generarIndicadores();
        actualizarBotones();
      });
    })
    .catch(error => console.error("Error al cargar clases:", error));
}









// Función para finalizar el pedido
function finalizarPedido() {
  var ci = document.getElementById("ci").value.trim();
  var nombre = document.getElementById("nombre").value.trim();

  if (items.length === 0) {
      alert("Agregue al menos un producto.");
      return;
  }

  // Asegurar que cada item tenga la clave "producto"
  items = items.map(item => ({
      producto: item.nombre,  // Asegurar que se envía como "producto"
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      precio_total: item.precio_total
  }));

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "insert_order.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          alert(xhr.responseText);
          items = [];
          document.getElementById("ci").value = "";
          document.getElementById("nombre").value = "";
          actualizarTabla();
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
        

        