
const productos = [
    { id: 1, nombre: 'Tarta de queso', imagen: 'img/tarta de queso.png' },
    { id: 2, nombre: 'Alfajor', imagen: 'img/alfajor.png' },
    { id: 3, nombre: 'Brazo gitano', imagen: 'img/brazo gitano.png' },
    { id: 4, nombre: 'Café', imagen: 'img/cafe.png' },
    { id: 5, nombre: 'Dona', imagen: 'img/dona.png' },
    { id: 6, nombre: 'Limonada', imagen: 'img/limonada.png' },
    { id: 7, nombre: 'Muffins', imagen: 'img/muffins.png' },
    { id: 8, nombre: 'Sandwich', imagen: 'img/Sandwich.png' },
    { id: 9, nombre: 'Sprite', imagen: 'img/sprite.png' }
];

let posicionActual = 0;
let enTransicion = false;
const carrusel = document.getElementById('carrusel');
const indicadoresContainer = document.getElementById('indicadores');

// Generar cards dinámicamente
function generarCards() {
    carrusel.innerHTML = productos.map(producto => `
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

// Generar indicadores
function generarIndicadores() {
    const numPaginas = Math.ceil(productos.length / getCardsPerView());
    indicadoresContainer.innerHTML = Array(numPaginas).fill().map((_, i) => `
        <div class="indicador ${i === 0 ? 'activo' : ''}" onclick="irAPagina(${i})"></div>
    `).join('');
}

// Obtener número de cards visibles según el ancho de la pantalla
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

function seleccionarTipo(btn, productoId, tipo) {
    const card = btn.closest('.card');
    const botones = card.querySelectorAll('.menuCard button');
    botones.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function actualizarCantidad(input, productoId) {
    input.value = Math.max(0, parseInt(input.value) || 0);
}

// Inicialización
window.addEventListener('load', () => {
    generarCards();
    generarIndicadores();
    actualizarBotones();
});

window.addEventListener('resize', () => {
    generarIndicadores();
    actualizarBotones();
    
    // Resetear posición al cambiar el tamaño de la ventana
    posicionActual = 0;
    carrusel.style.transform = 'translateX(0)';
    actualizarIndicadores();
});
