<?php
include('../conexion.php'); // Incluir la conexión a la base de datos

// Consulta para obtener los ingredientes
$sql = "SELECT i.id, i.nombre, i.stock_disponible, i.stock_minimo, pr.nombre AS proveedor, 
                i.ultima_actualizacion, i.estado 
        FROM ingredientes i
        JOIN proveedor pr ON i.proveedor_id = pr.id";

$resultado = $conexion->query($sql);

// Verificar si hay resultados
if ($resultado->num_rows > 0) {
    $ingredientes = array();
    while ($fila = $resultado->fetch_assoc()) {
        $ingredientes[] = $fila; // Agregar cada fila de ingrediente al array
    }
    // Devolver los ingredientes en formato JSON
    echo json_encode($ingredientes);
} else {
    // Si no hay ingredientes, devolver un array vacío
    echo json_encode([]);
}

$conexion->close(); // Cerrar la conexión
?>
