<?php
include 'connection.php';

// Consulta para obtener clases únicas
$sql = "SELECT DISTINCT clase FROM productos";
$result = $conexion->query($sql);

$clases = array();
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $clases[] = $row['clase'];
    }
}

header('Content-Type: application/json');
echo json_encode($clases);

$conexion->close();
?>
