const knex = require('../bancodedados/conexao');
const { validaCamposCadastro } = require('../filtros/validacoes/cadastrocliente');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, telefone,
        cep, endereco, complemento, bairro, cidade, uf } = req.body;

    try {
        await validaCamposCadastro.validate(req.body);

        const emailExiste = await knex('clientes').where({ email }).first();

        if (emailExiste) {
            return res.status(400).json({ message: 'E-mail já existe.' });
        }

        const cpfExiste = await knex('clientes').where({ cpf }).first();

        if (cpfExiste) {
            return res.status(400).json({ message: 'CPF já existe.' });
        }

        if(cep){
            if(!endereco && !bairro && !cidade && !uf){
                return res.status(400).json({ message: 'Favor preencher endereço, bairro, cidade e UF.' });
            }
        }

        const cliente = await knex('clientes')
            .insert({
                nome, email, cpf, telefone,
                cep, endereco, complemento, bairro, cidade, uf
            })
            .returning('*');

        if (!cliente) {
            return res.status(400).json({ message: 'O cliente não foi cadastrado.' });
        }

        return res.status(200).json(cliente[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const editarDadosCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, telefone,
        cep, endereco, complemento, bairro, cidade, uf } = req.body;

    try {
        await validaCamposCadastro.validate(req.body);

        const cliente = await knex('clientes').where({ id }).first();

        if (email) {
            if (email !== cliente.email) {
                const emailExiste = await knex('clientes').where({ email }).first();

                if (emailExiste) {
                    return res.status(400).json({ message: 'E-mail já existe.' });
                }
            }
        }

        if (cpf) {
            if (cpf !== cliente.cpf) {
                const cpfExiste = await knex('clientes').where({ cpf }).first();

                if (cpfExiste) {
                    return res.status(400).json({ message: 'CPF já existe.' });
                }
            }

        }

        if(cep){
            if(!endereco && !bairro && !cidade && !uf){
                return res.status(400).json({ message: 'Favor preencher endereço, bairro, cidade e UF.' });
            }
        }

        const dadosEditados = await knex('clientes')
            .update({
                nome, email, cpf, telefone,
                cep, endereco, complemento, bairro, cidade, uf
            })
            .where({ id });

        if (!dadosEditados) {
            return res.status(400).json({ message: 'Os dados não foram atualizados.' });
        }

        return res.status(200).json({ message: 'Dados atualizados!' });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await knex('clientes')
            .where({ id })
            .first();

        if (!cliente) {
            return res.status(400).json({ message: 'Cliente não encontrado.' })
        }

        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listarClientes = async (req, res) => {
    const { filtro } = req.query;

    try {
        const cobrancasVencidas = await knex('cobrancas')
            .where('status', '=', 'vencida')
            .select('cliente_id')
            .distinct('cliente_id');

        let clienteIdVencidas = [];

        cobrancasVencidas.map((cobranca) => {
            clienteIdVencidas.push(cobranca.cliente_id)
        });

        const clientes = await knex('clientes');

        for (let cliente of clientes) {
            if (clienteIdVencidas.includes(cliente.id)) {
                cliente.status = await knex('clientes')
                    .where('id', cliente.id)
                    .update({ status: 'inadimplente' })
            } else {
                cliente.status = await knex('clientes')
                    .where('id', cliente.id)
                    .update({ status: 'em dia' })
            }
        }

        const clientesAtualizados = await knex('clientes')
            .select(['id', 'nome', 'email', 'cpf', 'telefone', 'status'])
            .orderBy('id');

        if (filtro) {
            const listaFiltroClientes = await knex('clientes')
                .where('status', filtro)
                .select(['id', 'nome', 'email', 'cpf', 'telefone', 'status'])
                .orderBy('id');

            return res.status(200).json(listaFiltroClientes);
        }

        return res.status(200).json(clientesAtualizados)
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarCliente,
    editarDadosCliente,
    listarClientes,
    obterCliente
}