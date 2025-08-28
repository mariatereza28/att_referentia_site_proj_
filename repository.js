// repository.js

const SEMANTIC_SCHOLAR_API_URL = "https://api.semanticscholar.org/graph/v1/paper/search";

const predefinedArticles = [
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
    }
];

const searchArticles = async (query) => {
    try {
        const url = `${SEMANTIC_SCHOLAR_API_URL}?query=${encodeURIComponent(query)}&fields=authors,year,abstract,journal,url,title`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const apiData = await response.json();
        const articles = apiData.data || [];

        const formattedArticles = articles.map(item => ({
            paperId: item.paperId,
            title: item.title || 'Título Desconhecido',
            authors: item.authors?.map(author => author.name) || ['Autores Desconhecidos'],
            year: item.year || 'Ano Desconhecido',
            abstract: item.abstract || 'Resumo Desconhecido',
            journal: item.journal?.name || 'Revista Desconhecida',
            url: item.url || '#'
        }));

        return formattedArticles;
    } catch (error) {
        console.error("Falha ao buscar artigos:", error);
        return [];
    }
};

const loadDefaultArticles = () => {
    return predefinedArticles;
};

// Funções de ordenação
const sortByYear = (articles) => {
    return [...articles].sort((a, b) => (b.year || 0) - (a.year || 0));
};

const sortByTitle = (articles) => {
    return [...articles].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
};

const sortByAuthor = (articles) => {
    return [...articles].sort((a, b) => {
        const authorA = a.authors?.[0] || '';
        const authorB = b.authors?.[0] || '';
        return authorA.localeCompare(authorB);
    });
};

const getReferenceABNT = article => {
    const authors = Array.isArray(article.authors) ?
        article.authors.map(name => {
            const parts = name.split(' ');
            const lastName = parts.pop().toUpperCase();
            const firstNames = parts.map(n => n[0] + '.').join(' ');
            return `${lastName}, ${firstNames}`;
        }).join('; ')
        : 'AUTORES DESCONHECIDOS';

    const title = article.title || 'Título Desconhecido';
    const journal = article.journal?.name || 'Revista Desconhecida';
    const year = article.year || 'Ano Desconhecido';

    return `${authors}. ${title}. ${journal}, ${year}.`;
};

const listArticles = articles =>
    articles.map((article, index) => {
        const id = index + 1;
        const title = article.title || 'Título Desconhecido';
        const authors = Array.isArray(article.authors) ? article.authors.join(', ') : 'Autores Desconhecidos';
        const year = article.year || 'Ano Desconhecido';
        const journal = article.journal?.name || 'Revista Desconhecida';
        const abstract = article.abstract || 'Resumo Desconhecido';
        const articleUrl = article.url || '#';

        const abntRef = getReferenceABNT(article);

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
const countArticlesByAuthor = (articles) =>
    articles.reduce((acc, article) => {
        if (article.authors) {
            article.authors.forEach(author => {
                acc[author] = (acc[author] || 0) + 1
            });
        }
        return acc;
    }, {});


export const repositorio = {
    searchArticles,
    loadDefaultArticles,
    listArticles,
    countArticlesByAuthor,
    sortByYear,
    sortByTitle,
    sortByAuthor
};