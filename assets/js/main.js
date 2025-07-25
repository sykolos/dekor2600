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

// Alert on CTA click
const ctaButtons = document.querySelectorAll("a.btn.primary[href='#ajanlat']");
ctaButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Ajánlatkérés gombra kattintottál!");
    document.getElementById("ajanlat").scrollIntoView({ behavior: "smooth" });
  });
});
