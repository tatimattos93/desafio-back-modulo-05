const yup = require('./configuracaoyup');

const validaCamposCadastro = yup.object().shape({
    nome: yup.string().min(3, { message: "O campo nome é obrigatório." })
        .required({ message: "O campo nome é obrigatório." }),
    email: yup.string().email({ message: "Formato de e-mail inválido." })
        .required({ message: "O campo e-mail é obrigatório." }),
    senha: yup.string().required({ message: "O campo senha é obrigatório" })
        .min(6, { message: "A senha deve conter no mínimo 6 caracteres." })
});

const validaCamposEditar = yup.object().shape({
    nome: yup.string().min(3, { message: "Formato do nome inválido." })
        .required("O campo nome é obrigatório."),
    email: yup.string().email({ message: "Formato de e-mail inválido." })
        .required({ message: "O campo e-mail é obrigatório." }),
    senha: yup.string().min(6, { message: "A senha deve conter no mínimo 6 caracteres." })
});

const validaCamposMinCaracteres = yup.object().shape({
    cpf: yup.string().min(11, { message: "CPF deve conter 11 dígitos." }).nullable(),
    telefone: yup.string().min(8, {message: "Telefone inválido."}).nullable()
});

const validaCampoEmail = yup.object().shape({
    email: yup.string().email({ message: "Formato de e-mail inválido." })
});

module.exports = {
    validaCamposCadastro,
    validaCamposEditar,
    validaCamposMinCaracteres,
    validaCampoEmail
}