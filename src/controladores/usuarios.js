const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const { validaCamposCadastro, validaCamposEditar, validaCamposMinCaracteres,    validaCampoEmail } = require('../filtros/validacoes/cadastrousuario');

const listarEmailsExistentes = async (req, res) => {
    const { email } = req.params;

    try {
        await validaCampoEmail.validate(req.params);

        const emailExiste = await knex('usuarios')
            .where({ email })
            .first();

        if (emailExiste) {
            return res.status(400).json(true);
        }

        return res.status(200).json(false);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        await validaCamposCadastro.validate(req.body);

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios')
            .insert({ nome, email, senha: senhaCriptografada })
            .returning(['id', 'nome', 'email']);

        if (!usuario) {
            return res.status(400).json({ message: 'O usuário não foi cadastrado.' });
        }

        return res.status(200).json(usuario[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const editarDadosUsuario = async (req, res) => {
    const { id } = req.usuario;
    let { nome, email, senha, cpf, telefone } = req.body;

    try {
        await validaCamposEditar.validate(req.body);

        if (cpf || telefone) {
            await validaCamposMinCaracteres.validate({ cpf, telefone });
        }

        const usuario = await knex('usuarios').where({ id }).first();

        if (email) {
            if (email !== usuario.email) {
                const emailExiste = await knex('usuarios').where({ email }).first();

                if (emailExiste) {
                    return res.status(400).json({ message: 'E-mail já existe.' });
                }
            }
        }

        if (senha) {
            senha = await bcrypt.hash(senha, 10);
        }

        if (cpf) {
            if (cpf !== usuario.cpf) {
                const cpfExiste = await knex('usuarios').where({ cpf }).first();

                if (cpfExiste) {
                    return res.status(400).json({ message: 'CPF já existe.' });
                }
            }

        }

        const dadosEditados = await knex('usuarios')
            .update({ nome, email, senha, cpf, telefone })
            .where({ id });

        if (!dadosEditados) {
            return res.status(400).json({ message: 'Os dados não foram atualizados.' });
        }

        return res.status(200).json({ message: 'Dados atualizados!' });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterDadosUsuario = async (req, res) => {
    return res.status(200).json(req.usuario)
}

module.exports = {
    cadastrarUsuario,
    editarDadosUsuario,
    obterDadosUsuario,
    listarEmailsExistentes
}