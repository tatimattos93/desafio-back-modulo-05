const knex = require('../bancodedados/conexao');

const totalPorStatusCobranca = async (req, res) => {
   try {
      const cobrancasTotalPago = await knex('cobrancas')
         .where('status', 'pago')
         .sum('valor');

      const cobrancasTotalPendente = await knex('cobrancas')
         .where('status', 'pendente')
         .sum('valor');

      const cobrancasTotalVencida = await knex('cobrancas')
         .where('status', 'vencida')
         .sum('valor');

      const cobrancasResumoTotais = {
         total_Pago: cobrancasTotalPago[0].sum,
         total_Pendente: cobrancasTotalPendente[0].sum,
         total_Vencida: cobrancasTotalVencida[0].sum
      }

      return res.status(200).json(cobrancasResumoTotais)
   } catch (error) {
      return res.status(400).json(error.message);
   }
}

const resumoVencidas = async (req, res) => {
   try {
      const cobrancasVencidas = await knex('cobrancas')
         .leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id')
         .select('cobrancas.id', 'cobrancas.valor', 'clientes.nome as cliente')
         .where('cobrancas.status', 'vencida')
         .orderBy('id', 'desc')
         .limit('4');

      const qtdCobrancasVencidas = await knex('cobrancas')
         .where('status', 'vencida')
         .count('id');

      const resposta = {
         cobrancasVencidas,
         total: qtdCobrancasVencidas[0].count
      }

      return res.status(200).json(resposta);

   } catch (error) {
      return res.status(400).json(error.message);
   }
}

const resumoPendentes = async (req, res) => {
   try {
      const cobrancasPendentes = await knex('cobrancas')
         .leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id')
         .select('cobrancas.id', 'cobrancas.valor', 'clientes.nome as cliente')
         .where('cobrancas.status', 'pendente')
         .orderBy('id', 'desc')
         .limit('4');

      const qtdCobrancasPendentes = await knex('cobrancas')
         .where('status', 'pendente')
         .count('id');

      const resposta = {
         cobrancasPendentes,
         total: qtdCobrancasPendentes[0].count
      }

      return res.status(200).json(resposta);

   } catch (error) {
      return res.status(400).json(error.message);
   }
}

const resumoPagas = async (req, res) => {
   try {
      const cobrancasPagas = await knex('cobrancas')
         .leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id')
         .select('cobrancas.id', 'cobrancas.valor', 'clientes.nome as cliente')
         .where('cobrancas.status', 'pago')
         .orderBy('id', 'desc')
         .limit('4');

      const qtdCobrancasPagas = await knex('cobrancas')
         .where('status', 'pago')
         .count('id');

      const resposta = {
         cobrancasPagas,
         total: qtdCobrancasPagas[0].count
      }

      return res.status(200).json(resposta);

   } catch (error) {
      return res.status(400).json(error.message);
   }
}


module.exports = {
   totalPorStatusCobranca,
   resumoVencidas,
   resumoPendentes,
   resumoPagas
}