<?php
// Incluir el archivo de conexión
include('connection.php');

// Obtener la fecha desde la solicitud GET
$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';

// Verificar si la fecha fue proporcionada
if ($fecha != '') {
    // Consulta para obtener los pedidos de la fecha especificada
    $sql = "SELECT p.id FROM pedidos p WHERE DATE(p.fecha_hora) = '$fecha'";
    $result = $conexion->query($sql);

    $totalIngresos = 0;

    if ($result->num_rows > 0) {
        // Recuperar cada pedido y calcular el total
        while ($row = $result->fetch_assoc()) {
            $pedidoId = $row['id'];

            // Consulta para obtener los detalles de cada pedido
            $sqlDetalles = "SELECT cantidad, precio_unitario FROM detalle_pedido WHERE pedido_id = $pedidoId";
            $resultDetalles = $conexion->query($sqlDetalles);

            if ($resultDetalles->num_rows > 0) {
                // Calcular el total para este pedido
                while ($detalle = $resultDetalles->fetch_assoc()) {
                    $totalIngresos += $detalle['cantidad'] * $detalle['precio_unitario'];
                }
            }
        }

        // Devolver el total como JSON
        echo json_encode(['totalIngresos' => $totalIngresos]);
    } else {
        echo json_encode(['totalIngresos' => 0]);
    }
} else {
    echo json_encode(['totalIngresos' => 0]);
}

// Cerrar la conexión
$conexion->close();
?>
