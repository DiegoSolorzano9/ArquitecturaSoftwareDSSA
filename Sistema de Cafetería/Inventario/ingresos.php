<?php
include('../conexion.php'); // Incluir la conexión a la base de datos

// Consulta para obtener los ingresos con los nombres de pedido, cliente y receta
$sql = "SELECT 
            i.id, 
            i.cantidad, 
            i.fecha_ingreso, 
            p.id AS pedido_id, 
            c.nombre AS cliente_nombre, 
            i.precio_venta, 
            r.nombre AS receta_nombre
        FROM ingreso i
        LEFT JOIN pedido p ON i.pedido_id = p.id
        LEFT JOIN cliente c ON p.cliente_id = c.id
        LEFT JOIN receta r ON i.receta_id = r.id";

$resultado = $conexion->query($sql);

// Verificar si hay resultados
if ($resultado->num_rows > 0) {
    $ingresos = array();
    while ($fila = $resultado->fetch_assoc()) {
        // Asegúrate de que todos los campos tengan valores, incluso si son null
        $fila['cantidad'] = $fila['cantidad'] ?? null;
        $fila['fecha_ingreso'] = $fila['fecha_ingreso'] ?? null;
        $fila['cliente_nombre'] = $fila['cliente_nombre'] ?? null;
        $fila['precio_venta'] = $fila['precio_venta'] ?? null;
        $fila['receta_nombre'] = $fila['receta_nombre'] ?? null;

        $ingresos[] = $fila; // Agregar cada fila de ingresos al array
    }
    // Devolver los ingresos en formato JSON
    echo json_encode($ingresos);
} else {
    // Si no hay ingresos, devolver un array vacío
    echo json_encode([]);
}

$conexion->close(); // Cerrar la conexión
?>