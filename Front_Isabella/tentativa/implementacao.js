// Função para consumir a API e preencher o carrossel
async function consumirAPI() {
    console.log("Consumindo API...");
    try {
        const response = await fetch('http://127.0.0.1:8000/adidas/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();

        // Debug: Verificar os dados recebidos
        console.log("Dados recebidos da API:", data);

        //Renderiza os cards
        const cards_session = document.querySelector('.sneakers');

        sneakers = ""

        data.forEach((item) => {
            sneakers += `
                <div class="sneaker">
                    <img src="${item.image_preview_url}">
                    <h2>${item.modelo}</h2>
                    <button>Comprar</button>
                </div>
            `;
        });

        cards_session.innerHTML = sneakers;



        const carousel = document.querySelector('.carousel');
        if (!carousel) {
            console.error('Elemento ".carousel" não encontrado.');
            return;
        }

        // Limpar o carrossel antes de adicionar novas imagens
        carousel.innerHTML = '';

        // Iterar sobre cada objeto no array para adicionar as imagens ao carrossel
        data.forEach((item) => {
            if (item.image_preview_url) {
                adicionarImagemAoCarousel(
                    carousel,
                    item.image_preview_url,
                    `Imagem do ${item.modelo}`
                );
            }
        });


        // Reconfigurar o carrossel após carregar as imagens
        initializeCarousel();
    } catch (error) {
        console.error('Erro ao consumir a API:', error);
    }
}

// Função para adicionar a imagem ao carrossel
function adicionarImagemAoCarousel(carousel, src, alt) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.width = '100%';
    img.style.height = '250px';
    img.style.objectFit = 'cover';
    carousel.appendChild(img);
}

// Inicializar o carrossel
let currentIndex = 0;
function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel img');
    if (slides.length === 0) return;

    currentIndex = 0; // Resetar o índice inicial
    showSlide(currentIndex);

    // Adicionar controle automático
    setInterval(nextSlide, 3000);
}

function showSlide(index) {
    const carousel = document.querySelector('.carousel');
    const slides = carousel.querySelectorAll('img');
    if (slides.length === 0) return;

    // Atualiza o índice para garantir que o carrossel fique dentro do intervalo de imagens
    if (index >= slides.length) currentIndex = 0;
    else if (index < 0) currentIndex = slides.length - 1;
    else currentIndex = index;

    // Calcula o deslocamento baseado no índice
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`; // Move o carrossel
}


function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

// Chamar a função consumirAPI após o carregamento da página
window.addEventListener('DOMContentLoaded', consumirAPI(console.data));

// Função para mover para o slide anterior
function moveLeft() {
    showSlide(currentIndex - 1); // Chama a função showSlide com índice decrementado
}

// Função para mover para o slide seguinte
function moveRight() {
    showSlide(currentIndex + 1); // Chama a função showSlide com índice incrementado
}

// Seleciona os botões de navegação
const leftButton = document.querySelector('.nav-button.left');
const rightButton = document.querySelector('.nav-button.right');

// Adiciona ouvintes de evento para os botões
leftButton.addEventListener('click', moveLeft);
rightButton.addEventListener('click', moveRight);

