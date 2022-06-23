const knex = require('../bancodedados/conexao');

const resumoInadimplentes = async (req, res) => {
   try {
      const clientesInadimplentes = await knex('clientes')
      .select('clientes.id', 'clientes.nome as cliente', 'clientes.cpf')
      .where('clientes.status', 'inadimplente')
      .orderBy('id', 'desc')
      .limit('4');

      const qtdClientesInadimplentes = await knex('clientes')
         .where('status', 'inadimplente')
         .count('id');

      const resposta = {
         clientesInadimplentes,
         total: qtdClientesInadimplentes[0].count
      }

      return res.status(200).json(resposta);

   } catch (error) {
      return res.status(400).json(error.message);
   }
}

const resumoEmDia = async (req, res) => {
   try {
      const clientesEmDia = await knex('clientes')
         .select('clientes.id', 'clientes.nome as cliente', 'clientes.cpf')
         .where('clientes.status', 'em dia')
         .orderBy('id', 'desc')
         .limit('4');

      const qtdClientesEmDia = await knex('clientes')
         .where('status', 'em dia')
         .count('id');

      const resposta = {
         clientesEmDia,
         total: qtdClientesEmDia[0].count
      }

      return res.status(200).json(resposta);

   } catch (error) {
      return res.status(400).json(error.message);
   }
}


module.exports = {
   resumoInadimplentes,
   resumoEmDia
}