<?php
include '../conexion.php';

// Consulta para obtener nombres de categorías desde la tabla receta
$sql = "SELECT DISTINCT categoria.nombre FROM categoria INNER JOIN receta ON categoria.id = receta.categoria_id";
$result = $conexion->query($sql);

$clases = array();
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $clases[] = $row['nombre'];
    }
}

// Devolver como JSON
header('Content-Type: application/json');
echo json_encode($clases);

$conexion->close();
?>
