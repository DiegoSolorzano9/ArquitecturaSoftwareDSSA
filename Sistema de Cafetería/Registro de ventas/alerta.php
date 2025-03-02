<?php
$host = "localhost";
$usuario = "root";
$bd = "cafeteriadb";

$conexion = new mysqli($host, $usuario, "", $bd);

if ($conexion->connect_error) {
    die("Error en la conexión: " . $conexion->connect_error);
}

$query = "SELECT id, nombre, stock_disponible FROM ingredientes WHERE stock_disponible <= stock_minimo";
$resultado = $conexion->query($query);

$alertas = [];

if ($resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $alertas[] = [
            'id' => $fila['id'],
            'nombre' => $fila['nombre'],
            'stock_disponible' => $fila['stock_disponible']
        ];
    }
}

$conexion->close();

echo json_encode($alertas);
?>
