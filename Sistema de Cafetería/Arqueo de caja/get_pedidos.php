<?php
// Incluir el archivo de conexión
include('connection.php');

// Consulta SQL para obtener los pedidos
$sql = "SELECT id, fecha_hora FROM pedidos";
$result = $conexion->query($sql);

$pedidos = [];

if ($result->num_rows > 0) {
    // Recuperar cada fila de la consulta
    while ($row = $result->fetch_assoc()) {
        // Separar fecha y hora
        $fechaHora = $row['fecha_hora'];
        $fecha = substr($fechaHora, 0, 10); // Extraer la fecha
        $hora = substr($fechaHora, 11); // Extraer la hora

        // Almacenar los resultados
        $pedidos[] = [
            'id' => $row['id'],
            'fecha' => $fecha,
            'hora' => $hora
        ];
    }
} else {
    // Enviar una respuesta vacía si no hay resultados
    echo json_encode([]);
    exit();
}

// Devolver los resultados como JSON
header('Content-Type: application/json');
echo json_encode($pedidos);

// Cerrar la conexión
$conexion->close();
?>
