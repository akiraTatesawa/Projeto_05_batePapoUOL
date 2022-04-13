let usuario; //Objeto
let conexao; //setInterval

function entrarSala () {
    const usuarioNome = prompt("Digite o seu nome:");
    const usuario = {
        name: usuarioNome
    }
    return usuario;
}

function loginSucesso () {
    console.log("Deu certo! Bem-vindo!");
    mantemConexao(usuario);
}

function loginError () {
    alert("Este nome já está sendo usado!");
    verificaUsuario();
}

function verificaUsuario () {
    usuario = entrarSala();
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    promise.then(loginSucesso);
    promise.catch(loginError);
}

function mantemConexao (usuario) {
    conexao = setInterval(function () {
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario)
        console.log("Ainda está online!")
    }, 3000)
}

verificaUsuario();
