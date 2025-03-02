<?php
include('../conexion.php'); // Incluir la conexión a la base de datos

// Consulta para obtener las salidas junto con el nombre del producto
$sql = "SELECT 
            s.id, 
            s.cantidad, 
            s.fecha_salida, 
            s.costo, 
            i.nombre AS producto_nombre
        FROM salida s
        LEFT JOIN ingredientes i ON s.ingrediente_id = i.id"; // Hacemos JOIN con la tabla ingredientes

$resultado = $conexion->query($sql);

// Verificar si hay resultados
if ($resultado->num_rows > 0) {
    $salidas = array();
    while ($fila = $resultado->fetch_assoc()) {
        $salidas[] = $fila; // Agregar cada fila de salidas al array
    }
    // Devolver las salidas en formato JSON
    echo json_encode($salidas);
} else {
    // Si no hay salidas, devolver un array vacío
    echo json_encode([]);
}

$conexion->close(); // Cerrar la conexión
?>
