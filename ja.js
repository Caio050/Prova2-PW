// Credenciais fixas
const USER = 'admin';
const PASS = '1234';

// Controle de Sessão
let sessionTimer;

function login() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if (u === USER && p === PASS) {
        localStorage.setItem('logado', 'true');
        window.location.href = 'cadastro.html';
    } else {
        document.getElementById('login-error').innerText = 'Usuário ou senha incorretos.';
    }
}

function logout() {
    localStorage.removeItem('logado');
    window.location.href = 'index.html';
}

function checkSession() {
    if (localStorage.getItem('logado') !== 'true') {
        window.location.href = 'index.html';
    }
    carregar();
    resetSessionTimer();
    document.addEventListener('click', resetSessionTimer);
    document.addEventListener('keydown', resetSessionTimer);
}

function resetSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
        alert('Sessão expirada por inatividade.');
        logout();
    }, 5 * 60 * 1000); // 5 minutos
}

// Navegação
function showSection(id) {
    document.getElementById('cadastro').style.display = 'none';
    document.getElementById('lista').style.display = 'none';
    document.getElementById(id).style.display = 'block';
}

// Buscar CEP
function buscarCEP() {
    const cep = document.getElementById('cep').value;
    if (cep.length !== 8) return;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            alert('CEP não encontrado.');
            return;
        }
        const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        document.getElementById('endereco').value = endereco;
    });
}

// Cadastro
function cadastrar() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cep = document.getElementById('cep').value.trim();
    const endereco = document.getElementById('endereco').value.trim();

    const erro = document.getElementById('cadastro-error');
    erro.innerText = '';

    if (!nome || !email || !cep || !endereco) {
        erro.innerText = 'Preencha todos os campos.';
        return;
    }

    const lista = JSON.parse(localStorage.getItem('voluntarios')) || [];

    if (lista.some(v => v.email.toLowerCase() === email.toLowerCase())) {
        erro.innerText = 'E-mail já cadastrado.';
        return;
    }

    const voluntario = { nome, email, endereco, cep };
    lista.push(voluntario);
    localStorage.setItem('voluntarios', JSON.stringify(lista));

    // Limpa os campos
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('cep').value = '';
    document.getElementById('endereco').value = '';

    carregar();
    showSection('lista');
}


// Carregar Cards
function carregar() {
    const container = document.getElementById('cards-container');
    if (!container) return;

    container.innerHTML = '';
    const lista = JSON.parse(localStorage.getItem('voluntarios')) || [];

    lista.forEach((v, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = `https://source.unsplash.com/160x160/?voluntario,${v.nome}`;
        img.width = 60;

        const div = document.createElement('div');
        div.className = 'card-content';
        div.innerHTML = `<strong>${v.nome}</strong><br>${v.email}<br>${v.endereco}`;

        const btn = document.createElement('button');
        btn.innerText = 'Excluir';
        btn.onclick = () => excluir(index);

        card.appendChild(img);
        card.appendChild(div);
        card.appendChild(btn);

        container.appendChild(card);
    });
}


// filtrar os voluntarios

function filtrar() {
    const filtro = document.getElementById('filtro').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const nome = card.querySelector('.card-content').innerText.toLowerCase();
        card.style.display = nome.includes(filtro) ? 'flex' : 'none';
    });
}

// Excluir individual
function excluir(index) {
    const lista = JSON.parse(localStorage.getItem('voluntarios')) || [];
    lista.splice(index, 1);
    localStorage.setItem('voluntarios', JSON.stringify(lista));
    carregar();
}

// Limpar tudo
function limparTudo() {
    if (confirm('Deseja realmente apagar todos os cadastros?')) {
        localStorage.removeItem('voluntarios');
        carregar();
    }
}
