<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de ingredientes</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="contenedor">
        <!-- ENCABEZADO -->
        <header class="encabezado">
            <div class="menu"><a href="../Registro de ventas/Interfaz.html" class="enlaceMenu">Registro de ventas</a></div>
            <div class="menu"><a href="" class="enlaceMenu">Inventario</a></div>
            <div class="menu"><a href="../Arqueo de caja/interfaz.html" class="enlaceMenu">Arqueo de caja</a></div>
             <!-- Contenedor para la campana y el contador -->
            <div id="campana-alerta">
                <img src="img/IconoAlerta.svg" class="ImgAlerta">
                <span id="contador-alertas">0</span>
            </div>
            <img src="img/Logo.png" class="ImgLogo">
        </header>

        <!-- CONTENIDO -->
        <section class="contenido">
            <div class="FuncionesInventario">
                <div class="botonesIngresosSalidas">
                    <!-- Boton de inventario -->
                    <div>
                        <button class="botonInventario" id="botonInventario">Inventario</button>
                    </div>
                    <!-- Boton de ingresos -->
                    <div>
                        <button class="botonIngresos" id="botonIngresos">Ingresos</button>
                    </div>
                    <!-- Boton de salidas -->
                    <div>
                        <button class="botonSalidas">Salidas</button>
                    </div>
                </div>
                <!-- Buscador -->
                <div class="BusquedaProducto">
                    <input type="search" id="buscador" class="InputBusqueda" placeholder="Ingrese palabra ...">
                    <img src="img/IconoBusqueda.svg" class="ImgBusqueda">
                </div>   
            </div>

            <!-- Listado de ingredientes (esto se mostrará al cargar la página) -->
            <div id="listadoIngredientes" class="ListadoProductos">
                <table class="TablaProductos">
                    <thead>
                        <tr>
                            <th class="CeldaProductos">Nombre</th>
                            <th class="CeldaProductos">Stock Disponible</th>
                            <th class="CeldaProductos">Stock Mínimo</th>
                            <th class="CeldaProductos">Proveedor</th>
                            <th class="CeldaProductos">Última actualización</th>
                            <th class="CeldaProductos">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Los datos de ingredientes se cargarán aquí mediante AJAX -->
                    </tbody>
                </table>
            </div>

            <!-- Listado de ingresos (esto se mostrará cuando se haga clic en el botón de ingresos) -->
            <div id="listadoIngresos" class="ListadoProductos" style="display: none;">
                <table class="TablaProductos">
                    <thead>
                        <tr>
                            <th class="CeldaProductos">Cantidad</th>
                            <th class="CeldaProductos">Fecha de Ingreso</th>
                            <th class="CeldaProductos">Cliente</th>
                            <th class="CeldaProductos">Precio Venta</th>
                            <th class="CeldaProductos">Receta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Los datos de ingresos se cargarán aquí mediante AJAX -->
                    </tbody>
                </table>
            </div>

            <!-- Listado de salidas (esto se mostrará cuando se haga clic en el botón de salidas) -->
            <div id="listadoSalidas" class="ListadoProductos" style="display: none;">
                <table class="TablaProductos">
                    <thead>
                        <tr>
                            <th class="CeldaProductos">Producto</th>
                            <th class="CeldaProductos">Cantidad</th>
                            <th class="CeldaProductos">Fecha de Salida</th>
                            <th class="CeldaProductos">Costo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Los datos de salidas se cargarán aquí mediante AJAX -->
                    </tbody>
                </table>
            </div>
        </section>
    </div>

    <!-- Incluir el script -->
    <script src="js/script.js"></script>
</body>
</html>
