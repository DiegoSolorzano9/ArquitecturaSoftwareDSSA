<?php
include 'connection.php';
header('Content-Type: application/json');

$ci = isset($_POST['ci']) ? trim($_POST['ci']) : "";
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : "";

// Depuración
error_log("CI recibido: " . $ci);
error_log("Nombre recibido: " . $nombre);

if ($ci === "" || $nombre === "") {
    echo json_encode(["error" => "CI o nombre vacíos"]);
    exit;
}

try {
    $stmt = $conexion->prepare("SELECT nombre FROM clientes WHERE ci = ?");
    $stmt->bind_param("s", $ci);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["success" => "Cliente encontrado: " . $row['nombre'], "nombre" => $row['nombre']]);
    } else {
        $stmt_insert = $conexion->prepare("INSERT INTO clientes (ci, nombre) VALUES (?, ?)");
        $stmt_insert->bind_param("ss", $ci, $nombre);
        if ($stmt_insert->execute()) {
            echo json_encode(["success" => "Cliente agregado correctamente", "nombre" => $nombre]);
        } else {
            echo json_encode(["error" => "No se pudo insertar el cliente"]);
        }
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

