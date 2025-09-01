import { repositorio } from './repository.js'; //importa a nossa caixa de ferramentas

let articles = []; //variavel global que pode ser mudada e estao sendo exibidas
const output = document.getElementById('output'); //serve para exibir listas de artigos e mensagens como buscando etc
const forms = document.getElementById('forms'); //exibe o formulário de busca, funciona como um formulario
//faz os botões do menu funcionar, resumindo cada um desses busca pelo id dentro do parentese.
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const sideMenu = document.getElementById('side-menu');
const closeBtn = document.querySelector('.close-btn');
const mainContentContainer = document.getElementById('main-content-container');
const btnInit = document.getElementById('btn-init');
const btnList = document.getElementById('btn-list');
const btnSearch = document.getElementById('btn-search');
const btnCountByAuthor = document.getElementById('btn-countByAuthor');
const btnSortByYear = document.getElementById('btn-sortByYear');
const btnSortByTitle = document.getElementById('btn-sortByTitle');
const btnSortByAuthor = document.getElementById('btn-sortByAuthor');
const btnExit = document.getElementById('btn-exit');


const actions = {
    //assim que a página é carregada isso aparece, com o titulo artigos sugeridos, e os artigos já predefinidos
    init: () => {
        const subtitle = "<h2>Artigos Sugeridos</h2>"
        articles = repositorio.loadDefaultArticles();
        output.innerHTML = subtitle + repositorio.listArticles(articles);
        forms.innerHTML = ""; //garante que a parte de busca nao apareça ao mesmo tempo que os artigos predefinidos
        forms.style.display = 'none';
    },
    list: () => { //apenas pega o array e compara o tamanho dele, sse for 0, ele exibe nenhum artigo, se nao exibe a lista, seja a de busca ou a já predefinida
        forms.innerHTML = '';
        output.innerHTML = articles.length === 0 ? 'Nenhum artigo carregado.' : repositorio.listArticles(articles);
    },
    //search chama a função showsearchform que é onde mostra o formulário de busca
    search: () => showSearchForm(),
    countByAuthor: () => showAuthorChart(), //chama a função no repository e exibe os gráficos
    
    //essas tres funções sort funcionam da mesma maneira, elas chamam a função correspondente no arquivo repository e reorganizam do jeito que queremos, e mostra a lista ordenada
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
    //limpa a tela e mostra o volte sempre
    exit: () => {
        forms.innerHTML = '';
        output.textContent = 'Volte sempre!';
    }
};


function showSearchForm() {
    //parte da tela que aparece a opção de buscar junto com os botoes
    forms.innerHTML = `
    <h3>Buscar Artigos</h3>
    <form id="searchForm">
      <input type="text" id="searchQuery" placeholder="Digite sua busca" required />
      <button type="submit">Buscar</button>
    </form>
  `;
    forms.style.display = 'block';
    output.textContent = '';
    //o codigo espera que o formulário seja enviado quando o usuario apertar enter.
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        //impede que o navegador carregue a pagina para a busca ser feita pelo javascript
        e.preventDefault();
        //pega o texto que o usuario digitou
        const query = document.getElementById('searchQuery').value;
        //enquanto é processado aparece a mensagem de buscando
        output.textContent = "Buscando...";
        //chama as ferramentas do repositorio pra buscar artigos e a função await faz com que a função pause ate que a api responda
        articles = await repositorio.searchArticles(query);
        forms.innerHTML = '';
        //verifica se a api encontrou algo, comparando o tamanho da array
        if (articles.length === 0) {
            output.textContent = 'Desculpe! Nenhum artigo encontrado.';
        } else {
            output.innerHTML = repositorio.listArticles(articles);
        }
    });
}

function showAuthorChart() {
    //verifica o tamanho da array articles e se for igual a 0, ela bloqueia a função exibindo uma mensagem, ajuda a nao criar um gráfico sem dados
    if (articles.length === 0) {
        forms.innerHTML = '';
        output.textContent = 'Por favor, busque artigos primeiro para poder gerar o gráfico.';
        return;
    }//se nao for verdadeira a aafirmação essa parte do forms permite a criação do gráfico
    forms.innerHTML = `<canvas id="authorChart"></canvas>`;
    output.textContent = '';
    //conta quantos artigos cada autor tem
    const counts = repositorio.countArticlesByAuthor(articles);
    //coverte o objeto count em array, onde cada array eh uma subarrau e contem o nome e o seu numero, o .sort rearranja esse novo array do menor para o maior
    const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);
    const labels = sorted.map(([autor]) => autor); //novo array so com nomes
    const data = sorted.map(([_, qtd]) => qtd); //novo array so q a quantidade
    const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);//garante que cada barrinha tenha uma cor diferente
    //função chart recebe ctx, define que quer como barras, fornece os dados em data, e define a orientação dos eixos, se há legenda e a escala dos eixos. parte mais visual
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

window.toggleDetails = (index) => {
    //usa o index para garantir que seja o artigo certo que estamos manipulando
    const articleItem = document.getElementsByClassName('article-item')[index];
    const details = articleItem.querySelector('.details');
    const button = articleItem.querySelector('.toggle-details-btn');
//verifica se os detalhes estao vazios (ocultos) se sim, cria um bloco, e o botao que antes era mais informações se torna menos informações
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
        button.innerHTML = '<i class="fas fa-minus"></i> Menos informações';
        //move a posição do botao
        details.appendChild(button);
    } else {
       //se os detalhes estiverem visiveis, ele esconde novamente e retorna o botao p sua posição original
        details.style.display = 'none';
        button.innerHTML = '<i class="fas fa-plus"></i> Mais informações';
        articleItem.insertBefore(button, details);
    }
};
//alterna entre dois estados do menu, utiliza do css para manipular a aparição do menu 
const toggleMenu = () => {
    //se a classe estiver ativada o menu aparece na tela
    const isMenuOpen = sideMenu.classList.toggle('active');
    menuToggleBtn.classList.toggle('active');
    //o menu foi aberto? se sim, margem expande dando local ao menu, se nao volta ao normal o site
    mainContentContainer.style.marginLeft = isMenuOpen ? '250px' : '0';
};
//ao apertar a função chama o toggleMenu, e quando executada pode manter o menu fechado ou aberto.
menuToggleBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu); 
//todas essas funções funcionam da mesma forma, quando tiver um clique, eles chama a ações e dps que for concluida a função toggleMenu fecha o menu
btnInit.addEventListener('click', () =>{
    actions.init()
    toggleMenu()
});

btnList.addEventListener('click',() =>{
    actions.list();
    toggleMenu ();
}); 
btnSearch.addEventListener('click', () => {
    actions.search();
    toggleMenu();
});

btnCountByAuthor.addEventListener('click', () => {
    actions.countByAuthor();
    toggleMenu();
});

btnSortByYear.addEventListener('click', () => {
    actions.sortByYear();
    toggleMenu();
});

btnSortByTitle.addEventListener('click', () => {
    actions.sortByTitle();
    toggleMenu();
});

btnSortByAuthor.addEventListener('click', () => {
    actions.sortByAuthor();
    toggleMenu();
});

btnExit.addEventListener('click', () => {
    actions.exit();
    toggleMenu();
});
//essa nao espera o clique, mas sim um evento que acontece no navegador, isso garante que as ações so funcionarao apos todo o html ter carregado
document.addEventListener('DOMContentLoaded', () => {
    actions.init();
});
