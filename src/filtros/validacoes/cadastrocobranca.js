const yup = require('./configuracaoyup');

const validaCamposCadastro = yup.object().shape({
    descricao: yup.string().required({message:"O campo descrição é obrigatório."}),
    status: yup.string().required({message:"O campo status é obrigatório"}),
    valor: yup.number().positive({message: "Aceito somente valores positivos."})
    .required({message:"O campo valor é obrigatório"}),
    vencimento: yup.date().required({message: "O campo data é obrigatório."})
   
});

module.exports = {
    validaCamposCadastro
}