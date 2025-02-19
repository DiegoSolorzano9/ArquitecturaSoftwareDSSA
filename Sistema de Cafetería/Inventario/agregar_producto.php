<?php
// Incluimos el archivo de conexión con la base de datos
include('conexion.php');

// Recibimos los datos del formulario
$codigo = $_POST['codigo'];
$nombre = $_POST['nombre'];
$categoria = $_POST['categoria'];
$precio = $_POST['precio'];
$stock_disponible = $_POST['stock_disponible'];
$stock_minimo = $_POST['stock_minimo'];
$proveedor_id = $_POST['proveedor']; 
$estado = $_POST['estado'];


// Insertamos el nuevo producto en la base de datos
$sql = "INSERT INTO Productos (codigo, nombre, categoria, precio, stock_disponible, stock_minimo, proveedor_id, estado)
        VALUES ('$codigo', '$nombre', '$categoria', '$precio', '$stock_disponible', '$stock_minimo', '$proveedor_id', '$estado')";

if ($conn->query($sql) === TRUE) {
    echo "Producto agregado correctamente";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Cerrar la conexión
$conn->close();

// Redirigir de vuelta a la página principal
header("Location: interfaz.php");
?>
