document.addEventListener("DOMContentLoaded", function() {
  let notificationId = 0; // Variable para asignar un ID único a cada notificación

  // Event listener para los botones "Agregar al carrito"
  document.querySelectorAll('.cta').forEach(button => {
    button.addEventListener('click', () => {
      // Obtener el contenedor del producto, asumiendo que el botón está dentro del mismo contenedor que la imagen
      const productContainer = button.closest('.circle');

      // Obtener el nombre y el precio del producto
      let productName = productContainer.querySelector('p').textContent.trim();
      const productPriceMatch = productName.match(/\$\s?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?/);
      if (productPriceMatch) {
        const productPriceText = productPriceMatch[0]; // Texto del precio con formato "$X.XXX"
        
        // Extraer el precio eliminando el signo de dólar y cualquier separador de miles
        const productPrice = parseFloat(productPriceText.replace(/\$|,/g, ''));
        
        // Remover el precio del nombre del producto
        productName = productName.replace(productPriceText, '').trim();

        // Obtener la URL de la imagen del producto
        const productImage = productContainer.querySelector('img').src;

        // Agregar el producto al carrito
        agregarAlCarrito(productName, productPrice, productImage);

        // Crear y mostrar la notificación
        const notification = document.createElement('div');
        notification.textContent = 'Agregado al carro con éxito';
        notification.classList.add('notification');
        notification.id = 'notification' + notificationId++; // Asigna un ID único a la notificación
        notification.style.transitionDelay = '0s'; // Elimina el retraso en la transición
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.classList.add('show'); // Muestra la notificación
        }, 10); // Asegura que la notificación se muestre correctamente

        setTimeout(() => {
          notification.classList.remove('show'); // Oculta la notificación después de un tiempo
          setTimeout(() => {
            notification.remove(); // Elimina la notificación del DOM después de ocultarla
          }, 2000); // Disminuye el tiempo antes de eliminar la notificación
        }, 3000); // Oculta la notificación después de 3 segundos
      }
    });
  });
});

function agregarAlCarrito(nombre, precio, imagen) {
  // Asegurar que window.carrito es un arreglo
  if (!Array.isArray(window.carrito)) {
    window.carrito = [];
  }

  // Agregar el producto al carrito con la ruta de la imagen
  window.carrito.push({ nombre, precio, imagen });

  // Guardar el carrito en localStorage
  localStorage.setItem('carrito', JSON.stringify(window.carrito));

  // Disparar un evento personalizado para notificar al carrito que se ha agregado un producto
  const event = new CustomEvent('productAddedToCart', { detail: { nombre, precio, imagen } });
  document.dispatchEvent(event);

  // Log para verificar si el producto se agregó correctamente
  console.log(`${nombre} agregado al carrito.`);
}

