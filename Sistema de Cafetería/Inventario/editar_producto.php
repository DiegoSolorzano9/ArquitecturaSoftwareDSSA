<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    include('conexion.php');

    $codigo = $conn->real_escape_string($_POST["codigo"]);
    $nombre = $conn->real_escape_string($_POST["nombre"]);
    $categoria = $conn->real_escape_string($_POST["categoria"]);
    $precio = $conn->real_escape_string($_POST["precio"]);
    $stock_disponible = $conn->real_escape_string($_POST["stock_disponible"]);
    $stock_minimo = $conn->real_escape_string($_POST["stock_minimo"]);
    $proveedor = $conn->real_escape_string($_POST["proveedor"]);
    $estado = $conn->real_escape_string($_POST["estado"]);

    $sql = "UPDATE Productos 
            SET nombre='$nombre', categoria='$categoria', precio='$precio', 
                stock_disponible='$stock_disponible', stock_minimo='$stock_minimo', 
                proveedor_id=(SELECT id_proveedor FROM Proveedores WHERE nombre='$proveedor' LIMIT 1),
                estado='$estado', ultima_actualizacion=NOW() 
            WHERE codigo='$codigo'";

    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "error";
    }

    $conn->close();
} else {
    echo "invalid";
}
?>
