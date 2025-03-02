<?php
include '../conexion.php';

$ci = isset($_POST['ci']) ? trim($_POST['ci']) : "";
$cliente = isset($_POST['nombre']) ? trim($_POST['nombre']) : "";
$items = json_decode($_POST['items'], true);

if (!$items || empty($cliente) || empty($ci)) {
    echo json_encode(["error" => "Datos inválidos o incompletos"]);
    exit;
}

try {
    $conexion->begin_transaction();

    // Verificar si el cliente ya existe
    $stmt = $conexion->prepare("SELECT id FROM cliente WHERE ci = ?");
    $stmt->bind_param("s", $ci);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $cliente_id = $row['id'];
    } else {
        // Insertar nuevo cliente si no existe
        $stmt_insert = $conexion->prepare("INSERT INTO cliente (nombre, ci) VALUES (?, ?)");
        $stmt_insert->bind_param("ss", $cliente, $ci);
        $stmt_insert->execute();
        $cliente_id = $conexion->insert_id;
    }

    // Insertar pedido
    $stmt_pedido = $conexion->prepare("INSERT INTO pedido (cliente_id, fecha_hora) VALUES (?, NOW())");
    $stmt_pedido->bind_param("i", $cliente_id);
    $stmt_pedido->execute();
    $id_pedido = $conexion->insert_id;

    // Insertar detalles del pedido con recetas en lugar de productos
    $stmt_detalle = $conexion->prepare("INSERT INTO detallepedido (pedido_id, receta_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)");

    foreach ($items as $item) {
        $receta_id = intval($item['id']);
        $cantidad = intval($item['cantidad']);
        $precio_unitario = floatval($item['precio_unitario']);

        // Insertar el detalle del pedido
        $stmt_detalle->bind_param("iiid", $id_pedido, $receta_id, $cantidad, $precio_unitario);
        $stmt_detalle->execute();
    }

    $conexion->commit();
    echo json_encode(["success" => "Pedido guardado con éxito", "id_pedido" => $id_pedido]);
} catch (Exception $e) {
    $conexion->rollback();
    echo json_encode(["error" => "Error en la operación: " . $e->getMessage()]);
}

$conexion->close();
?>
