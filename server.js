const express = require('express');

//Socket.io
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

// //cargo el modulo handlebars
const Handlebars = require("handlebars");

//instancia
const app = express();

//socket.io
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//espacio publico del servidor
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//establecemos el motor de platilla que se utiliza
app.set("view engine", "hbs");

let productos = [];
let mensajes = [];

function setProducto(objProducto) {
    console.log("entro al setproduct");
    if(productos.length == 0){
        objProducto.id = 1;
    }else{
        let id = productos[productos.length-1].id
        objProducto.id = id + 1;
    }
    productos.push(objProducto);
    return productos;
}

//socket.io etablecemos comunicacion
io.on('connection', (socket) => {
    console.log('un cliente se ha conectado');
    socket.emit('productos', productos);
    socket.emit('mensajes', mensajes);

    socket.on('nuevo-producto', data => {
        console.log('servidor productos');
        setProducto(data)
        io.sockets.emit('productos', productos);
    });

    socket.on('nuevo-mensaje', data => {
        console.log('servidor mensajes');

        mensajes.push(data);
        io.sockets.emit('mensajes', mensajes);
    });
});

httpServer.listen(8080, () => {
    console.log("Server on port 8080");
});