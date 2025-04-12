function mostrarCadastro() {
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('cadastro-page').classList.add('active');
}
function fazerCadastro() {
    const nome = document.getElementById('cadastro-nome').value;
    const senha = document.getElementById('cadastro-senha').value;
    const cpf = document.getElementById('cadastro-cpf').value;
    const telefone = document.getElementById('cadastro-telefone').value;
    const endereco = document.getElementById('cadastro-endereco').value;

    if (nome && senha && cpf && telefone && endereco) {
        const usuario = {
            nome,
            senha,
            cpf,
            telefone,
            endereco
        };

        localStorage.setItem('usuario', JSON.stringify(usuario));
        alert('Cadastro realizado com sucesso!');
        document.getElementById('cadastro-page').classList.remove('active');
        document.getElementById('login-page').classList.add('active');
    } else {
        alert('Preencha todos os campos.');
    }
}


function fazerLogin() {
    const nome = document.getElementById('login-nome').value;
    const senha = document.getElementById('login-senha').value;
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario && nome === usuario.nome && senha === usuario.senha) {
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('main-page').classList.add('active');

        // Exibir dados do usuário
        document.getElementById('info-nome').textContent = usuario.nome;

        const cpfEl = document.getElementById('info-cpf');
        const telEl = document.getElementById('info-telefone');
        const endEl = document.getElementById('info-endereco');

        cpfEl.setAttribute('data-original', usuario.cpf);
        telEl.setAttribute('data-original', usuario.telefone);
        endEl.setAttribute('data-original', usuario.endereco);

        // Exibe de forma mascarada inicialmente
        cpfEl.textContent = usuario.cpf.replace(/.(?=.{4})/g, "*");
        telEl.textContent = usuario.telefone.replace(/.(?=.{4})/g, "*");
        endEl.textContent = usuario.endereco.replace(/.(?=.{4})/g, "*");

    } else {
        alert('Nome ou senha incorretos.');
    }
}


const itens = [];

function adicionarItem() {
    const nome = document.getElementById('item-nome').value;
    const modelo = document.getElementById('item-modelo').value;
    const data = document.getElementById('item-data').value;
    const desc = document.getElementById('item-desc').value;

    if (nome && modelo && data && desc) {
        const item = { nome, modelo, data, desc };
        itens.push(item);

        const itemEl = document.createElement('div');
        itemEl.innerHTML = `
        `;
        document.getElementById('lista-itens').appendChild(itemEl);

        document.getElementById('item-nome').value = '';
        document.getElementById('item-modelo').value = '';
        document.getElementById('item-data').value = '';
        document.getElementById('item-desc').value = '';

        atualizarResumo();
    } else {
        alert('Preencha todos os campos.');
    }
}

function atualizarResumo() {
    const resumo = document.getElementById('resumo-texto');
    if (itens.length === 0) {
        resumo.textContent = 'Nenhum item cadastrado ainda.';
    } else {
        resumo.innerHTML = itens.map((item, index) =>
            `${index + 1}. ${item.nome} - Modelo: ${item.modelo} - Data: ${item.data}`
        ).join('<br>');
    }
}

function carregarImagem(event) {
    const preview = document.getElementById('preview');
    preview.src = URL.createObjectURL(event.target.files[0]);
}
let dadosVisiveis = false;

function toggleSensivel() {
    const elementos = document.querySelectorAll('.sensitive');

    elementos.forEach(el => {
        if (dadosVisiveis) {
            const textoOriginal = el.getAttribute('data-original');
            el.textContent = textoOriginal.replace(/.(?=.{4})/g, "*"); // mostra só últimos 4 caracteres
        } else {
            el.textContent = el.getAttribute('data-original');
        }
    });

    dadosVisiveis = !dadosVisiveis;
}

function abrirModal() {
    const modal = document.getElementById("modal-consulta");
    const tabela = document.getElementById("tabela-produtos");

    if (itens.length === 0) {
        tabela.innerHTML = "<p>Nenhum produto cadastrado ainda.</p>";
    } else {
        let html = `
    <table>
        <tr>
            <th>Nome</th>
            <th>Modelo</th>
            <th>Data</th>
            <th>Descrição</th>
        </tr>
`;

        itens.forEach(item => {
            html += `
        <tr>
            <td>${item.nome}</td>
            <td>${item.modelo}</td>
            <td>${item.data}</td>
            <td>${item.desc}</td>
        </tr>
    `;
        });

        html += "</table>";
        tabela.innerHTML = html;
    }

    modal.style.display = "block";
}

function fecharModal() {
    document.getElementById("modal-consulta").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("modal-consulta");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
// Máscara para CPF
document.addEventListener('input', function (e) {
    if (e.target.id === 'cadastro-cpf') {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = v;
    }

    // Máscara para Telefone
    if (e.target.id === 'cadastro-telefone') {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length <= 10) {
            v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        e.target.value = v;
    }
});