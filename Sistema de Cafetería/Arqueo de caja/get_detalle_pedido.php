<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
require 'connection.php';

// Verificamos si el parámetro 'fecha' está presente en la URL
if (!isset($_GET['fecha'])) {
    echo json_encode(["error" => "Falta el parámetro de fecha"]);
    exit;
}

// Extraemos solo la parte de la fecha en formato YYYY-MM-DD
$fecha = date('Y-m-d', strtotime($_GET['fecha'])); // Esto asegura que solo tengamos la parte de la fecha

// Verificar si la conexión es válida
if (!$conexion) {
    echo json_encode(["error" => "Error en la conexión a la base de datos"]);
    exit;
}

// Obtener los pedidos de la fecha dada
$sql_pedidos = "SELECT id, fecha_hora FROM pedidos WHERE DATE(fecha_hora) = ?";
$stmt_pedidos = $conexion->prepare($sql_pedidos);
if (!$stmt_pedidos) {
    echo json_encode(["error" => "Error en la consulta de pedidos: " . $conexion->error]);
    exit;
}

$stmt_pedidos->bind_param("s", $fecha);
$stmt_pedidos->execute();
$result_pedidos = $stmt_pedidos->get_result();

$detalles = [];
while ($pedido = $result_pedidos->fetch_assoc()) {
    $pedido_id = $pedido['id'];
    $fecha_hora = $pedido['fecha_hora'];

    // Obtener detalles del pedido
    $sql_detalle = "SELECT producto, cantidad, precio_unitario, (cantidad * precio_unitario) AS precio_total 
                    FROM detalle_pedido WHERE pedido_id = ?";
    $stmt_detalle = $conexion->prepare($sql_detalle);
    if (!$stmt_detalle) {
        echo json_encode(["error" => "Error en la consulta de detalles: " . $conexion->error]);
        exit;
    }

    $stmt_detalle->bind_param("i", $pedido_id);
    $stmt_detalle->execute();
    $result_detalle = $stmt_detalle->get_result();
    
    while ($detalle = $result_detalle->fetch_assoc()) {
        $detalle['fecha_hora'] = $fecha_hora;
        $detalles[] = $detalle;
    }
    
    $stmt_detalle->close();
}

$stmt_pedidos->close();
$conexion->close();

echo json_encode(["status" => "success", "data" => $detalles]);
?>
