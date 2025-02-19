// Funciones para abrir y cerrar el modal
function abrirModal() {
    document.getElementById('modalAgregarProducto').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modalAgregarProducto').style.display = 'none';
    document.getElementById('modalEditarProducto').style.display = 'none';
}

// Buscador por nombre de producto
document.addEventListener("DOMContentLoaded", function () {
const buscador = document.getElementById("buscador");
const filas = document.querySelectorAll(".TablaProductos tbody tr");

if (buscador) {
    buscador.addEventListener("input", function () {
        const textoBusqueda = buscador.value.trim().toLowerCase(); // Elimina espacios extra
        filas.forEach(fila => {
            const nombreProducto = fila.children[1]?.textContent.toLowerCase(); // Evita errores si no hay datos
            fila.style.display = nombreProducto.includes(textoBusqueda) ? "" : "none";
        });
    });
}
});

// Funcion para eliminar producto
document.addEventListener("DOMContentLoaded", function () {
    const botonesEliminar = document.querySelectorAll(".IconoEliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", function () {
            const fila = this.closest("tr"); // Encuentra la fila del producto
            const codigo = fila.children[0].textContent.trim(); // Obtiene el código del producto

            if (confirm(`¿Estás seguro de eliminar el producto con código ${codigo}?`)) {
                fetch("eliminar_producto.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `codigo=${codigo}`
                })
                .then(response => response.text())
                .then(data => {
                    if (data === "success") {
                        fila.remove(); // Elimina la fila de la tabla
                        alert("Producto eliminado exitosamente.");
                    } else {
                        alert("Error al eliminar el producto.");
                    }
                })
                .catch(error => console.error("Error:", error));
            }
        });
    });
});



// Funcion para editar producto
document.addEventListener("DOMContentLoaded", function () {
    const botonesEditar = document.querySelectorAll(".IconoEditar");
    const modalEditar = document.getElementById("modalEditarProducto");
    const formEditar = document.getElementById("formEditarProducto");

    botonesEditar.forEach(boton => {
        boton.addEventListener("click", function () {
            const fila = this.closest("tr");
            document.getElementById("editCodigo").value = fila.children[0].textContent.trim();
            document.getElementById("editNombre").value = fila.children[1].textContent.trim();
            document.getElementById("editCategoria").value = fila.children[2].textContent.trim();
            document.getElementById("editPrecio").value = fila.children[3].textContent.trim().replace(" Bs.", "");
            document.getElementById("editStockDisponible").value = fila.children[4].textContent.trim();
            document.getElementById("editStockMinimo").value = fila.children[5].textContent.trim();
            document.getElementById("editProveedor").value = fila.children[6].textContent.trim();
            document.getElementById("editEstado").value = fila.children[8].textContent.trim();

            modalEditar.style.display = "block";
        });
    });

    document.querySelector(".close").addEventListener("click", function () {
        modalEditar.style.display = "none";
    });

    formEditar.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(formEditar);

        fetch("editar_producto.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data === "success") {
                alert("Producto actualizado correctamente.");
                location.reload();
            } else {
                alert("Error al actualizar el producto.");
            }
        })
        .catch(error => console.error("Error:", error));

        modalEditar.style.display = "none";
    });
});


// Alerta de stock mínimo
document.addEventListener("DOMContentLoaded", function () {
    const filas = document.querySelectorAll(".TablaProductos tbody tr");

    filas.forEach(fila => {
        const stockDisponible = parseInt(fila.children[4].textContent.trim());
        const stockMinimo = parseInt(fila.children[5].textContent.trim());

        if (stockDisponible === stockMinimo) {
            fila.style.backgroundColor = "#f28080";
            fila.style.color = "white"; // Para mejorar la visibilidad del texto
        }
    });
});






