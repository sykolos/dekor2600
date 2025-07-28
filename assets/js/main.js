// main.js

// Sticky navbar behavior (fine-tuned)
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// email on CTA click
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('contact-form');
  const responseBox = document.getElementById('form-response');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      privacy: form.privacy.checked
    };

    // Kötelező mezők ellenőrzése kliens oldalon
    if (!data.name || !data.email || !data.privacy) {
      responseBox.style.color = "red";
      responseBox.innerText = "Kérlek töltsd ki a kötelező mezőket.";
      return;
    }

    try {
      const res = await fetch('assets/php/send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // Ha nem JSON-t kaptunk, dobjunk hibát
      if (!res.ok) {
        throw new Error("Szerverhiba történt");
      }

      const result = await res.json();

      if (result.status === "success") {
        responseBox.style.color = "green";
        responseBox.innerText = result.message;
        form.reset(); // ürítsd ki a formot siker után
      } else {
        responseBox.style.color = "red";
        responseBox.innerText = result.message || "Ismeretlen hiba történt.";
      }

    } catch (error) {
      responseBox.style.color = "red";
      responseBox.innerText = "Hiba történt a küldés során. Próbáld újra később.";
    }
  });
});

//google analitycs
document.addEventListener("DOMContentLoaded", function () {
  const cookiePopup = document.getElementById("cookie-popup");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    name = name + "=";
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  if (getCookie("analyticsConsent") === "") {
    cookiePopup.style.display = "block";
  } else {
    cookiePopup.style.display = "none";
    if(getCookie("analyticsConsent") === "accepted") {
      loadAnalytics();
    }
  }

  acceptBtn.addEventListener("click", function () {
    setCookie("analyticsConsent", "accepted", 180); //180 nap = 6 hónap
    cookiePopup.style.display = "none";
    loadAnalytics();
  });

  declineBtn.addEventListener("click", function () {
    setCookie("analyticsConsent", "declined", 180);
    cookiePopup.style.display = "none";
  });

  function loadAnalytics() {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  }
});
