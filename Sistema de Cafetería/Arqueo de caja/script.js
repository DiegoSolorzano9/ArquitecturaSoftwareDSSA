async function generarTabla() {
    const tbody = document.querySelector("#tablaDatos tbody");
    tbody.innerHTML = ""; // Limpiar la tabla
  
    const todosSeleccionado = document.getElementById("todos").checked;
    
    try {
        const response = await fetch('get_pedidos.php');
        const pedidos = await response.json();
        
        if (pedidos.length === 0) {
            console.log("No se encontraron pedidos");
            return;
        }
        
        let pedidosUnicos = [];
        const fechasUnicas = new Set();
        
        if (todosSeleccionado) {
            pedidos.forEach(dato => {
                if (!fechasUnicas.has(dato.fecha)) {
                    fechasUnicas.add(dato.fecha);
                    pedidosUnicos.push(dato);
                }
            });
        } else {
            const fechaInicio = document.getElementById("fechaInicio").value;
            const fechaFin = document.getElementById("fechaFin").value;
            pedidos.forEach(dato => {
                if (dato.fecha >= fechaInicio && dato.fecha <= fechaFin && !fechasUnicas.has(dato.fecha)) {
                    fechasUnicas.add(dato.fecha);
                    pedidosUnicos.push(dato);
                }
            });
        }
        
        for (const dato of pedidosUnicos) {
            const fila = document.createElement("tr");
    
            const celdaFecha = document.createElement("td");
            celdaFecha.textContent = dato.fecha;
            fila.appendChild(celdaFecha);
    
            const celdaCaja = document.createElement("td");
            celdaCaja.textContent = 500;
            fila.appendChild(celdaCaja);
    
            let totalIngresos = 0;
            try {
                const respIngresos = await fetch(`get_ingresos_totales.php?fecha=${dato.fecha}`);
                const dataIngresos = await respIngresos.json();
                totalIngresos = dataIngresos.totalIngresos || 0;
            } catch (e) {
                console.error("Error al obtener los ingresos para la fecha " + dato.fecha, e);
            }
            const celdaIngresos = document.createElement("td");
            celdaIngresos.textContent = totalIngresos.toFixed(2);
            fila.appendChild(celdaIngresos);
    
            const celdaDetalles = document.createElement("td");
            const botonDetalles = document.createElement("button");
            botonDetalles.textContent = "Detalles";
            
            // ✅ PASAR LA FECHA CORRECTAMENTE AL HACER CLIC EN EL BOTÓN
            botonDetalles.addEventListener("click", () => {
                window.location.href = `detalle.html?fecha=${encodeURIComponent(dato.fecha)}`;
            });

            celdaDetalles.appendChild(botonDetalles);
            fila.appendChild(celdaDetalles);
    
            tbody.appendChild(fila);
        }
        
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("botonBuscar").addEventListener("click", generarTabla);
});


document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos los radios y el contenedor de fechas
  const radioTodos = document.getElementById("todos");
  const radioRango = document.getElementById("rango");
  const seleccionFechas = document.getElementById("seleccionFechas");

  // Función para mostrar u ocultar las fechas
  function actualizarFechas() {
    if (radioRango.checked) {
      seleccionFechas.style.display = "block"; // Mostrar fechas
    } else {
      seleccionFechas.style.display = "none"; // Ocultar fechas
    }
  }
    // Escuchar cambios en los radio buttons
    radioTodos.addEventListener("change", actualizarFechas);
    radioRango.addEventListener("change", actualizarFechas);
  
    // Inicializar el estado según el radio por defecto
    actualizarFechas();
  });



  







