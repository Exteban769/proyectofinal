Corporación Umbrella Website
Un sitio web ficticio para Corporación Umbrella, una empresa farmacéutica y biotecnológica. ofrece una experiencia interactiva para explorar productos, gestionar un carrito, enviar reseñas, y contactar a la empresa.
Características Principales

Inicio: Carrusel automático (cada 5 segundos) con imágenes y video de YouTube centrado.
Productos: Lista de productos farmacéuticos con imágenes, precios, y botón "Añadir al Carrito".
Carrito: Gestiona productos (editar cantidades, eliminar, total dinámico), con persistencia en el navegador y opción "Finalizar Compra" que envía datos a Formspree.
Contacto: Formulario para enviar mensajes y mapa (placeholder: Obelisco, Buenos Aires).
Reseñas: Publica reseñas en tiempo real, guardadas en el navegador, con nombre, comentario, y fecha.
Diseño: Responsivo (móviles y escritorio), con colores rojo y gris oscuro, y fuente Roboto.
Accesibilidad: Imágenes con alt, formularios con etiquetas, y navegación por teclado.
SEO: Metaetiquetas y títulos optimizados.

Estructura del Proyecto
umbrella-corp-website/
├── css/styles.css       # Estilos
├── js/main.js           # Lógica interactiva
├── img/                 # Imágenes (logo, productos, carrusel)
├── pages/               # Páginas (comentarios, contactos, productos, carrito)
├── index.html           # Página principal
└── README.md

Instalación

Clona el repositorio: git clone <URL-del-repositorio>
Asegúrate de que las imágenes estén en img/.
Abre index.html en un navegador (Chrome, Firefox, Edge).

Uso

Explora: Navega por el carrusel y video en index.html.
Compra: Añade productos al carrito en productos.html, edítalos en carrito.html, y finaliza la compra.
Contacta: Envía mensajes en contactos.html (llegan a Formspree).
Comenta: Publica reseñas en comentarios.html; se muestran al instante y persisten en el navegador.
Prueba responsividad: Usa la vista móvil del navegador (F12 > Toggle Device Toolbar).
Prueba accesibilidad: Navega con Tab y Enter/Espacio.

Notas para Producción

Placeholders: Reemplaza imágenes del carrusel, enlaces de redes sociales, y el mapa por contenido real.
Formspree: Configura el endpoint https://formspree.io/f/xldbvzqy para formularios.
Persistencia: Usar un backend (por ejemplo, Firebase) para reseñas y pedidos visibles para todos.
Optimización: Minimiza CSS/JS, optimiza imágenes, y añade un sitemap XML para SEO.

Tecnologías

HTML5, CSS3 (Flexbox, Grid), JavaScript (ES6)
localStorage para carrito y reseñas
Formspree para formularios

Autor
Esteban jose cayo aprendiendo desarrollo web.
Licencia
© 2025 Corporación Umbrella. Uso educativo.