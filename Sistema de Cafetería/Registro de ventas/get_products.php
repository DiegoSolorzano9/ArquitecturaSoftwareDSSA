<?php
include '../conexion.php';

// Consulta para obtener recetas junto con la categoría
$sql = "SELECT r.id, r.nombre, r.precio, c.nombre as categoria, r.imagen
        FROM receta r
        INNER JOIN categoria c ON r.categoria_id = c.id";

$result = $conexion->query($sql);

$recetas = array();
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $recetas[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($recetas);

$conexion->close();
?>
