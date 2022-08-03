const socket = io();

socket.on('productos', data => {
    console.log("data cleinte: ",data);
});

fetch('http://localhost:8080/productos')
.then(response => response.json())
.then(data => console.log(data));