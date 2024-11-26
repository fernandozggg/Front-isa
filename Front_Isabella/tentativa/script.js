let currentIndex = 0; // Índice da imagem atual
const carousel = document.querySelector('.carousel');
const images = document.querySelectorAll('.carousel img');
const totalImages = images.length;

function updateCarousel() {
    const offset = -currentIndex * 100; // Calcula o deslocamento horizontal
    carousel.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalImages; // Volta ao início ao chegar no fim
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages; // Vai ao final se for menor que 0
    updateCarousel();
}

// Alternar automaticamente a cada 5 segundos
setInterval(nextSlide, 5000);
