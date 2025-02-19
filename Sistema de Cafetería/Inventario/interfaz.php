<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de ventas</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="contenedor">
        <!----------------------------------- ENCABEZADO -------------------------------------------------->
        <header class="encabezado">
            <div class="menu"><a href="../Registro de ventas/Interfaz.html" class="enlaceMenu">Registro de ventas</a></div>
            <div class="menu"><a href="" class="enlaceMenu">Inventario</a></div>
            <img src="img/Logo.png" class="ImgLogo">
        </header>

        <!----------------------------------- CONTENIDO -------------------------------------------------->
        <section class="contenido">
            <!-- Buscador y boton adicionar -->
            <div class="FuncionesInventario">
                <!-- Boton adicionar -->
                <div class="BtnAdicionar">
                    <button onclick="abrirModal()">Adicionar Producto</button>
                </div>
                <!-- Buscador -->
                <div class="BusquedaProducto">
                    <input type="search" id="buscador" class="InputBusqueda" placeholder="Ingrese Producto ...">
                    <img src="img/IconoBusqueda.svg" class="ImgBusqueda">
                </div>                
             
            </div>

            <!-- Listado de productos -->
            <div class="ListadoProductos">
                <table class="TablaProductos">
                        <thead>
                            <tr>
                                <th class="CeldaProductos">Código</th>
                                <th class="CeldaProductos">Nombre</th>
                                <th class="CeldaProductos">Categoría</th>
                                <th class="CeldaProductos">Precio</th>
                                <th class="CeldaProductos">Stock Disponible</th>
                                <th class="CeldaProductos">Stock Mínimo</th>
                                <th class="CeldaProductos">Proveedor</th>
                                <th class="CeldaProductos">Última actualización</th>
                                <th class="CeldaProductos">Estado</th>
                                <th class="CeldaProductos">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // Incluimos el archivo de conexion con la base de datos
                            include('conexion.php');

                            // Consultamos los productos
                            $sql = "SELECT p.codigo, p.nombre, p.categoria, p.precio, p.stock_disponible, p.stock_minimo, 
                                    pr.nombre AS proveedor, p.ultima_actualizacion, p.estado 
                                    FROM Productos p
                                    JOIN Proveedores pr ON p.proveedor_id = pr.id_proveedor";
                            $result = $conn->query($sql);

                            // Mostrar los productos en la tabla
                            if ($result->num_rows > 0) {
                                while($row = $result->fetch_assoc()) {
                                    echo "<tr>
                                            <td>" . $row["codigo"] . "</td>
                                            <td>" . $row["nombre"] . "</td>
                                            <td>" . $row["categoria"] . "</td>
                                            <td>" . $row["precio"] . " Bs.</td>
                                            <td>" . $row["stock_disponible"] . "</td>
                                            <td>" . $row["stock_minimo"] . "</td>
                                            <td>" . $row["proveedor"] . "</td>
                                            <td>" . $row["ultima_actualizacion"] . "</td>
                                            <td>" . $row["estado"] . "</td>
                                            <td>
                                                <img src='img/IconoBasura.svg' alt='Eliminar' class='IconoEliminar'>
                                                <img src='img/IconoEditar.svg' alt='Editar' class='IconoEditar'>
                                            </td>
                                          </tr>";
                                }
                            } else {
                                echo "<tr><td colspan='10'>No hay productos disponibles</td></tr>";
                            }

                            // Cerrar la conexión
                            $conn->close();
                            ?>
                        </tbody>
                        <tfoot>
                            <tr style="background-color: #768A96; color: white;"></tr>
                        </tfoot>
                </table>
            </div>
        </section>
    </div>

    <!-- Modal para agregar productos -->
    <div id="modalAgregarProducto" class="modal">
        <div class="modal-content">
            <span class="close" onclick="cerrarModal()">&times;</span>
            <h2>Agregar Producto</h2>
            <form action="agregar_producto.php" method="POST">
                <label for="codigo">Código:</label>
                <input type="text" id="codigo" name="codigo" required><br><br>

                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required><br><br>

                <label for="categoria">Categoría:</label>
                <input type="text" id="categoria" name="categoria" required><br><br>

                <label for="precio">Precio:</label>
                <input type="number" id="precio" name="precio" required><br><br>

                <label for="stock_disponible">Stock Disponible:</label>
                <input type="number" id="stock_disponible" name="stock_disponible" required><br><br>

                <label for="stock_minimo">Stock Mínimo:</label>
                <input type="number" id="stock_minimo" name="stock_minimo" required><br><br>

                <!-- Campo Proveedor - Ahora envía el id_proveedor -->
                <label for="proveedor">Proveedor:</label>
                <select id="proveedor" name="proveedor" required>
                    <option value="">Seleccionar Proveedor</option>
                    <?php
                    // Conexión a la base de datos
                    include('conexion.php');

                    // Consultar los proveedores
                    $sql = "SELECT id_proveedor, nombre FROM Proveedores";
                    $result = $conn->query($sql);

                    // Mostrar los proveedores en el select
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo "<option value='" . $row['id_proveedor'] . "'>" . $row['nombre'] . "</option>";
                        }
                    } else {
                        echo "<option value=''>No hay proveedores</option>";
                    }

                    // Cerrar la conexión
                    $conn->close();
                    ?>
                </select><br><br>

                <label for="estado">Estado:</label>
                <select id="estado" name="estado">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select><br><br>

                <input type="submit" value="Agregar Producto">
            </form>
        </div>
    </div>


    <!-- Modal para editar productos -->
    <div id="modalEditarProducto" class="modal">
        <div class="modal-content">
            <span class="close" onclick="cerrarModal()">&times;</span>
            <h2>Editar Producto</h2>
            <form id="formEditarProducto">
                <label for="editCodigo">Código:</label>
                <input type="text" id="editCodigo" name="codigo" readonly><br><br>

                <label for="editNombre">Nombre:</label>
                <input type="text" id="editNombre" name="nombre" required><br><br>

                <label for="editCategoria">Categoría:</label>
                <input type="text" id="editCategoria" name="categoria" required><br><br>

                <label for="editPrecio">Precio:</label>
                <input type="number" id="editPrecio" name="precio" required><br><br>

                <label for="editStockDisponible">Stock Disponible:</label>
                <input type="number" id="editStockDisponible" name="stock_disponible" required><br><br>

                <label for="editStockMinimo">Stock Mínimo:</label>
                <input type="number" id="editStockMinimo" name="stock_minimo" required><br><br>

                <label for="editProveedor">Proveedor:</label>
                <input type="text" id="editProveedor" name="proveedor" required><br><br>

                <label for="editEstado">Estado:</label>
                <select id="editEstado" name="estado">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select><br><br>

                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    </div>




    <script src="script.js"></script>


</body>
</html>
