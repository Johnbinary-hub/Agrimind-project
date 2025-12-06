const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    preview.src = url;

    preview.style.display = "block";
});
document.getElementById("openPicker").addEventListener("click", () => {
    document.getElementById("fileInput").click();
});

document.getElementById("btnPicker").addEventListener("click", () => {
    document.getElementById("fileInput").click();
});

document.querySelectorAll(".change").forEach(change => {
  let text = change.textContent.trim();

  if (text.startsWith("+")) {
    change.classList.add("positive");
  } else if (text.startsWith("-")) {
    change.classList.add("negative");
  }
});
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

cards.forEach(card => observer.observe(card));
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('#navMenu');

hamburger.addEventListener('click', ()=>{
  
  navMenu.classList.toggle('show');
})
