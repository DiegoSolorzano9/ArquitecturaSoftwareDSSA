<?php
$host = "localhost";
$usuario = "root";
$bd = "cafeteria_test";

// Conexión sin imprimir mensajes
$conexion = new mysqli($host, $usuario, "", $bd);

if ($conexion->connect_error) {
    die("Error en la conexión: " . $conexion->connect_error);
}
?>
