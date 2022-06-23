const knex = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');

const verificarLogin = async (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization) {
        return res.status(401).json({message: 'Usuário não autorizado.'})
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const {id} = jwt.verify(token, process.env.SENHA_JWT); 

        const usuarioLogado = await knex('usuarios').where({id}).first();
        
        if(!usuarioLogado) {
            return res.status(404).json({message: 'Usuário não encontrado'});
        }

        const {senha, ...usuario} = usuarioLogado;

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verificarLogin
