let usuario; //Objeto
let conexao; //Intervalo
let atualizaMensagens; //Intervalo
let visibilidade = "message"; //Visibilidade da mensagem
let recebe = "Todos"; //Destinatário

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
        if (ehMsgReservada(response.data[i])) {
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

function ehMsgReservada (mensagem) {
    if ((mensagem.type === "private_message") && (mensagem.to === usuario.name || mensagem.from === usuario.name || mensagem.to === "Todos")) {
        return true;
    } 
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

function carregaParticipantes (response) {
    const campoParticipantes = document.querySelector(".participantes");
    campoParticipantes.innerHTML = "";
    campoParticipantes.innerHTML += `
        <div class="item-menu-lateral" onclick="registraDestinatario(this)">
            <ion-icon name="people" class="icone-participantes"></ion-icon>
            <span>Todos</span>
            <ion-icon name="checkmark-outline" class="checkmark"></ion-icon>
        </div>`;
    for (let i = 0; i < response.data.length; i++) {
        campoParticipantes.innerHTML += `
        <div class="item-menu-lateral" onclick="registraDestinatario(this)">
            <ion-icon name="person-circle" class="icone-participantes"></ion-icon>
            <span>${response.data[i].name}</span>
            <ion-icon name="checkmark-outline" class="checkmark"></ion-icon>
        </div>`;
    }
}

function buscaParticipantes () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(carregaParticipantes);
    setInterval(function () {
        const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
        promise.then(carregaParticipantes);
    }, 9000);
}

function abreMenu () {
    const telaPreta = document.querySelector(".tela-preta");
    const menuLateral = document.querySelector(".menu-lateral");
    const body = document.querySelector("body")
    
    body.classList.add("tira-scroll");
    telaPreta.classList.remove("escondido");
    menuLateral.classList.add("menu-lateral-transition");

    buscaParticipantes();
}

function fechaMenu() {
    const telaPreta = document.querySelector(".tela-preta");
    const menuLateral = document.querySelector(".menu-lateral");
    const body = document.querySelector("body")
    body.classList.remove("tira-scroll");
    telaPreta.classList.add("escondido");
    menuLateral.classList.remove("menu-lateral-transition");
}

function check(el, classe) {
    const selecionado = document.querySelector(classe);

    if (selecionado) {
        selecionado.classList.remove("selecionado");
        selecionado.querySelector(".checkmark").classList.remove("aparece");
    }

    el.classList.add("selecionado");
    el.querySelector(".checkmark").classList.add("aparece");
}

function alteraDescricao (visibilidade, recebe) {
    const descricaoMensagem = document.querySelector(".descricao-mensagem");

    if (visibilidade === "message") {
        descricaoMensagem.innerHTML = `Enviando para ${recebe}`;
    }
    if (visibilidade === "private_message") {
        descricaoMensagem.innerHTML = `Enviando para ${recebe} (reservadamente)`;
    }
}

function registraVisibilidade (el) {
    const classe = ".visibilidades .selecionado";
    check(el, classe);

    const opcao = el.querySelector("span").innerHTML;
    console.log(opcao);

    if (opcao === "Reservadamente") {
        visibilidade = "private_message";
    } else {
        visibilidade = "message";
    }
    alteraDescricao(visibilidade, recebe);
}

function registraDestinatario (el) {
    const classe = ".participantes .selecionado";
    check(el, classe);

    recebe = el.querySelector("span").innerHTML;
    console.log(recebe);
    alteraDescricao(visibilidade, recebe);
}

function enviaMensagem () {
    const textoMensagem = document.querySelector(".campo-mensagem").value;
    
    //Impede o envio de mensagens em branco
    if(textoMensagem.trim().length === 0) {
        document.querySelector(".campo-mensagem").value = "";
        return;
    }

    const mensagem = {
        from: usuario.name,
        to: recebe,
        text: textoMensagem,
        type: visibilidade
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    promise.then(carregaMensagens);
    promise.catch(function () {
        window.location.reload();
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

