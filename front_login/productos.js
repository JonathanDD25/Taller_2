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
  const token = localStorage.getItem("Token");
  if (!token) cerrarSesion();

  try {
    const response = await fetch(`${API_URL}/auth/verificar`, {
      headers: { Authorization: `Bearer ${token}` },
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

  productos.forEach((producto) => {
    const clone = templateCard.cloneNode(true);

    clone.querySelector(".nombre-productos").textContent = producto.nombre;
    clone.querySelector(".descripcion-productos").textContent =
      producto.descripcion;
    clone.querySelector(
      ".stock-productos"
    ).textContent = `Stock: ${producto.stock}`;

    const imagen = clone.querySelector(".imagen-productos");
    if (producto.imagen) {
      // Convertir el Buffer a un Array de bytes
      const bytes = new Uint8Array(producto.imagen.data);

      // Crear un blob a partir de los bytes
      const blob = new Blob([bytes], { type: "image/jpeg" }); // Asegúrate de que el tipo MIME sea correcto (jpeg, png, etc.)

      // Crear una URL temporal del blob
      const url = URL.createObjectURL(blob);

      // Asignar la URL a la propiedad src de la imagen
      imagen.src = url;
      imagen.style.display = "block";

      // Opcional: Liberar el objeto URL cuando ya no se necesite
      // Puedes hacerlo al quitar el producto de la vista para liberar memoria
    }

    clone
      .querySelector(".btn-editar")
      .addEventListener("click", () => editarProducto(producto));
    clone
      .querySelector(".btn-eliminar")
      .addEventListener("click", () => eliminarProducto(producto.id_producto));

    fragment.appendChild(clone);
  });

  contenedor.appendChild(fragment);
}

// Guardar producto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto = {
    id_producto: document.getElementById("id_producto").value,
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    categoria: document.getElementById("categorias").value,
    entradas: parseInt(document.getElementById("entradas").value),
    salidas: parseInt(document.getElementById("salidas").value),
    stock: parseInt(document.getElementById("stock").value),
    precio: parseFloat(document.getElementById("precio").value),
  };

  try {
    let response;
    if (producto.id_producto) {
      response = await actualizarProducto(producto);

      if (inputImagen.files.length > 0) {
        await subirImagen(producto.nombre, inputImagen.files[0]);
      }

    } else {
      response = await crearProducto(producto);
    }

    if (inputImagen.files.length > 0) {
      await subirImagen(response.nombre, inputImagen.files[0]);
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
    body: JSON.stringify(producto),
  });
  return await response.json();
}

async function actualizarProducto(producto) {
  const response = await fetch(`${API_URL}/productos/${producto.nombre}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
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
  document.getElementById("id_producto").value = producto.id_producto;
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("categorias").value = producto.categoria;
  document.getElementById("entradas").value = producto.entradas;
  document.getElementById("salidas").value = producto.salidas;
  document.getElementById("stock").value = producto.stock;
  document.getElementById("precio").value = producto.precio;

  if (producto.imagen) {
    const bytes = new Uint8Array(producto.imagen.data);
    const blob = new Blob([bytes], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    previewImagen.src = url;
    previewImagen.style.display = "block";
  } else {
    previewImagen.style.display = "none";
  }
}

async function subirImagen(nombre, file) {
  const formData = new FormData();
  formData.append("imagen", file);

  try {
    const response = await fetch(`${API_URL}/imagenes/${nombre}/imagen`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
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
