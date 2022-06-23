const knex = require('../bancodedados/conexao');
const { parse } = require('date-fns');
const { validaCamposCadastro } = require('../filtros/validacoes/cadastrocobranca');

const dataAtual = new Date().setHours(0, 0, 0, 0, 0);

const cadastrarCobranca = async (req, res) => {
    const { descricao, status, valor, vencimento } = req.body;
    const { id } = req.params;

    try {
        await validaCamposCadastro.validate(req.body);

        const clienteExiste = await knex('clientes').where({ id }).first();

        if (!clienteExiste) {
            return res.status(400).json({ message: 'Cliente não encontrado.' });
        }

        const cobranca = await knex('cobrancas')
            .insert({ cliente_id: id, descricao, status, valor, vencimento })
            .returning('*');

        if (!cobranca) {
            return res.status(400).json({ message: 'Cobrança não foi cadastrada.' });
        }

        if (cobranca[0].status === 'pendente' && cobranca[0].vencimento < dataAtual) {
            cobranca[0] = await knex('cobrancas')
                .where('id', cobranca[0].id)
                .update({ status: 'vencida' })
                .returning('*')
        }

        return res.status(200).json(cobranca[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const editarDadosCobranca = async (req, res) => {
    const { id } = req.params;
    let { descricao, status, valor, vencimento } = req.body;

    try {
        await validaCamposCadastro.validate(req.body);

        const cobranca = await knex('cobrancas').where({ id }).first();

        if (!cobranca) {
            return res.status(400).json({ message: 'Cobrança não cadastrada.' })
        }

        const vencimentoParse = parse(vencimento, 'yyyy-MM-dd', new Date()).getTime();

        if (status === 'pendente' && vencimentoParse < dataAtual) {
            status = 'vencida';

        } else if (status === 'vencida' && vencimentoParse >= dataAtual) {
            status = 'pendente';
        }

        const dadosEditados = await knex('cobrancas')
            .update({ descricao, status, valor, vencimento })
            .where({ id });


        if (!dadosEditados) {
            return res.status(400).json({ message: 'Os dados não foram atualizados.' });
        }

        return res.status(200).json({ message: 'Dados atualizados!' });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listarCobrancas = async (req, res) => {
    const { status, data } = req.query;

    try {
        const cobrancas = await knex('cobrancas');

        for (let cobranca of cobrancas) {
            if (cobranca.status === 'pendente' && ++cobranca.vencimento < dataAtual) {

                cobranca.status = await knex('cobrancas')
                    .where('id', cobranca.id)
                    .update({ status: 'vencida' })

            } else if (cobranca.status === 'vencida' && ++cobranca.vencimento >= dataAtual) {

                cobranca.status = await knex('cobrancas')
                    .where('id', cobranca.id)
                    .update({ status: 'pendente' })
            }
        }

        const cobrancasAtualizadas = await knex('cobrancas')
            .leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id')
            .select('cobrancas.*', 'clientes.nome as cliente')
            .orderBy('id');

        if (status && data) {
            const listaFiltroCobrancas = await knex('cobrancas')
                .where('cobrancas.status', status)
                .andWhere('cobrancas.vencimento', data)
                .leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id')
                .select('cobrancas.*', 'clientes.nome as cliente')
                .orderBy('id');

            return res.status(200).json(listaFiltroCobrancas);

        } else if (status) {
            const listaFiltroCobrancas = await knex('cobrancas')
                .where('cobrancas.status', status)
                .leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id')
                .select('cobrancas.*', 'clientes.nome as cliente')
                .orderBy('id');

            return res.status(200).json(listaFiltroCobrancas);

        } else if (data) {
            const listaFiltroCobrancas = await knex('cobrancas')
                .where('cobrancas.vencimento', data)
                .leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id')
                .select('cobrancas.*', 'clientes.nome as cliente')
                .orderBy('id');

            return res.status(200).json(listaFiltroCobrancas);
        }

        return res.status(200).json(cobrancasAtualizadas);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterCobranca = async (req, res) => {
    const { id_cobranca } = req.params;

    try {
        let cobranca = await knex('cobrancas').where({ id: id_cobranca }).first();

        if (!cobranca) {
            return res.status(400).json({ message: 'Cobrança inexistente.' });
        }

        let { cliente_id } = cobranca;

        const cliente = await knex('clientes').where({ id: cliente_id }).first('nome');

        const cobrancaDetalhe = {
            ...cobranca,
            cliente: cliente.nome
        }

        return res.status(200).json(cobrancaDetalhe);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterCobrancaCliente = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        const cobrancaCliente = await knex('cobrancas').where({ cliente_id: id_cliente });

        if (!cobrancaCliente) {
            return res.status(400).json({ message: 'Cobrança não cadastrada para o cliente.' });
        }

        return res.status(200).json(cobrancaCliente);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirCobranca = async (req, res) => {
    const { id } = req.params;

    try {
        let cobranca = await knex('cobrancas').where({ id }).first();

        if (!cobranca) {
            return res.status(400).json({ message: 'Cobrança inexistente.' });
        }

        let { status, vencimento } = cobranca;

        const dataAtual = new Date().getTime();

        if (status === 'vencida' && ++vencimento < dataAtual) {
            return res.status(400).json({ message: 'Cobrança vencida não pode ser excluída.' });
        }

        if (status === 'paga') {
            return res.status(400).json({ message: 'Cobrança paga não pode ser excluída.' });
        }

        const cobrancaExcluida = await knex('cobrancas')
            .where({ id })
            .del();

        if (!cobrancaExcluida) {
            return res.status(400).json({ message: 'Cobrança não pode ser excluída.' });
        }

        return res.status(200).json({ message: 'Cobrança excluída com sucesso!' });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarCobranca,
    editarDadosCobranca,
    listarCobrancas,
    obterCobranca,
    obterCobrancaCliente,
    excluirCobranca
}