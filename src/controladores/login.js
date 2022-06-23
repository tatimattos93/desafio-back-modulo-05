const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validaCamposEmailSenha} = require('../filtros/validacoes/validaemailsenha');

const login = async (req, res) => {
    const {email, senha} = req.body

    try {
        await validaCamposEmailSenha.validate(req.body);

        const usuarioExiste = await knex('usuarios')
        .where({email})
        .first();

        if(!usuarioExiste){
            return res.status(400).json({message: 'Usuário não cadastrado.'});
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioExiste.senha);

        if(!senhaCorreta){
            return res.status(400).json({message: 'E-mail ou senha inválidos.'});
        }

        const token = jwt.sign({
            id: usuarioExiste.id}, 
            process.env.SENHA_JWT, 
            { expiresIn: '10h'});

        const {senha: _, ...dadosUsuario} = usuarioExiste;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {
    login
}

