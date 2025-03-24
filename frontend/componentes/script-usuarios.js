document.getElementById('cadastroUsuarios').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome-usuario').value;
    const apelido = document.getElementById('apelido-usuario').value;
    const nascimento = document.getElementById('nascimento-usuario').value;
    const email = document.getElementById('email-usuario').value;
    const senha = document.getElementById('senha-usuario').value;
    const confirmacao = document.getElementById('confirmacao').value;
    const foto = document.getElementById('foto-usuario').files[0];
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
        formData.append('file', foto);
    }

    console.log('Form Data:', formData); // Log para depuração

    try {
        const response = await fetch('https://noob-api-1.onrender.com/api/usuarios', {
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
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // Verifica se foi selecionada alguma imagem
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            var img = document.getElementById('preview');
            img.src = fr.result;
            img.style.display = 'block'; // Exibe a imagem
        }
        fr.readAsDataURL(files[0]);
    }
};