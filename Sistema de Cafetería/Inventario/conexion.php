<?php
$servername = "localhost";  // Cambia esto si tu servidor está en otro lugar
$username = "root";         // Tu usuario de MySQL
$password = "";             // Tu contraseña de MySQL
$dbname = "bd_cafeteria";      // El nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
