const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener("DOMContentLoaded", () => {
  const titulo = document.querySelector(".hero-content h2");
  if (titulo) {
    titulo.style.opacity = 0;
    titulo.style.transform = "translateY(-20px)";
    setTimeout(() => {
      titulo.style.transition = "all 0.8s ease";
      titulo.style.opacity = 1;
      titulo.style.transform = "translateY(0)";
    }, 300);
  }
});

const toggleBtn = document.getElementById("toggleTheme");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

function showToast() {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

window.addEventListener("load", showToast);

const apiKey = "4d3030d83f91a0d996d532aed30a54ca"; 

fetch(`https://api.openweathermap.org/data/2.5/weather?q=Buenos%20Aires,AR&units=metric&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    const temperatura = Math.round(data.main.temp);
    const ciudad = data.name;
    const descripcion = data.weather[0].description;

    document.getElementById("clima").textContent = `🌤 ${temperatura}°C en ${ciudad} – ${descripcion}`;
  })
  .catch(error => {
    console.error("Error al obtener clima:", error);
    document.getElementById("clima").textContent = "No se pudo cargar el clima 🌧";
  });
