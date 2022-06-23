const express = require('express');

const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const clientes = require('./controladores/clientes');
const cobrancas = require('./controladores/cobrancas');
const resumoCobrancas = require('./controladores/resumoCobrancas');
const resumoClientes = require('./controladores/resumoClientes');
const verificarLogin = require('./filtros/verificalogin');

const rotas = express();

rotas.get('/usuarios/emails/:email', usuarios.listarEmailsExistentes);
rotas.post('/usuarios/cadastro', usuarios.cadastrarUsuario);

rotas.post('/login', login.login);

rotas.use(verificarLogin);

rotas.put('/usuario/editar', usuarios.editarDadosUsuario);
rotas.get('/usuario', usuarios.obterDadosUsuario);

rotas.post('/clientes/cadastro', clientes.cadastrarCliente);
rotas.put('/cliente/editar/:id', clientes.editarDadosCliente);
rotas.get('/cliente/:id', clientes.obterCliente);
rotas.get('/clientes', clientes.listarClientes);

rotas.post('/cobrancas/cadastro/:id', cobrancas.cadastrarCobranca);
rotas.put('/cobranca/editar/:id', cobrancas.editarDadosCobranca);
rotas.get('/cobrancas', cobrancas.listarCobrancas);
rotas.get('/cobranca/:id_cobranca', cobrancas.obterCobranca);
rotas.get('/cobranca/cliente/:id_cliente', cobrancas.obterCobrancaCliente);
rotas.delete('/cobranca/excluir/:id', cobrancas.excluirCobranca);

rotas.get('/cobrancas/total', resumoCobrancas.totalPorStatusCobranca);
rotas.get('/cobrancas/vencidas', resumoCobrancas.resumoVencidas);
rotas.get('/cobrancas/pendentes', resumoCobrancas.resumoPendentes);
rotas.get('/cobrancas/pagas', resumoCobrancas.resumoPagas);

rotas.get('/clientes/inadimplentes', resumoClientes.resumoInadimplentes);
rotas.get('/clientes/em_dia', resumoClientes.resumoEmDia);

module.exports = rotas;