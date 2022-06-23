const yup = require('./configuracaoyup');

const validaCamposEmailSenha = yup.object().shape({
    email: yup.string().email("Formato de e-mail inválido").required("O campo e-mail é obrigatório."),
    senha: yup.string().required("O campo senha é obrigatório")
});

module.exports = {
    validaCamposEmailSenha
}