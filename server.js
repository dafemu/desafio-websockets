const express = require('express');
const { Router } = express;

//Socket.io
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

//cargo el modulo handlebars
const handlebars = require("express-handlebars");

//instancia
const app = express();
const router = Router();

//socket.io
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//espacio publico del servidor
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//requires propios
const modController = require('./controller');

//establecemoos la configuracion de handlebars
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials"
    })
);

//establecemos el motor de platilla que se utiliza
app.set("view engine", "hbs");

//establecemos el directorio donde se encuentran los archivos de platilla
app.set("views", "./views");

//socket.io etablecemos comunicacion
io.on('connection', (socket) => {
    console.log('un cliente se ha conectado');
    socket.emit('productos', modController.getProductos());
});

//rutas y metodos
router.get("/", function (req, res) {
    console. log('GET request recibido');
    const productos = modController.getProductos();
    //res.sendFile("main", { root: __dirname });
    (productos.length > 0)
    ? res.render("main", { productList: productos, productExist:true })
    : res.render("main", { productList: productos, productExist:false })
}); 

router.post("/", function (req, res) {
    console.log('POST request recibido');
    const nuevoProducto = {
        title: req.body.productoNombre,
        price: req.body.productoPrecio,
        thumbnail: req.body.productoImagen,
    };
    const newList = modController.setProducto(nuevoProducto);
    res.render("main", { productList: newList, productExist:true })
});


//configuro la ruta
app.use('/productos', router);

httpServer.listen(8080, () => console.log("SERVER ON"));