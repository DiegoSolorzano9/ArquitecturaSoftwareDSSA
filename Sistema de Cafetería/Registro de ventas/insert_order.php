<?php
include 'connection.php';


$cliente = trim($_POST['cliente']);
$ci = isset($_POST['ci']) ? trim($_POST['ci']) : "";
$items = json_decode($_POST['items'], true);

if (!$items) {
    echo "Error: Formato de items inválido";
    exit;
}

try {
    // Si hay CI, verificamos en la base de datos
    if ($ci !== "") {
        $stmt = $conexion->prepare("SELECT nombre FROM clientes WHERE ci = ?");
        $stmt->bind_param("s", $ci);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if ($row['nombre'] !== $cliente && $cliente !== "") {
                echo "Error: El CI ya está registrado con otro nombre.";
                exit;
            }
        } else {
            if ($cliente !== "") {
                $stmt_insert = $conexion->prepare("INSERT INTO clientes (nombre, ci) VALUES (?, ?)");
                $stmt_insert->bind_param("ss", $cliente, $ci);
                $stmt_insert->execute();
            }
        }
    }

    // Insertar pedido
    $sqlEncabezado = "INSERT INTO pedidos (cliente, fecha_hora, estado) VALUES ('$cliente', NOW(), 'pendiente')";
    $conexion->query($sqlEncabezado);
    $id_pedido = $conexion->insert_id;

    foreach ($items as $item) {
        $producto = $item['producto'];
        $cantidad = $item['cantidad'];
        $precio = $item['precio_unitario'];

        $sqlDetalle = "INSERT INTO detalle_pedido (pedido_id, producto, cantidad, precio_unitario)
                       VALUES ('$id_pedido', '$producto', '$cantidad', '$precio')";
        $conexion->query($sqlDetalle);
    }

    echo "Pedido guardado con éxito. ID: " . $id_pedido;
} catch (Exception $e) {
    echo "Error en la operación: " . $e->getMessage();
}
?>
