// --- Inicio: Código para conectar Formulario con Google Sheets ---

// Selecciona el formulario usando su ID
const contactForm = document.getElementById('contact-form');
// Selecciona el div donde mostraremos mensajes de estado
const formStatus = document.getElementById('form-status');

// Añade un listener para el evento 'submit' del formulario
if (contactForm) { // Asegúrate de que el formulario existe antes de añadir el listener
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío normal del formulario que recargaría la página

    // Muestra un mensaje de "Enviando..."
    if (formStatus) {
        formStatus.textContent = 'Enviando...';
        formStatus.style.color = '#333'; // Color neutral
        formStatus.style.display = 'block'; // Asegura que sea visible
    }

    // URL de tu Aplicación Web de Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyLuqGMmCYsSMupT6Aqviqh975kc6Mln7IBn0Y9419rZ_VukuF-5Ud8jIlxKb0M5ceM/exec'; // Asegúrate que esta URL sea correcta

    const formData = new FormData(contactForm);

    // Usa fetch para enviar los datos al script de Google
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => {
          // Google Apps Script a veces devuelve respuestas no estándar, intentamos parsear JSON
          // pero si falla, asumimos éxito si la respuesta es OK.
          if (!response.ok) {
              // Si la respuesta HTTP no es OK, lanza un error
              throw new Error(`Network response was not ok, status: ${response.status}`);
          }
          // Intenta parsear como JSON, pero prepárate para un texto simple o vacío
          return response.text().then(text => {
              try {
                  return JSON.parse(text);
              } catch (e) {
                  // Si no es JSON válido pero la respuesta fue OK, podría ser éxito igual.
                  // Devolvemos un objeto simulando éxito si el texto parece indicar redirección o éxito.
                  // O simplemente asumimos éxito basado en response.ok.
                  // Google a veces redirige tras POST, lo que puede complicar la respuesta.
                  console.log("Respuesta no JSON recibida:", text);
                  // Asumimos éxito si la respuesta http fue OK y no hubo error de red
                  return { result: 'success', message: 'Respuesta recibida (no JSON), asumiendo éxito.' };
              }
          });
       })
      .then(data => {
        console.log('Respuesta procesada:', data);
        // Comprobamos si la respuesta (parseada o simulada) indica éxito.
        // El script de Google típico devuelve {result: "success"}
        if (data && data.result === 'success') {
          // Muestra mensaje de éxito
          if (formStatus) {
              formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
              formStatus.style.color = 'green';
          }
          contactForm.reset(); // Limpia el formulario
        } else {
          // Muestra mensaje de error si el script devolvió explícitamente un error
           throw new Error(data.message || 'El script devolvió una respuesta inesperada.');
        }
      })
      .catch(error => {
        console.error('Error en fetch o procesamiento!', error);
        // Muestra mensaje de error (si hay un error de red o en el script)
         if (formStatus) {
             formStatus.textContent = 'Error: No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.';
             formStatus.style.color = 'red';
         }
      });
  });
} else {
    // Solo muestra este aviso si estás en la página de contacto y no encuentra el form
    if (document.body.contains(document.getElementById('contacto'))) {
      console.warn("El elemento con ID 'contact-form' no fue encontrado en la página de contacto.");
    }
}

// --- Fin: Código para conectar Formulario con Google Sheets ---


// --- Inicio: Código para Menú Móvil Hamburguesa ---

// Seleccionar el botón y el menú
const mobileMenuButton = document.getElementById('mobile-menu-button');
// Selecciona la lista ul específicamente dentro del nav del header para evitar conflictos
const navUl = document.querySelector('header nav ul');

// Verificar que ambos elementos existen antes de añadir el listener
if (mobileMenuButton && navUl) {
  mobileMenuButton.addEventListener('click', () => {
    // Añade o quita la clase 'menu-visible' a la lista ul
    navUl.classList.toggle('menu-visible');

    // Actualizar el atributo aria-expanded para accesibilidad
    const isVisible = navUl.classList.contains('menu-visible');
    mobileMenuButton.setAttribute('aria-expanded', isVisible);

    // Opcional: Cambiar el icono de hamburguesa a una 'X' y viceversa
    // if (isVisible) {
    //   mobileMenuButton.innerHTML = '✕'; // Icono de cerrar
    // } else {
    //   mobileMenuButton.innerHTML = '☰'; // Icono de hamburguesa
    // }
  });

  // Opcional: Cerrar menú si se hace clic en un enlace (para SPAs o si el menú ocupa pantalla completa)
  // navUl.addEventListener('click', (event) => {
  //   if (event.target.tagName === 'A' && navUl.classList.contains('menu-visible')) {
  //     navUl.classList.remove('menu-visible');
  //     mobileMenuButton.setAttribute('aria-expanded', 'false');
  //     // mobileMenuButton.innerHTML = '☰'; // Restaurar icono hamburguesa
  //   }
  // });

} else {
  // Mensaje en consola si no se encuentran los elementos (útil para depurar)
  if (!mobileMenuButton) console.warn("Elemento con ID 'mobile-menu-button' no encontrado.");
  if (!navUl) console.warn("Elemento 'header nav ul' no encontrado.");
}

// --- Fin: Código para Menú Móvil Hamburguesa ---


// --- Inicio: Código para Popup de Cookies ---
// (Asegúrate de que este código no esté duplicado si ya lo tenías)

// Verifica si el elemento existe antes de intentar acceder a él
const cookiePopup = document.getElementById("cookie-popup");
const acceptCookiesButton = document.getElementById("accept-cookies");

if (cookiePopup && acceptCookiesButton) {
    // Mostrar popup solo si no se aceptaron las cookies aún
    if (!localStorage.getItem("cookiesAccepted")) {
        cookiePopup.style.display = "block";
    }

    acceptCookiesButton.onclick = function() {
        localStorage.setItem("cookiesAccepted", "true"); // Guardar como string 'true'
        cookiePopup.style.display = "none";
    };
} else {
    // Solo muestra aviso si el popup debería estar presente (ej. en index.html)
     if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        if (!cookiePopup) console.warn("Elemento con ID 'cookie-popup' no encontrado.");
        if (!acceptCookiesButton) console.warn("Elemento con ID 'accept-cookies' no encontrado.");
     }
}
// --- Fin: Código para Popup de Cookies ---