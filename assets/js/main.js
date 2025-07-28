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
document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
    privacy: form.privacy.checked
  };

  if (!data.name || !data.email || !data.privacy) {
    document.getElementById('form-response').innerText = "Kérlek töltsd ki a kötelező mezőket.";
    return;
  }

  try {
    const res = await fetch('assets/php/send.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    document.getElementById('form-response').innerText = result.message;
  } catch (error) {
    document.getElementById('form-response').innerText = "Hiba történt a küldés során.";
  }
});
