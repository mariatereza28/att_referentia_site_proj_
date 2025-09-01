// repository.js

const SEMANTIC_SCHOLAR_API_URL = "https://api.semanticscholar.org/graph/v1/paper/search"; //endereço da api so semantic Scholar

const predefinedArticles = [     //armazena uma array com objetos predefinidos, sem precisar que o usuário tenha que buscar toda vez no api
    {
        paperId: '64977465',
        title: 'Attention Is All You Need',
        authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
        year: 2017,
        abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
        journal: { name: 'Advances in Neural Information Processing Systems' },
        url: 'https://proceedings.neurips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf'
    },
    {
        paperId: '10978250',
        title: 'Deep Learning',
        authors: ['Yann LeCun', 'Yoshua Bengio', 'Geoffrey Hinton'],
        year: 2015,
        abstract: 'Deep learning allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction...',
        journal: { name: 'Nature' },
        url: 'https://www.nature.com/articles/nature14539'
    },
    {
        paperId: '87019572',
        title: 'A Survey on the Use of Artificial Intelligence for Digital Forensic Investigations',
        authors: ['F. G. C. de Morais', 'L. V. Santos', 'F. H. S. B. Filho', 'K. A. Santos'],
        year: 2021,
        abstract: 'The digital forensic investigation field has been evolving to keep up with advances in technology. Today, a lot of data is being collected from different devices and sources...',
        journal: { name: 'IEEE Access' },
        url: 'https://ieeexplore.ieee.org/abstract/document/9398846'
    },
    {
        paperId: '101037385',
        title: 'Redes neurais artificiais: uma abordagem prática utilizando Python e PyTorch',
        authors: ['W. W. Leal', 'A. J. C. D. de Menezes'],
        year: 2022,
        abstract: 'As redes neurais artificiais (RNAs) são algoritmos de aprendizado de máquina que têm se destacado em diversas áreas do conhecimento...',
        journal: { name: 'Revista Brasileira de Computação Aplicada' },
        url: 'http://seer.upf.br/index.php/rbca/article/view/11883/6837'
    },
    {
        paperId: '20230001',
        title: 'Análise de Sentimento em Redes Sociais com Aprendizagem Profunda',
        authors: ['Ana Lúcia da Silva', 'Carlos Eduardo Ferreira'],
        year: 2023,
        abstract: 'A análise de sentimento é uma área da mineração de texto que busca determinar a atitude emocional do autor em relação a um tópico...',
        journal: { name: 'Revista de Sistemas e Computação' },
        url: 'https://www.sbrp.org.br/revista/analise-de-sentimento'
    },
    {
        paperId: '9078',
        title: 'FUNDAMENTOS DA VISÃO COMPUTACIONAL: ARCABOUÇO TEÓRICO DO RECONHECIMENTO ARTIFICIAL DE IMAGENS E VÍDEOS',
        authors: ['F. A. L. Pimenta', 'B. A. M. Vasconcelos', 'V. A. P. P. Dantas'],
        year: 2024,
        abstract: 'Este artigo explora os fundamentos teóricos e a evolução da visão computacional, com foco no reconhecimento artificial de imagens e vídeos e suas aplicações.',
        journal: { name: 'Humanidades & Inovação' },
        url: 'https://revista.unitins.br/index.php/humanidadeseinovacao/article/view/9078'
    },
    {
        paperId: '1767',
        title: 'INTELIGÊNCIA ARTIFICIAL E BIG DATA NO ENSINO DE CIÊNCIAS: MODELAGEM COMPUTACIONAL E ANÁLISES DE DADOS',
        authors: ['Álaze Gabriel do Breviário', 'Denise Oliveira da Rosa', 'et al.'],
        year: 2025,
        abstract: 'Esta pesquisa investiga o impacto da integração de Inteligência Artificial e Big Data no ensino de Ciências, com foco na promoção de práticas pedagógicas mais inclusivas e personalizadas.',
        journal: { name: 'Revista Acadêmica de Tecnologias em Educação' },
        url: 'https://periodicos.unimesvirtual.com.br/index.php/tecnologias-em-edu/article/view/1767'
    },
    {
        paperId: 'arXiv:2508.20619',
        title: 'Efficient State Preparation for the Quantum Simulation of Molecules',
        authors: ['M. Klaiber', 'K. Z. Hatsagortsyan', 'C. H. Keitel'],
        year: 2025,
        abstract: 'This paper addresses the challenge of preparing complex quantum states for molecular simulations, a key step for practical quantum computing applications.',
        journal: { name: 'arXiv preprint' },
        url: 'https://arxiv.org/abs/2508.20619'
    },
    {
        paperId: '10.32604/jqc.2025.068127',
        title: 'Investigating Techniques to Optimise the Layout of Turbines in a Windfarm Using a Quantum Computer',
        authors: ['S. Alaboudi', 'et al.'],
        year: 2025,
        abstract: 'Este artigo explora como a computação quântica pode ser aplicada para otimizar o posicionamento de turbinas eólicas, um problema de otimização complexo.',
        journal: { name: 'Journal of Quantum Computing' },
        url: 'https://www.techscience.com/journal/jqc/article/32604/jqc.2025.068127'
    },
    {
        paperId: 'arXiv:2508.20627',
        title: 'A blueprint for error-corrected fermionic quantum processors',
        authors: ['A. R. S. Sankar', 'R. Dasgupta', 'S. Maity'],
        year: 2025,
        abstract: 'The present work proposes an approach to construct a fault-tolerant fermionic quantum processor which could serve as a potential platform for practical quantum computing.',
        journal: { name: 'arXiv preprint' },
        url: 'https://arxiv.org/abs/2508.20627'
    },
    {
        paperId: '497911',
        title: 'Primordial black holes in cosmological simulations',
        authors: ['Lewis R. Prole', 'John A. Regan', 'Daxal Mehta', 'Pratika Dayal'],
        year: 2025,
        abstract: 'This article uses cosmological simulations to study the growth of supermassive black holes from primordial black hole seeds, offering new insights into galaxy formation.',
        journal: { name: 'The Open Journal of Astrophysics' },
        url: 'https://astro.theoj.org/articles/10.21105/astro.2025.497911'
    },
    {
        paperId: '986423',
        title: 'Discrete element simulations of self-gravitating rubble pile collisions',
        authors: ['Job Guidos', 'Lucas Kolanz', 'Davide Lazzati'],
        year: 2025,
        abstract: 'A new code is developed to simulate the growth of granular masses, such as asteroids, through collisions of smaller particles.',
        journal: { name: 'The Open Journal of Astrophysics' },
        url: 'https://astro.theoj.org/articles/10.21105/astro.2025.986423'
    }
];

