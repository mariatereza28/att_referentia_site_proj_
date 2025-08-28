import { repositorio } from './repository.js';

let articles = [];
const output = document.getElementById('output');
const forms = document.getElementById('forms');

const menuToggleBtn = document.getElementById('menu-toggle-btn');
const sideMenu = document.getElementById('side-menu');
const closeBtn = document.querySelector('.close-btn');
const sideMenuButtons = sideMenu.querySelectorAll('button');
const mainContentContainer = document.getElementById('main-content-container');

// Ações do menu
const actions = {
    init: () => {
        const subtitle = "<h2>Artigos Sugeridos</h2>"
        articles = repositorio.loadDefaultArticles();
        output.innerHTML = subtitle + repositorio.listArticles(articles);
        forms.innerHTML = "";
        forms.style.display = 'none';
    },
    list: () => {
        forms.innerHTML = '';
        output.innerHTML = articles.length === 0 ? 'Nenhum artigo carregado.' : repositorio.listArticles(articles);
    },
    search: () => showSearchForm(),
    countByAuthor: () => showAuthorChart(),
    sortByYear: () => {
        articles = repositorio.sortByYear(articles);
        output.innerHTML = repositorio.listArticles(articles);
    },
    sortByTitle: () => {
        articles = repositorio.sortByTitle(articles);
        output.innerHTML = repositorio.listArticles(articles);
    },
    sortByAuthor: () => {
        articles = repositorio.sortByAuthor(articles);
        output.innerHTML = repositorio.listArticles(articles);
    },
    exit: () => {
        forms.innerHTML = '';
        output.textContent = 'Volte sempre!';
    }
};

// Funções da UI
function showSearchForm() {
    forms.innerHTML = `
    <h3>Buscar Artigos</h3>
    <form id="searchForm">
      <input type="text" id="searchQuery" placeholder="Digite sua busca" required />
      <button type="submit">Buscar</button>
    </form>
  `;
    forms.style.display = 'block';
    output.textContent = '';
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('searchQuery').value;
        output.textContent = "Buscando...";
        articles = await repositorio.searchArticles(query);
        forms.innerHTML = '';
        if (articles.length === 0) {
            output.textContent = 'Desculpe! Nenhum artigo encontrado.';
        } else {
            output.innerHTML = repositorio.listArticles(articles);
        }
    });
}

function showAuthorChart() {
    if (articles.length === 0) {
        forms.innerHTML = '';
        output.textContent = 'Por favor, busque artigos primeiro para poder gerar o gráfico.';
        return;
    }
    forms.innerHTML = `<canvas id="authorChart"></canvas>`;
    output.textContent = '';
    const counts = repositorio.countArticlesByAuthor(articles);
    const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);
    const labels = sorted.map(([autor]) => autor);
    const data = sorted.map(([_, qtd]) => qtd);
    const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);
    const ctx = document.getElementById('authorChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{ label: 'Artigos', data, backgroundColor: colors }]
        },
        options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true }, y: { ticks: { autoSkip: false } } }
        }
    });
}

// ui.js

// ui.js

// ui.js

window.toggleDetails = (index) => {
    // Encontra o contêiner 'article-item' pai. Esta é a nossa referência segura.
    const articleItem = document.getElementsByClassName('article-item')[index];
    
    // Dentro do 'article-item', encontramos o botão e a seção de detalhes.
    const details = articleItem.querySelector('.details');
    const button = articleItem.querySelector('.toggle-details-btn');

    if (details.style.display === 'none' || details.style.display === '') {
        // Se os detalhes estão escondidos, mostre-os e mova o botão.
        details.style.display = 'block';
        button.innerHTML = '<i class="fas fa-minus"></i> Menos informações';
        
        // Move o botão para o final do contêiner de detalhes.
        details.appendChild(button);
    } else {
        // Se os detalhes estão visíveis, esconda-os e mova o botão de volta.
        details.style.display = 'none';
        button.innerHTML = '<i class="fas fa-plus"></i> Mais informações';

        // Move o botão de volta para a posição original, antes da div de detalhes.
        // O `articleItem` é o pai, e 'insertBefore' insere o botão antes da div de detalhes.
        articleItem.insertBefore(button, details);
    }
};

const toggleMenu = () => {
    const isMenuOpen = sideMenu.classList.toggle('active');
    menuToggleBtn.classList.toggle('active');
    mainContentContainer.style.marginLeft = isMenuOpen ? '250px' : '0';
};

menuToggleBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu); // Fechar o menu com o novo botão "X"

sideMenu.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button) {
        const action = button.dataset.action;
        if (action && actions[action]) {
            actions[action]();
            toggleMenu(); 
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    actions.init();
});