document.addEventListener('DOMContentLoaded', function() {
    const cabecalhoContainer = document.querySelector('header');
    fetch('../complementos/header.html')
    .then(response => response.text())
    .then(html => {
        cabecalhoContainer.innerHTML = html;
        executeScripts(cabecalhoContainer);

        const usuario = localStorage.getItem('login'); // Contém o nome do usuário logado

        const seLogadoLogin = document.getElementById('seLogado-login');
        const seDeslogadoLogin = document.getElementById('seDeslogado-login');
        const seLogadoLinks = document.getElementById('seLogado-links');
        const seDeslogadoLinks = document.getElementById('seDeslogado-links');

        if (usuario) {
            seLogadoLogin.classList.remove('visibilidade');
            seDeslogadoLogin.classList.add('visibilidade');
            seLogadoLinks.classList.remove('visibilidade');
            seDeslogadoLinks.classList.add('visibilidade');

            seLogadoLogin.querySelector('#nome').innerText = `, ${usuario}`; // nome do usuário

            const sair = document.getElementById('logout');
            sair.addEventListener('click', () => {
                localStorage.removeItem('login');
                window.location.reload();
            })
        } else {
            seLogadoLogin.classList.add('visibilidade');
            seDeslogadoLogin.classList.remove('visibilidade');
            seLogadoLinks.classList.add('visibilidade');
            seDeslogadoLinks.classList.remove('visibilidade');

            const scriptLogin = document.createElement('script');
            scriptLogin.src = '../componentes/script-login.js';
            scriptLogin.type = 'module'; // Torna o script um módulo
            document.body.appendChild(scriptLogin);
        }
    });

    function executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
        });
    }

    window.toggleMenu = function() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        dropdownMenu.classList.toggle('visibilidade');
    };


});