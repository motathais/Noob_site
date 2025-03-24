import { API_BASE_URL } from './config/config.js';

document.getElementById('cadastroUsuarios').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome-usuario').value;
    const apelido = document.getElementById('apelido-usuario').value;
    const nascimento = document.getElementById('nascimento-usuario').value;
    const email = document.getElementById('email-usuario').value;
    const senha = document.getElementById('senha-usuario').value;
    const confirmacao = document.getElementById('confirmacao').value;
    const foto = document.getElementById('foto-usuario').files[0];
    const capa = document.getElementById('capa-usuario').files[0];
    const formulario = document.getElementById('cadastroUsuarios');

    // Validar se os campos obrigatórios estão preenchidos
    if (!nome || !apelido || !email || !senha || !confirmacao) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Validar se a senha e a confirmação são iguais
    if (senha !== confirmacao) {
        alert('As senhas não coincidem.');
        return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('apelido', apelido);
    formData.append('nascimento', nascimento);
    formData.append('email', email);
    formData.append('senha', senha);
    if (foto) {
        formData.append('foto', foto);
    }
    if (foto) {
        formData.append('capa', capa);
    }

    console.log('Form Data:', formData); // Log para depuração

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            return alert(errorMessage.message);
        }

        alert('Usuário cadastrado com sucesso!');
        
       
        formulario.reset();
            
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar usuário');
    }
});

document.getElementById('foto-usuario').onchange = function (evt) {
    previewImage(evt, 'preview');
};

document.getElementById('capa-usuario')?.addEventListener('change', function (evt) {
    previewImage(evt, 'preview');
});

function previewImage(evt, previewId) {
    const files = evt.target.files;

    if (FileReader && files && files.length) {
        const fr = new FileReader();
        fr.onload = function () {
            const img = document.getElementById(previewId);
            img.src = fr.result;
            img.style.display = 'block';
        }
        fr.readAsDataURL(files[0]);
    }
}