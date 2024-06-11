document.addEventListener("DOMContentLoaded", function() {
  const carritoContainer = document.getElementById('carrito-container');
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const botonResumen = document.getElementById("ir-a-resumen");
  const resumen = document.getElementById('resumen');
  const formularioDelivery = document.getElementById('formulario-delivery');
  const totalPedido = document.getElementById('total-pedido');
  const subtotalElement = document.getElementById('subtotal');
  const envioElement = document.getElementById('envio');
  const totalElement = document.getElementById('total');

  resumen.style.display = "none";  // Asegurarse de que el resumen y el formulario estén ocultos inicialmente
  formularioDelivery.style.display = "none";
  totalPedido.style.display = "none";

  function actualizarCarrito() {
    while (carritoContainer.firstChild) {
      carritoContainer.removeChild(carritoContainer.firstChild);
    }
    mostrarCarrito();
    actualizarTotalPedido(); // Actualizar el subtotal después de actualizar el carrito
  }

  function mostrarCarrito() {
    if (carrito && carrito.length > 0) {
      const cantidadProductos = {};
      carrito.forEach(producto => {
        if (!producto.cantidad) {
          producto.cantidad = 1;
        }
        if (cantidadProductos[producto.nombre]) {
          cantidadProductos[producto.nombre]++;
        } else {
          cantidadProductos[producto.nombre] = producto.cantidad;
        }
      });

      botonResumen.style.display = "block";

      carritoContainer.innerHTML = '';
      const ul = document.createElement('ul');
      Object.keys(cantidadProductos).forEach(nombre => {
        const li = document.createElement('li');
        const producto = carrito.find(producto => producto.nombre === nombre);

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = nombre;
        li.appendChild(img);

        const precioTotal = producto.precio * cantidadProductos[nombre];

        const contenidoLi = document.createElement('span');
        contenidoLi.textContent = `${nombre} $${precioTotal.toFixed(3)} x${cantidadProductos[nombre]}`;
        li.appendChild(contenidoLi);

        const botonAumentar = document.createElement('button');
        botonAumentar.textContent = '+';
        botonAumentar.addEventListener('click', function() {
          producto.cantidad++;
          cantidadProductos[nombre] = producto.cantidad; // Actualizar la cantidad en el objeto del carrito
          const nuevoPrecioTotal = producto.precio * cantidadProductos[nombre];
          contenidoLi.textContent = `${nombre} $${nuevoPrecioTotal.toFixed(3)} x${cantidadProductos[nombre]}`;
          botonReducir.disabled = false;
          guardarCarrito();
          actualizarTotalPedido(); // Actualizar el subtotal después de aumentar la cantidad
        });
        li.appendChild(botonAumentar);

        const botonReducir = document.createElement('button');
        botonReducir.textContent = '-';
        botonReducir.disabled = cantidadProductos[nombre] === 1;
        botonReducir.addEventListener('click', function() {
          if (cantidadProductos[nombre] > 1) {
            producto.cantidad--;
            cantidadProductos[nombre] = producto.cantidad; // Reducir la cantidad en el objeto del carrito
            const nuevoPrecioTotal = producto.precio * cantidadProductos[nombre];
            contenidoLi.textContent = `${nombre} $${nuevoPrecioTotal.toFixed(3)} x${cantidadProductos[nombre]}`;
            if (cantidadProductos[nombre] === 1) {
              botonReducir.disabled = true;
            }
            guardarCarrito();
            actualizarTotalPedido(); // Actualizar el subtotal después de reducir la cantidad
          }
        });

        li.appendChild(botonReducir);

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'X';
        botonEliminar.addEventListener('click', function() {
          carrito = carrito.filter(producto => producto.nombre !== nombre);
          actualizarCarrito();
          guardarCarrito();
        });
        li.appendChild(botonEliminar);

        ul.appendChild(li);
      });

      carritoContainer.appendChild(ul);
    } else {
      const mensaje = document.createElement('p');
      mensaje.textContent = 'El carrito está vacío.';
      carritoContainer.appendChild(mensaje);

      botonResumen.style.display = "none";
      resumen.style.display = "none";
      formularioDelivery.style.display = "none";
      totalPedido.style.display = "none"; // Ocultar también el total del pedido cuando el carrito está vacío
    }
  }

  function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.nombre === producto.nombre);
    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      producto.cantidad = 1; // Inicializa la cantidad si es un nuevo producto
      carrito.push(producto);
    }
    guardarCarrito();
    actualizarCarrito();
  }

  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function actualizarTotalPedido() {
    const subtotal = calcularSubtotal();
    const envio = calcularEnvio();
    const total = subtotal + envio;

    if (subtotalElement) {
      if (carrito.length > 0) {
        subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(3)}`;
        subtotalElement.style.display = 'block';
      } else {
        subtotalElement.style.display = 'none';
      }
    }

    if (envioElement) {
      if (carrito.length > 0 && envio > 0) {
        envioElement.textContent = `Envío: $${envio.toFixed(3)}`;
        envioElement.style.display = 'block';
      } else {
        envioElement.style.display = 'none';
      }
    }

    if (totalElement) {
      if (carrito.length > 0) {
        totalElement.textContent = `Total: $${total.toFixed(3)}`;
        totalElement.style.display = 'block';
      } else {
        totalElement.style.display = 'none';
      }
    }
  }

  function calcularSubtotal() {
    let subtotal = 0;
    carrito.forEach(producto => {
      // Asegúrate de que producto.precio es un número y producto.cantidad está definido
      subtotal += producto.precio * (producto.cantidad || 1);
    });
    return subtotal;
  }

  function calcularEnvio() {
    const comunaSelect = document.getElementById('comuna');
    const comuna = comunaSelect ? comunaSelect.value : '';
    let costoEnvio = 0;

    switch (comuna) {
      case 'Lo Barnechea':
        costoEnvio = 1.500;
        break;
      case 'Las Condes':
      case 'Vitacura':
        costoEnvio = 2.500;
        break;
      default:
        costoEnvio = 0;
    }

    return costoEnvio;
  }

  mostrarCarrito();

  botonResumen.addEventListener("click", function() {
    if (carrito && carrito.length > 0) {
      resumen.style.display = "block";
      formularioDelivery.style.display = "block";
      totalPedido.style.display = "block"; // Asegúrate de que esto se muestra

      actualizarTotalPedido(); // Asegúrate de recalcular y mostrar el total actualizado aquí

      const yOffset = resumen.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    }
  });

  const nombreInput = formularioDelivery.querySelector('[name="nombre"]');
  nombreInput.addEventListener('input', function(event) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').substring(0, 30);
  });

  const celularInput = formularioDelivery.querySelector('[name="numero-celular"]');
  celularInput.value = '+56'; // Inicializa con +56 para asegurar que esté presente
  celularInput.addEventListener('input', function(event) {
    let valorActual = event.target.value;
    let valorLimpio = valorActual.replace(/[^0-9]/g, '');
    if (!valorLimpio.startsWith('56')) {
      valorLimpio = '56' + valorLimpio;
    }
    if (valorLimpio.length > 11) {
      valorLimpio = valorLimpio.substring(0, 11);
    }
    event.target.value = '+' + valorLimpio;
  });

  const calleInput = formularioDelivery.querySelector('[name="calle"]');
  calleInput.addEventListener('input', function(event) {
    const inputValue = event.target.value;
    // Permitir solo letras, espacios y el carácter especial ´
    event.target.value = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ´]/g, '').substring(0, 30);
  });

  const numeroInput = formularioDelivery.querySelector('[name="numero"]');
  numeroInput.addEventListener('input', function(event) {
    const inputValue = event.target.value;
    // Permitir solo números y limitar a 15 caracteres
    event.target.value = inputValue.replace(/[^0-9]/g, '').substring(0, 15);
  });

  const deptoInput = formularioDelivery.querySelector('[name="depto"]');
  deptoInput.addEventListener('input', function(event) {
    const inputValue = event.target.value;
    // Permitir solo letras y números y limitar a 15 caracteres
    event.target.value = inputValue.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);
  });

  const comunaSelect = document.getElementById('comuna');
  comunaSelect.addEventListener('change', function() {
    // Bloquea la opción inicial una vez que se selecciona una comuna válida
    if (this.value) {
      this.options[0].disabled = true;
    }
    actualizarTotalPedido(); // Actualizar el total del pedido cuando se selecciona una comuna
  });

  formularioDelivery.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const nombre = nombreInput.value.trim();
    const celular = celularInput.value.trim();
    const calle = document.getElementById('calle').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const depto = document.getElementById('depto').value.trim();
    const comuna = document.getElementById('comuna').value.trim();

    if (!nombre || !celular || !calle || !numero || !depto || !comuna) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    // Generar los detalles del pedido
    let detallesPedido = '';
    carrito.forEach(producto => {
      detallesPedido += `\n🍣 **${producto.nombre}**\n🔢 Cantidad: ${producto.cantidad}\n💲 Precio: $${(producto.precio * producto.cantidad).toFixed(3)}`;
    });

    // Calcular los totales
    const subtotal = calcularSubtotal();
    const envio = calcularEnvio();
    const total = subtotal + envio;

    // Generar el mensaje para enviar por WhatsApp
    const mensaje = `Hola, quiero realizar este pedido:\n\n${detallesPedido}\n\n**Datos del Cliente:**\n👤 Nombre: ${nombre}\n📞 Celular: ${celular}\n🏠 Dirección: ${calle} ${numero}, ${depto}, ${comuna}\n\n🚚 **Envío:**\n$${envio.toFixed(3)}\n\n💰 **Total:**\n$${total.toFixed(3)}\n\n¡Gracias!`;

    // Generar el enlace de WhatsApp con el mensaje codificado
    const enlaceWhatsapp = `https://api.whatsapp.com/send/?phone=56982809098&text=${encodeURIComponent(mensaje)}&type=phone_number&app_absent=0`;

    // Abrir el enlace de WhatsApp en una nueva pestaña
    window.open(enlaceWhatsapp, '_blank');

    // Vaciar el carrito y actualizar la vista
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
  });
});
