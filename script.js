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
    }

    // *** ¡¡¡ IMPORTANTE !!! ***
    // Pega aquí la URL de tu Aplicación Web de Google Apps Script que copiaste antes
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw9sDIe3JDr-LxRRcTg6fDMRhTLfiQCSALNbFlZHcPvZ-y7MQGTaWl4KC2mtR1ecImn/exec';

    const formData = new FormData(contactForm);

    // Usa fetch para enviar los datos al script de GoogleS
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => response.json()) // Espera una respuesta JSON del script
      .then(data => {
        console.log('Success:', data);
        if (data.result === 'success') {
          // Muestra mensaje de éxito
          if (formStatus) {
              formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
              formStatus.style.color = 'green';
          }
          contactForm.reset(); // Limpia el formulario
        } else {
          // Muestra mensaje de error (si el script devuelve error)
           throw new Error(data.message || 'Hubo un problema al enviar el formulario.');
        }
      })
      .catch(error => {
        console.error('Error!', error.message);
        // Muestra mensaje de error (si hay un error de red o en el script)
         if (formStatus) {
             formStatus.textContent = 'Error: No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.';
             formStatus.style.color = 'red';
         }
      });
  });
} else {
    console.warn("El elemento con ID 'contact-form' no fue encontrado.");
}

// --- Fin: Código para conectar Formulario con Google Sheets ---