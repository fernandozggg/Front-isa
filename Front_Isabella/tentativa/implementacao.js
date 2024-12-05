// Função para consumir a API e preencher o carrossel
async function consumirAPI(limit = 5) { // Limitador de quantidade
    console.log("Consumindo API...");
    try {
        const response = await fetch(`http://127.0.0.1:8000/adidas/?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Dados recebidos da API:", data);

        const carousel = document.querySelector('.carousel');
        if (!carousel) {
            console.error('Elemento ".carousel" não encontrado.');
            return;
        }

        preencherSneakers(data);

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

        initializeCarousel(); // Reconfigurar o carrossel após carregar as imagens
    } catch (error) {
        console.error('Erro ao consumir a API:', error);
    }
}

// Função para adicionar uma imagem ao carrossel
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

    setInterval(nextSlide, 3000); // Controle automático
}

function showSlide(index) {
    const carousel = document.querySelector('.carousel');
    const slides = carousel.querySelectorAll('img');
    if (slides.length === 0) return;

    currentIndex = (index + slides.length) % slides.length; // Garante o loop

    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`; // Move o carrossel
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

// Função para preencher os sneakers na página
function preencherSneakers(data) {
    const sneakersSection = document.querySelector('.sneakers');
    if (!sneakersSection) {
        console.error('Elemento ".sneakers" não encontrado.');
        return;
    }

    sneakersSection.innerHTML = ''; // Limpar a seção

    // Adicionar cada tênis
    data.forEach((item) => {
        if (item.image_preview_url) {
            const sneakerDiv = document.createElement('div');
            sneakerDiv.className = 'sneaker-item';

            sneakerDiv.innerHTML = `
                <div class="sneaker-img-wrapper">
                    <img src="${item.image_preview_url}" alt="Imagem do ${item.modelo}" class="sneaker-img">
                </div>
                <div class="sneaker-info">
                    <h3>${item.modelo}</h3>
                    <p class="sneaker-price">Preço: R$ ${parseFloat(item.preco).toFixed(2)}</p>
                </div>
            `;

            sneakersSection.appendChild(sneakerDiv);
        }
    });
}

// Função para aplicar filtros
async function filterSneakers() {
    console.log("Filtrando sneakers...");
    try {
        const modelFilter = document.getElementById("modelFilter").value;
        const sizeFilter = document.getElementById("sizeFilter").value;
        const colorFilter = document.getElementById("colorFilter").value;

        let url = 'http://127.0.0.1:8000/adidas/?';

        if (modelFilter !== 'all') url += `modelo=${modelFilter}&`;
        if (sizeFilter !== 'all') url += `tamanho=${sizeFilter}&`;
        if (colorFilter !== 'all') url += `cor=${colorFilter}&`;

        url = url.slice(0, -1); // Remove o "&" extra

        console.log("URL de requisição:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);

        const filteredData = await response.json();

        preencherSneakers(filteredData); // Atualiza os sneakers
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
    }
}

// Função para resetar os filtros
function resetFilters() {
    document.getElementById("modelFilter").value = 'all';
    document.getElementById("sizeFilter").value = 'all';
    document.getElementById("colorFilter").value = 'all';

    consumirAPI(5); // Recarrega os 5 primeiros tênis
}

// Chamar a função consumirAPI após o carregamento da página
window.addEventListener('DOMContentLoaded', () => consumirAPI(5));
