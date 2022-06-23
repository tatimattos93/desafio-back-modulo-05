const yup = require('./configuracaoyup');

const validaCamposCadastro = yup.object().shape({
    nome: yup.string().min(3, {message:"O campo nome é obrigatório."})
    .required({message:"O campo nome é obrigatório."}),
    email: yup.string().email({message:"Formato de e-mail inválido."})
    .required({message:"O campo e-mail é obrigatório."}),
    cpf: yup.string().min(11, {message:"CPF deve conter 11 dígitos."})
    .required({message:"O campo CPF é obrigatório"}),
    telefone: yup.string().min(8, {message:"Telefone inválido."})
    .required({message:"O campo telefone é obrigatório"}),
});

module.exports = {
    validaCamposCadastro
}