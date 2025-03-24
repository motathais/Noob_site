import { API_BASE_URL } from './config/config.js';

document.getElementById('btnLogin').addEventListener('click', async function (event) {
    event.preventDefault(); // Evita o envio do formulário padrão

    try {
        // Obtém os valores dos campos do formulário
        const apelido = document.getElementById('apelido').value;
        const senha = document.getElementById('senha').value;

        // Verifica se os campos foram preenchidos
        if (!apelido || !senha) {
            return alert('Por favor, preencha o apelido e a senha.');
        }

        // Constrói o objeto de dados a ser enviado
        const data = { apelido, senha };

        // Realiza a solicitação POST usando fetch
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Trata os possíveis erros da resposta
        if (!response.ok) {
            const errorData = await response.json();
            return alert(errorData.msg || 'Erro ao fazer login.');
        }

        // Processa a resposta em JSON
        const responseData = await response.json();

        const { usuario, token } = responseData;

        // Armazena os dados no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('login', apelido);
        localStorage.setItem('id', usuario.id);

        alert('Usuário logado com sucesso!');

        // Redireciona para a página de lista de jogos
        window.location.href = '../paginas/lista-jogos.html';

    } catch (error) {
        console.error('Erro ao tentar realizar o login:', error);
        alert('Erro inesperado. Tente novamente mais tarde.');
    }
});



