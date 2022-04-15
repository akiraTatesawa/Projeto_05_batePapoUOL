let usuario; //Objeto
let conexao; //Intervalo
let atualizaMensagens; //Intervalo

function carregaMensagens (response) {
    const campoMensagens = document.querySelector(".mensagens");
    campoMensagens.innerHTML = "";
    for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].type === "status") {
            campoMensagens.innerHTML += `
            <div class="mensagem status">
                <p>
                    <span class="horario">${response.data[i].time}</span>
                    <span class="usuario">${response.data[i].from}</span> ${response.data[i].text}
                </p>
            </div>`
        }
        if (response.data[i].type === "message") {
            campoMensagens.innerHTML += `
            <div class="mensagem normal">
                <p>
                    <span class="horario">${response.data[i].time} </span>
                    <span class="usuario">${response.data[i].from}</span> para <span class="destinatario">${response.data[i].to}</span>: ${response.data[i].text}
                </p>
            </div>`
        }
        if (response.data[i].type === "private_message") {
            campoMensagens.innerHTML += `
            <div class="mensagem reservada">
                <p>
                <span class="horario">${response.data[i].time}</span>
                    <span class="usuario">${response.data[i].from}</span> reservadamente para <span class="destinatario">${response.data[i].to}</span>: ${response.data[i].text}
                </p>
            </div>`
        }
    }
    campoMensagens.scrollIntoView(false);
}

function buscaMensagens () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(carregaMensagens);
    atualizaMensagens = setInterval(function () {
        const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
        promise.then(carregaMensagens);
        }, 2500);
}

function entrarSala () {
    const usuarioNome = document.querySelector(".login").value;
    const usuario = {
        name: usuarioNome
    };
    return usuario;
}

function loginSucesso () {
    buscaMensagens();
    console.log("Deu certo! Bem-vindo!");
    document.querySelector(".tela-entrada").classList.add("escondido");
    mantemConexao(usuario);
}

function loginError () {
    alert("Este nome já está sendo usado ou é um nome inválido. Digite outro!");
    window.location.reload();
}

function verificaUsuario () {
    usuario = entrarSala();

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);

    document.querySelector(".tela-entrada").innerHTML = `
    <img src="./media/logo 2.png" class="logo-entrada" alt="Logomarca do Bate-Papo UOL" />
    <img src="./media/loading-gif-transparent-10.gif" class="loading" alt="GIF de loading" />
    <p>Entrando</p>`

    promise.then(loginSucesso);
    promise.catch(loginError);
}

function mantemConexao (usuario) {
    conexao = setInterval(function () {
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
        console.log("Ainda está online!")
    }, 3000);
}

function abreMenu () {
//  Retirar a classe "escondido" da tela preta e do menu;
    const telaPreta = document.querySelector(".tela-preta");
    const menuLateral = document.querySelector(".menu-lateral");
    const body = document.querySelector("body")
    
    body.classList.add("tira-scroll");
    telaPreta.classList.remove("escondido");
    menuLateral.classList.add("menu-lateral-transition");
    menuLateral.classList.add("coloca-scroll");
}

function fechaMenu() {
//  Adiciona a classe "escondido" na tela preta e no menu
    const telaPreta = document.querySelector(".tela-preta");
    const menuLateral = document.querySelector(".menu-lateral");
    const body = document.querySelector("body")
    body.classList.remove("tira-scroll");
    telaPreta.classList.add("escondido");
    menuLateral.classList.remove("menu-lateral-transition");
}

function enviaMensagem () {

    const textoMensagem = document.querySelector(".campo-mensagem").value;
    if (textoMensagem === "") {
        return;
    }

    const mensagem = {
        from: usuario.name,
        to: "Todos",
        text: textoMensagem,
        type: "message"
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    promise.then(carregaMensagens);
    promise.catch(function () {
        window.location.reload();
        console.log("falhou");
    });

    document.querySelector(".campo-mensagem").value = "";
}

//Envia com enter
const input = document.querySelector(".campo-mensagem");
input.addEventListener("keydown", function(e){
    if (e.key === "Enter") {
        document.querySelector(".send").click();
    }
});
const inputLogin = document.querySelector(".login");
inputLogin.addEventListener("keydown", function(e){
    if (e.key === "Enter") {
        document.querySelector(".login-enter").click();
    }
});

