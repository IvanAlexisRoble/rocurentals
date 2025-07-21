const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (formStatus) {
            formStatus.textContent = "Enviando...";
            formStatus.style.color = "#333";
            formStatus.style.display = "block";
        }

        const formData = new FormData(contactForm);
        // Asegúrate de que esta es la URL correcta de tu script de Google
        const scriptURL = "https://script.google.com/macros/s/AKfycbwcxGq5Kz6BkSu2wf4D-lB0aILETGiZWRDQr3UX9YuV4IftmcGqTXB3mCJaJ-lE7a81/exec";

        fetch(scriptURL, { method: "POST", body: formData })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (error) {
                        console.log("Respuesta no JSON recibida:", text);
                        return { result: "success", message: "Respuesta recibida (no JSON), asumiendo éxito." };
                    }
                });
            })
            .then(data => {
                console.log("Respuesta procesada:", data);
                if (data && data.result === "success") {
                    if (formStatus) {
                        formStatus.textContent = "¡Gracias! Tu mensaje ha sido enviado correctamente.";
                        formStatus.style.color = "green";
                        contactForm.reset();
                    }
                } else {
                    if (formStatus) {
                        formStatus.textContent = "Error: No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.";
                        formStatus.style.color = "red";
                    }
                    console.error(new Error(data.message || "El script devolvió una respuesta inesperada."));
                }
            })
            .catch(error => {
                console.error("Error en fetch o procesamiento!", error);
                if (formStatus) {
                    formStatus.textContent = "Error: No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.";
                    formStatus.style.color = "red";
                }
            });
    });
} else {
    // Esta advertencia solo tiene sentido en la página de contacto.
    // Verificamos si la URL actual es la de contacto.html.
    if (window.location.pathname.endsWith('contacto.html')) {
        console.warn("El elemento con ID 'contact-form' no fue encontrado en la página de contacto.");
    }
}

const mobileMenuButton = document.getElementById("mobile-menu-button");
const navUl = document.querySelector("header nav ul");

if (mobileMenuButton && navUl) {
    mobileMenuButton.addEventListener("click", () => {
        navUl.classList.toggle("menu-visible");
        const isVisible = navUl.classList.contains("menu-visible");
        mobileMenuButton.setAttribute("aria-expanded", isVisible);
    });
} else {
    if (!mobileMenuButton) {
        console.warn("Elemento con ID 'mobile-menu-button' no encontrado.");
    }
    if (!navUl) {
        console.warn("Elemento 'header nav ul' no encontrado.");
    }
}

const cookiePopup = document.getElementById("cookie-popup");
const acceptCookiesButton = document.getElementById("accept-cookies");

if (cookiePopup && acceptCookiesButton) {
    if (!localStorage.getItem("cookiesAccepted")) {
        cookiePopup.style.display = "block";
    }
    acceptCookiesButton.onclick = function() {
        localStorage.setItem("cookiesAccepted", "true");
        cookiePopup.style.display = "none";
    };
} else {
    if (window.location.pathname === "/" || window.location.pathname.endsWith("index.html")) {
        if (!cookiePopup) console.warn("Elemento con ID 'cookie-popup' no encontrado.");
        if (!acceptCookiesButton) console.warn("Elemento con ID 'accept-cookies' no encontrado.");
    }
}