//lógica e busca

const searchArticles = async (query) => {   //função assíncrona que faz uma busca principal
    try { // essa estrutura protege o programa contra erros, trabalha com o catch e evita que essa aplicação nao funcione
        const url = `${SEMANTIC_SCHOLAR_API_URL}?query=${encodeURIComponent(query)}&fields=authors,year,abstract,journal,url,title`; //encodeURIComponent garante que a busca seja segura
        const response = await fetch(url); //chama a api

        if (!response.ok) { //verifica se a busca ocorreu perfeitamente, caso nao, retorna Erro na requisão
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const apiData = await response.json(); //pega a resposta da api com todas as informações que é em .json o responde le o corpo da resposta e transforma o json de uma string para um objeto javascript
        const articles = apiData.data || []; //extrai os arquivos da apiData e armazena em articles usamos o .data p obter array, testa a .data se for um valor falso, o primeiro valor é ignorado, grante que articles seja sempre um array

        const formattedArticles = articles.map(item => ({ //depois de receber a api, sao enviados pra ca e a função .map divide eles em novas listas no padrão que queremos. grantindo que todos os artigos tenham as mesmas informações.
            paperId: item.paperId,
            title: item.title || 'Título Desconhecido',
            authors: item.authors?.map(author => author.name) || ['Autores Desconhecidos'],
            year: item.year || 'Ano Desconhecido',
            abstract: item.abstract || 'Resumo Desconhecido',
            journal: item.journal?.name || 'Revista Desconhecida',
            url: item.url || '#'
        }));

        return formattedArticles;
    } catch (error) { //resposta do try, evita que o codigo bugue
        console.error("Falha ao buscar artigos:", error);
        return [];
    }
};

const loadDefaultArticles = () => { //retorna a lista predefinida
    return predefinedArticles;
};

// Funções de ordenação
const sortByYear = (articles) => {
    return [...articles].sort((a, b) => (b.year || 0) - (a.year || 0)); //usa o spread pra fazer uma cópia e aplica o sort, p ordenar da maneira que queremos, sem modificar o array original.
};

const sortByTitle = (articles) => { //mesmo padrão, unica diferença é que usamos a função localcompare p comparar textos de forma inteligente sem precisar utilizar comparadores lógicos
    return [...articles].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
};

const sortByAuthor = (articles) => { //mesmo esquema das duas ultimas sort
    return [...articles].sort((a, b) => {
        const authorA = a.authors?.[0] || '';
        const authorB = b.authors?.[0] || '';
        return authorA.localeCompare(authorB);
    });
};

const getReferenceABNT = article => { //formata o artigo em ABNT
    const authors = Array.isArray(article.authors) ? //verifica se de fato é uma array, se for, aplica as mudanças no nome dos autores
        article.authors.map(name => { 
            const parts = name.split(' '); //divide o nome dos autores essa função split
            const lastName = parts.pop().toUpperCase(); //essa função .pop pega o utlimo nome do autor e o transforma em letra maiuscula com o toUpperCase
            const firstNames = parts.map(n => n[0] + '.').join(' '); //reduzidos a iniciais
            return `${lastName}, ${firstNames}`;
        }).join('; ')//.join funciona para combinar os elementos de uma array em uma só string 
        : 'Autores Desconhecido' //caso contrario retorna autores desconhecidos 

        //verifica se tem titulo, nome da revista, e ano, caso contrario deixa todos como desconhecidos
    const title = article.title || 'Título Desconhecido';
    const journal = article.journal?.name || 'Revista Desconhecida';
    const year = article.year || 'Ano Desconhecido';

    return `${authors}. ${title}. ${journal}, ${year}.`; //retorna todas as informações juntas seguindo a orden da abnt
};

const listArticles = articles =>
    articles.map((article, index) => {
        const id = index + 1; //contagem de artigo, começa com 0 e vai aumentando
        const title = article.title || 'Título Desconhecido';
        const authors = Array.isArray(article.authors) ? article.authors.join(', ') : 'Autores Desconhecidos';
        const year = article.year || 'Ano Desconhecido';
        const journal = article.journal?.name || 'Revista Desconhecida'; //verifica se o objeto existe, se sim pega somente o nome da revista
        const abstract = article.abstract || 'Resumo Desconhecido';
        const articleUrl = article.url || '#';
        //todas essas funções ajudam a nao mostrar somente vazio para o usuario
        const abntRef = getReferenceABNT(article); //pega a função que criamos como referencia abnt e aplica a constanter article, parar criar para cada um dos artigos

        //essa parte mistura html
        //define uma caixa c o nome article-item, funciona como uma gaveta que abriga todos os detalhes de um artigo
        //primeiras informações engloba o id, o titulo do artigo junto c o link original
        //exibe os autores
        //exibe a revista
        //botao interativo e estilizado, esse onclick eh o que reconhece quando o usuario clica no mouse, basicmamente ele chama o index, pra saber exatamente qual artigo esta querendo mais informações
        //div cria outra caixa e o style diplay none transforma essa gaveta em uma gaveta invisivel que so eh mostrada c ajuda da função toggleDetails, e o torna visivel quando for clicado
        //dentro dessa gaveta invisivel, é guardado o ano, a sinopse do artigo, e a referencia abnt
        return ` 
            <div class="article-item">
                <p><strong>${id}. <a href="${articleUrl}" target="_blank">${title}</a></strong></p> 
                <p>Autores: ${authors}</p>
                <p>Revista: ${journal}</p>
                
                <button class="toggle-details-btn" onclick="toggleDetails(${index})">
                    <i class="fas fa-plus"></i> Mais informações
                </button>

                <div class="details" style="display: none;">
                    <p>Ano: ${year}</p>
                    <p>Sinopse: ${abstract}</p>
                    <p><strong>Referência ABNT:</strong> ${abntRef}</p>
                </div>
                <hr/>
            </div>
        `;
    }).join('');

//conta quantos artigos cada autor publicou
const countArticlesByAuthor = (articles) =>
    articles.reduce((acc, article) => { //utiliza o acc pra armazenar a contagem
        if (article.authors) {
            article.authors.forEach(author => {
                acc[author] = (acc[author] || 0) + 1
            });
        }
        return acc;
    }, {});

// transforma nossas funções em ferramentas uteis, podendo exportar elas pra qualquer outro arquivo.
export const repositorio = {
    searchArticles,
    loadDefaultArticles,
    listArticles,
    countArticlesByAuthor,
    sortByYear,
    sortByTitle,
    sortByAuthor
};
