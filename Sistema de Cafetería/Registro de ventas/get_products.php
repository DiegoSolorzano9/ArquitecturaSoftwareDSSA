<?php
include 'connection.php';

// Consulta para obtener los productos junto con la columna "clase"
$sql = "SELECT id, nombre, precio, imagen, clase FROM productos";
$result = $conexion->query($sql);

$productos = array();
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($productos);

$conexion->close();
?>
