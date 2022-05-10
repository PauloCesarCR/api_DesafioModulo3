const express = require('express')
const rotas = express();
const { verificarLogin } = require('../intermediario');
const {login} = require('../controladores/Login/fazerLogin')
const usuario = require('../controladores/Usuarios/usuario')
const {listarCategorias} = require('../controladores/Categorias/listarCategorias')
const transacoes = require('../controladores/Transacoes/transacoes')

rotas.post('/usuarios',usuario.cadastrarUsuario)
rotas.post('/login', login)

rotas.use(verificarLogin)

rotas.get('/usuario',usuario.obterUsuario)
rotas.put('/usuario',usuario.atualizarUsuario)

rotas.get('/categoria',listarCategorias)

rotas.get('/transacao',transacoes.listarTransacoes)
rotas.get('/transacao/extrato',transacoes.extratoDeTransacoes)
rotas.get('/transacao/:id',transacoes.obterTransacao)
rotas.post('/transacao',transacoes.cadastrarTransacao)
rotas.put('/transacao/:id',transacoes.atualizarTransacaoDoUsuarioLogado)
rotas.delete('/transacao/:id',transacoes.deletarTransacaoDoUsuarioLogado)

module.exports = rotas