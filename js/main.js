document.addEventListener('DOMContentLoaded', () => {
  // Formularios de contacto
  const contactForms = document.querySelectorAll('form:not(#checkout-form):not(#review-form)');
  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const action = form.getAttribute('action');

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          console.log('Formulario de contacto enviado a Formspree');
          alert('¡Gracias por tu mensaje! El equipo de Umbrella te contactará pronto.');
          form.reset();
        } else {
          console.error('Error al enviar el formulario:', response.statusText);
          alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo.');
        }
      } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un error de red. Por favor, verifica tu conexión e intenta de nuevo.');
      }
    });
  });

  // Formulario de reseñas
  const reviewForm = document.querySelector('#review-form');
  const reviewsList = document.querySelector('#reviews-list');
  if (reviewForm && reviewsList) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = reviewForm.querySelector('#_name').value;
      const message = reviewForm.querySelector('#message').value;
      if (!name || !message) {
        const error = reviewForm.querySelector('.form-error');
        error.style.display = 'block';
        return;
      }

      // Guardar reseña en localStorage
      const review = {
        name,
        message,
        timestamp: new Date().toLocaleString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
      reviews.push(review);
      localStorage.setItem('reviews', JSON.stringify(reviews));

      // Actualizar lista de reseñas
      updateReviews();

      // Enviar a Formspree
      const formData = new FormData(reviewForm);
      try {
        const response = await fetch(reviewForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          console.log('Reseña enviada a Formspree');
          alert('¡Gracias por tu reseña! Se ha publicado correctamente.');
          reviewForm.reset();
          reviewForm.querySelector('.form-error').style.display = 'none';
        } else {
          console.error('Error al enviar la reseña:', response.statusText);
          alert('Hubo un error al enviar la reseña a Formspree. Sin embargo, tu reseña se ha guardado localmente.');
        }
      } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un error de red. Tu reseña se ha guardado localmente, pero verifica tu conexión para enviarla.');
      }
    });
  }

  // Actualizar lista de reseñas
  function updateReviews() {
    if (reviewsList) {
      let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
      reviewsList.innerHTML = '';
      if (reviews.length === 0) {
        reviewsList.innerHTML = '<p>No hay reseñas aún. ¡Sé el primero en compartir tu opinión!</p>';
      } else {
        reviews.forEach(review => {
          const reviewCard = document.createElement('div');
          reviewCard.className = 'review-card';
          reviewCard.innerHTML = `
            <h3>${review.name}</h3>
            <p>${review.message}</p>
            <p class="review-timestamp">${review.timestamp}</p>
          `;
          reviewsList.appendChild(reviewCard);
        });
      }
    }
  }

  // Formulario de finalizar compra
  const checkoutForm = document.querySelector('#checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
        alert('El carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
      }

      const cartData = {
        items: cart.map(item => ({
          title: item.title,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          subtotal: (item.price * item.quantity).toFixed(2)
        })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
      };

      const cartDataInput = document.querySelector('#cart-data');
      cartDataInput.value = JSON.stringify(cartData, null, 2);

      try {
        const response = await fetch(checkoutForm.action, {
          method: 'POST',
          body: new FormData(checkoutForm),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          console.log('Compra enviada a Formspree');
          alert('¡Compra finalizada! Recibirás un correo de confirmación pronto.');
          localStorage.removeItem('cart');
          updateCart();
        } else {
          console.error('Error al enviar la compra:', response.statusText);
          alert('Hubo un error al finalizar la compra. Por favor, intenta de nuevo.');
        }
      } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un error de red. Por favor, verifica tu conexión e intenta de nuevo.');
      }
    });
  }

  // Carrusel
  const carousel = document.querySelector('#carousel-items');
  const prevBtn = document.querySelector('#prev-btn');
  const nextBtn = document.querySelector('#next-btn');
  let currentIndex = 0;
  const totalItems = 3;
  let autoSlideInterval;

  if (carousel && prevBtn && nextBtn) {
    const images = carousel.querySelectorAll('img');
    const items = carousel.querySelectorAll('.carousel-item');

    images.forEach(img => {
      img.addEventListener('error', () => {
        console.error(`Error al cargar la imagen: ${img.src}`);
      });
      img.addEventListener('load', () => {
        console.log(`Imagen cargada correctamente: ${img.src}`);
      });
    });

    const updateCarousel = () => {
      items.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
      });
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    const handlePrev = () => {
      stopAutoSlide();
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
      setTimeout(startAutoSlide, 10000);
    };

    const handleNext = () => {
      stopAutoSlide();
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
      setTimeout(startAutoSlide, 10000);
    };

    prevBtn.addEventListener('click', handlePrev);
    nextBtn.addEventListener('click', handleNext);

    prevBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePrev();
      }
    });

    nextBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    });

    startAutoSlide();
  } else {
    console.error('Error: No se encontraron los elementos del carrusel');
  }

  // Verificar iframes
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    iframe.addEventListener('load', () => {
      console.log(`Iframe cargado correctamente: ${iframe.src}`);
    });
    iframe.addEventListener('error', () => {
      console.error(`Error al cargar el iframe: ${iframe.src}`);
    });
  });

  // Productos estáticos
  const umbrellaProducts = [
    {
      id: 1,
      title: 'Adravil',
      description: 'Analgésico avanzado para aliviar dolores intensos y fiebre.',
      price: 15.00,
      image: '../img/adravil.jpg',
      category: 'Analgésicos',
      alt: 'Caja de Adravil, analgésico de Corporación Umbrella'
    },
    {
      id: 2,
      title: 'Safsprin',
      description: 'Antiinflamatorio para reducir inflamaciones y molestias articulares.',
      price: 20.00,
      image: '../img/safsprin.jpg',
      category: 'Antiinflamatorios',
      alt: 'Caja de Safsprin, antiinflamatorio de Corporación Umbrella'
    },
    {
      id: 3,
      title: 'Aqua-Cure',
      description: 'Hidratante médico para pieles sensibles y tratamiento dermatológico.',
      price: 25.00,
      image: '../img/aqua-cure.jpg',
      category: 'Cremas',
      alt: 'Tubo de Aqua-Cure, crema hidratante de Corporación Umbrella'
    },
    {
      id: 4,
      title: 'Uspirim',
      description: 'Suplemento vitamínico para reforzar el sistema inmunológico.',
      price: 18.00,
      image: '../img/uspirim.jpg',
      category: 'Suplementos',
      alt: 'Frasco de Uspirim, suplemento vitamínico de Corporación Umbrella'
    }
  ];

  // Elementos del carrito
  const productsList = document.querySelector('#products-list');
  const cartList = document.querySelector('#cart-list');
  const cartTotalElement = document.querySelector('#cart-total');
  const clearCartBtn = document.querySelector('#clear-cart');
  const cartCountElements = document.querySelectorAll('.cart-count');

  // Añadir al carrito
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Producto "${product.title}" añadido al carrito.`);
    updateCart();
  }

  // Actualizar el carrito
  function updateCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartList) {
      cartList.innerHTML = '';
      if (cart.length === 0) {
        cartList.innerHTML = '<p>El carrito está vacío.</p>';
      } else {
        cart.forEach(product => {
          const cartItem = document.createElement('div');
          cartItem.className = 'cart-item';
          cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.alt || 'Producto en el carrito'}">
            <div class="cart-item-details">
              <h3>${product.title}</h3>
              <p>${product.category}</p>
              <p>Precio: $${product.price.toFixed(2)}</p>
              <p>Subtotal: $${(product.price * product.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
              <button class="decrease-quantity" data-id="${product.id}" aria-label="Disminuir cantidad de ${product.title}">-</button>
              <input type="number" value="${product.quantity}" min="1" data-id="${product.id}" aria-label="Cantidad de ${product.title}">
              <button class="increase-quantity" data-id="${product.id}" aria-label="Aumentar cantidad de ${product.title}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${product.id}" aria-label="Eliminar ${product.title} del carrito">Eliminar</button>
          `;
          cartList.appendChild(cartItem);
        });
      }
    }

    const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    if (cartTotalElement) {
      cartTotalElement.textContent = total.toFixed(2);
    }

    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    cartCountElements.forEach(element => {
      element.textContent = totalItems;
    });
  }

  // Cambiar cantidad
  function changeQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(p => p.id === parseInt(productId));
    if (product) {
      if (newQuantity <= 0) {
        cart = cart.filter(p => p.id !== parseInt(productId));
      } else {
        product.quantity = newQuantity;
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    }
  }

  // Eliminar producto
  function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(p => p.id !== parseInt(productId));
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto eliminado del carrito.');
    updateCart();
  }

  // Vaciar carrito
  function clearCart() {
    localStorage.removeItem('cart');
    alert('Carrito vaciado.');
    updateCart();
  }

  // Cargar productos
  function loadProducts() {
    if (productsList) {
      productsList.innerHTML = '';
      umbrellaProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.alt}">
          <h3>${product.title}</h3>
          <p>${product.category}</p>
          <p>$${product.price.toFixed(2)}</p>
          <p>${product.description.substring(0, 100)}...</p>
          <button class="add-to-cart" data-id="${product.id}" aria-label="Añadir ${product.title} al carrito">Añadir al Carrito</button>
        `;
        productsList.appendChild(productCard);
      });

      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
          const productId = parseInt(button.getAttribute('data-id'));
          const product = umbrellaProducts.find(p => p.id === productId);
          addToCart(product);
        });
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const productId = parseInt(button.getAttribute('data-id'));
            const product = umbrellaProducts.find(p => p.id === productId);
            addToCart(product);
          }
        });
      });
    }
  }

  // Eventos del carrito
  if (cartList) {
    cartList.addEventListener('click', (e) => {
      if (e.target.classList.contains('increase-quantity')) {
        const productId = e.target.getAttribute('data-id');
        const product = JSON.parse(localStorage.getItem('cart')).find(p => p.id === parseInt(productId));
        changeQuantity(productId, product.quantity + 1);
      }
      if (e.target.classList.contains('decrease-quantity')) {
        const productId = e.target.getAttribute('data-id');
        const product = JSON.parse(localStorage.getItem('cart')).find(p => p.id === parseInt(productId));
        changeQuantity(productId, product.quantity - 1);
      }
      if (e.target.classList.contains('cart-item-remove')) {
        const productId = e.target.getAttribute('data-id');
        removeFromCart(productId);
      }
    });

    cartList.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('increase-quantity') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        const productId = e.target.getAttribute('data-id');
        const product = JSON.parse(localStorage.getItem('cart')).find(p => p.id === parseInt(productId));
        changeQuantity(productId, product.quantity + 1);
      }
      if (e.target.classList.contains('decrease-quantity') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        const productId = e.target.getAttribute('data-id');
        const product = JSON.parse(localStorage.getItem('cart')).find(p => p.id === parseInt(productId));
        changeQuantity(productId, product.quantity - 1);
      }
      if (e.target.classList.contains('cart-item-remove') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        const productId = e.target.getAttribute('data-id');
        removeFromCart(productId);
      }
    });

    cartList.addEventListener('change', (e) => {
      if (e.target.tagName === 'INPUT') {
        const productId = e.target.getAttribute('data-id');
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
          changeQuantity(productId, newQuantity);
        }
      }
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
    clearCartBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clearCart();
      }
    });
  }

  // Inicializar
  loadProducts();
  updateCart();
  updateReviews();
});