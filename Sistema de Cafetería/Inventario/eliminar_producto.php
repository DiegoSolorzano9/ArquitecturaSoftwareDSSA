<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["codigo"])) {
    include('conexion.php');

    $codigo = $conn->real_escape_string($_POST["codigo"]);

    $sql = "DELETE FROM Productos WHERE codigo = '$codigo'";
    if ($conn->query($sql) === TRUE) {
        echo "success"; // Respuesta para JavaScript
    } else {
        echo "error";
    }

    $conn->close();
} else {
    echo "invalid";
}
?>
