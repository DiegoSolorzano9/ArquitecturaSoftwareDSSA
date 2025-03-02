<?php
include '../conexion.php';
header('Content-Type: application/json');

$ci = isset($_GET['ci']) ? trim($_GET['ci']) : '';

if ($ci === '') {
    echo json_encode(["error" => "CI vacío"]);
    exit;
}

$stmt = $conexion->prepare("SELECT nombre FROM cliente WHERE ci = ?");
$stmt->bind_param("s", $ci);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $cliente = $result->fetch_assoc();
    echo json_encode(["nombre" => $cliente['nombre']]);
} else {
    echo json_encode(["nombre" => ""]);
}
?>
