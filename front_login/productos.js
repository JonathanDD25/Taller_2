// productos.js
const API_URL = "http://localhost:3000/api";

// Elementos del DOM
const form = document.getElementById("formPersona");
const contenedor = document.getElementById("contenedorCards");
const templateCard = document.getElementById("templateCard").content;
const btnCancelar = document.getElementById("btnCancelar");
const inputImagen = document.getElementById("imagen");
const previewImagen = document.getElementById("previewImagen");

document.addEventListener("DOMContentLoaded", () => {
    verificarSesion();
    cargarProductos();
});

// Vista previa de imagen
inputImagen.addEventListener("change", () => {
    const file = inputImagen.files[0];
    if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImagen.src = e.target.result;
        previewImagen.style.display = "block";
    };
    reader.readAsDataURL(file);
    }
});

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

async function verificarSesion() {
    const token = localStorage.getItem("token");
    if (!token) {
    cerrarSesion();
    return;
    }

    try {
    const response = await fetch(`${API_URL}/verify`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Token inválido");
    } catch (error) {
    console.error("Sesión inválida:", error);
    cerrarSesion();
    }
}

// Cargar productos
async function cargarProductos() {
    try {
    const response = await fetch(`${API_URL}/productos`);
    const productos = await response.json();
    mostrarProductos(productos);
    } catch (error) {
    console.error("Error al cargar productos:", error);
    }
}

function mostrarProductos(productos) {
    contenedor.innerHTML = "";
    const fragment = document.createDocumentFragment();

    productos.forEach(producto => {
    const clone = templateCard.cloneNode(true);

    clone.querySelector(".nombre-productos").textContent = producto.nombre;
    clone.querySelector(".descripcion-productos").textContent = producto.descripcion;
    clone.querySelector(".stock-productos").textContent = `Stock: ${producto.stock}`;

    const imagen = clone.querySelector(".imagen-productos");
    if (producto.imagen) {
        imagen.src = `${API_URL}/imagenes/${producto.imagen}`;
        imagen.style.display = "block";
    }

    clone.querySelector(".btn-editar").addEventListener("click", () => editarProducto(producto));
    clone.querySelector(".btn-eliminar").addEventListener("click", () => eliminarProducto(producto.id));

    fragment.appendChild(clone);
    });

    contenedor.appendChild(fragment);
}

// Guardar producto
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const producto = {
    id: document.getElementById("id_producto").value,
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    categorias: document.getElementById("categorias").value,
    entradas: parseInt(document.getElementById("entradas").value),
    salidas: parseInt(document.getElementById("salidas").value),
    stock: parseInt(document.getElementById("stock").value),
    precio: parseFloat(document.getElementById("precio").value),
    };

    try {
    let response;
    if (producto.id) {
        response = await actualizarProducto(producto);
    } else {
        response = await crearProducto(producto);
    }

    if (inputImagen.files.length > 0) {
        await subirImagen(response.id, inputImagen.files[0]);
    }

    limpiarFormulario();
    cargarProductos();
    } catch (error) {
    console.error("Error al guardar producto:", error);
    }
});

async function crearProducto(producto) {
    const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
    });
    return await response.json();
}

async function actualizarProducto(producto) {
    const response = await fetch(`${API_URL}/productos/${producto.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
    });
    return await response.json();
}

async function eliminarProducto(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
    await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
    cargarProductos();
    } catch (error) {
    console.error("Error al eliminar producto:", error);
    }
}

function editarProducto(producto) {
    document.getElementById("id_producto").value = producto.id;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("categorias").value = producto.categorias;
    document.getElementById("entradas").value = producto.entradas;
    document.getElementById("salidas").value = producto.salidas;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("precio").value = producto.precio;

    if (producto.imagen) {
    previewImagen.src = `${API_URL}/imagenes/${producto.imagen}`;
    previewImagen.style.display = "block";
    } else {
    previewImagen.style.display = "none";
    }
}

async function subirImagen(id, file) {
    const formData = new FormData();
    formData.append("imagen", file);

    try {
    await fetch(`${API_URL}/productos/${id}/imagen`, {
        method: "POST",
        body: formData
    });
    } catch (error) {
    console.error("Error al subir imagen:", error);
    }
}

function limpiarFormulario() {
    form.reset();
    document.getElementById("id_producto").value = "";
    previewImagen.src = "";
    previewImagen.style.display = "none";
}

// Cerrar sesión botón
const btnLogout = document.createElement("button");
btnLogout.textContent = "Cerrar Sesión";
btnLogout.addEventListener("click", cerrarSesion);
document.body.insertBefore(btnLogout, document.body.firstChild);