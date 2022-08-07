const socket = io();

const productoNombre = document.getElementById('productoNombre');
const productoPrecio = document.getElementById('productoPrecio');
const productoImagen = document.getElementById('productoImagen');
const formulario = document.getElementById('formulario');
const tablaProductos = document.getElementById('tableProductos');

formulario.addEventListener('submit', function(e){
    e.preventDefault();
    console.log("productoNombre: ", productoNombre.value);
    console.log("productoPrecio: ", productoPrecio.value);
    console.log("productoImagen: ", productoImagen.value);

    const producto = {
        title: productoNombre.value,
        price: productoPrecio.value,
        thumbnail: productoImagen.value,
    }

    socket.emit('nuevo-producto', producto);
    resetearFormulario();
});

function resetearFormulario(){
    formulario.reset();
}

socket.on('productos', data => {
    console.log("data cliente productos: ",data);
    renderProductos(data);
});

socket.on('mensajes', data => {
    console.log("data cliente mensaje: ",data);
    renderMensajes(data);
});

function renderMensajes(data){
    const html = data.map((elem, index) => {
        return (
            `<div>
                <strong class='text-primary'>${elem.author}</strong>
                <time class='text-muted'>${elem.date}</time>
                : <em>${elem.text}</em>
            </div>`
        )
    }).join(" ");
    const div = document.getElementById('mensajes');
    div.innerHTML = html;
}

function renderProductos(data){
    console.log("entra al render producto");
    const conProducto = `
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Imagen</th>
        </tr>
    </thead>
    `;
    const sinProducto = `
    <div class="alert alert-warning" role="alert">
        No se encontraron productos
    </div>
    `;

    const productoHTML = data.map((prod, index) => {
        return (`
            <tbody>
                <tr>
                    <td>${prod.title}</td>
                    <td>${prod.price}</td>
                    <td>
                        <img src="${prod.thumbnail}" class="img-thumbnail" alt="${prod.title}">
                    </td>
                </tr>
            </tbody>
        `)
    }).join(" ");

    if(data.length > 0){
        tablaProductos.innerHTML = conProducto + productoHTML;

    }else{
        tablaProductos.innerHTML = sinProducto;
    }
}

function addMessage(e){
    console.log("add  message");
    const mensaje = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value,
        date: new Date(),
    };
    socket.emit('nuevo-mensaje', mensaje);

    return false;
}