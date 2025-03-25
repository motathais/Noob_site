import { API_BASE_URL } from './config/config.js';

const itemsPerPage = 15;
let currentPage = 1;
let items = [];

// Função para buscar os itens da API
async function fetchItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/jogos`);
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        items = await response.json();
        renderItems();
        renderCategoriaCheckboxes();
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
    }
}

// Função para renderizar os itens na lista
function renderItems(filteredItems = items) {
    const listaJogo = document.getElementById('lista-jogo');
    listaJogo.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    currentItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'jogo-item';

        const imgSrc = item.capa || '../../backend/uploads/1714174787744.jpg';
        const categoria = item.categoria || '(categoria não informada)';

        itemElement.innerHTML = `
            <a href="jogo.html?id=${item._id}">
                <img src="${imgSrc}" alt="${item.titulo}">
                <h3>${item.titulo}</h3>
                <p>${categoria}</p>
            </a>
        `;

        listaJogo.appendChild(itemElement);
    });

    renderPagination(filteredItems.length);
}

// Função para renderizar a paginação
function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.disabled = i === currentPage;
        button.addEventListener('click', () => {
            currentPage = i;
            renderItems();
        });
        pagination.appendChild(button);
    }
}

// Função para renderizar os checkboxes de categoria dinamicamente
function renderCategoriaCheckboxes() {
    const checkboxContainer = document.getElementById('checkboxContainer');
    checkboxContainer.innerHTML = '';

    // Obter todas as categorias únicas, incluindo os sem categoria
    const categoriasSet = new Set(items.map(item => item.categoria));
    const categorias = Array.from(categoriasSet);
    
    // Verificar se há algum item com categoria vazia ("")
    const semCategoriaCount = items.filter(item => item.categoria === "").length;

    if (categorias.length > 0 || semCategoriaCount > 0) {
        categorias.forEach(categoria => {
            if (categoria !== "") {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = categoria.toLowerCase().replace(/\s/g, '-');
                checkbox.value = categoria;
                checkbox.addEventListener('change', () => {
                    filterByCategoria();
                });

                const label = document.createElement('label');
                label.htmlFor = categoria.toLowerCase().replace(/\s/g, '-');
                const count = countItemsByCategoria(categoria);
                label.textContent = `${categoria} (${count})`;

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                checkboxContainer.appendChild(document.createElement('br'));
            }
        });

        if (semCategoriaCount > 0) {
            const semCategoriaCheckbox = document.createElement('input');
            semCategoriaCheckbox.type = 'checkbox';
            semCategoriaCheckbox.id = 'sem-categoria';
            semCategoriaCheckbox.value = '';
            semCategoriaCheckbox.addEventListener('change', () => {
                filterByCategoria();
            });

            const semCategoriaLabel = document.createElement('label');
            semCategoriaLabel.htmlFor = 'sem-categoria';
            semCategoriaLabel.textContent = `Não informada (${semCategoriaCount})`;

            checkboxContainer.appendChild(semCategoriaCheckbox);
            checkboxContainer.appendChild(semCategoriaLabel);
            checkboxContainer.appendChild(document.createElement('br'));
        }
    } else {
        // Caso não haja categorias nem sem categoria
        const semCategoriaLabel = document.createElement('label');
        semCategoriaLabel.textContent = 'Não há categorias disponíveis';

        checkboxContainer.appendChild(semCategoriaLabel);
    }
}

// Função para contar itens por categoria
function countItemsByCategoria(categoria) {
    return items.filter(item => item.categoria === categoria).length;
}

// Função para filtrar por categoria
function filterByCategoria() {
    const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]');
    const categoriasSelecionadas = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    if (categoriasSelecionadas.length === 0) {
        renderItems(items);
    } else {
        const filteredItems = items.filter(item => categoriasSelecionadas.includes(item.categoria));
        renderItems(filteredItems);
    }
}

// Função para filtrar itens por título
const filtroPorTitulo = document.getElementById('filtroTitulo');
filtroPorTitulo.addEventListener('input', async () => {
    const filtro = filtroPorTitulo.value.toLowerCase();
    const itemsFiltrados = items.filter(item => item.titulo.toLowerCase().includes(filtro));
    currentPage = 1; // Resetar para a primeira página ao aplicar o filtro
    renderItems(itemsFiltrados);
});

// Event listener para o botão "Limpar Filtros"
const btnLimparFiltros = document.getElementById('limparFiltros');
btnLimparFiltros.addEventListener('click', limparFiltros);

// Função para limpar todos os filtros
function limparFiltros() {
    // Limpar filtro por título
    document.getElementById('filtroTitulo').value = '';

    // Desmarcar todos os checkboxes de categoria
    const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Re-renderizar a lista de jogos sem filtros
    renderItems();
}

// Função para abrir e fechar o modal de cadastro
const modal = document.getElementById('modal');
const btnCadastrarJogo = document.getElementById('cadastrar-jogo');
const btnCancelarJogo = document.getElementById('btnCancelarJogo');

btnCadastrarJogo.addEventListener('click', () => {
    modal.style.display = 'block';
});

btnCancelarJogo.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Função para adicionar um novo jogo (envio do formulário)
const formCadastroJogos = document.getElementById('cadastroJogos');
const btnAdicionarJogo = document.getElementById('btnCadastrarJogo');

btnAdicionarJogo.addEventListener('click', async () => {
    // Aqui você pode implementar o código para enviar os dados do formulário para a API
    // Exemplo básico de envio de dados (você precisa ajustar conforme sua API)
    const novoJogo = {
        titulo: document.getElementById('titulo-jogo').value,
        ano: document.getElementById('ano-jogo').value,
        idade: document.getElementById('idade-recomendada-jogo').value,
        designer: document.getElementById('designer-jogo').value,
        artista: document.getElementById('artista-jogo').value,
        editora: document.getElementById('editora-jogo').value,
        digital: document.getElementById('digital-jogo').value,
        categoria: document.getElementById('categoria-jogo').value,
        componentes: document.getElementById('componentes-jogo').value,
        descricao: document.getElementById('descricao-jogo').value
        // Adicione mais campos conforme necessário
    };

    try {
        const response = await fetch('https://api-noob-1.onrender.com/api/jogos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoJogo)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar jogo');
        }

        // Se cadastrado com sucesso, recarregar os itens
        await fetchItems();
        modal.style.display = 'none'; // Fechar o modal após cadastrar

    } catch (error) {
        console.error('Erro ao cadastrar jogo:', error);
    }
});

// Carregar os itens ao iniciar a página
document.addEventListener('DOMContentLoaded', fetchItems);
