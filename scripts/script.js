function entrarSala () {
    const usuario = prompt("Digite o seu nome:");
    const usuarioObj = {
        name: usuario
    }
    return usuarioObj;
}

function loginSucesso (response, usuario) {
    console.log("Deu certo! Bem-vindo!");
}

function loginError (erro) {
    alert("Este nome já está sendo usado!");
    verificaUsuario();
}

function verificaUsuario () {
    const usuario = entrarSala();
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    promise.then(loginSucesso);
    promise.catch(loginError);
}

verificaUsuario();
