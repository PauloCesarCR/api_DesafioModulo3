const knex = require('../../conexao')
const { schemaCadastrarTransacao,schemaAtualizarTransacaoDoUsuarioLogado} = require('../../validacoes/Schemas')

const cadastrarTransacao = async (req, res) => {
  const { usuario } = req
  const { descricao, valor, data, categoria_id, tipo } = req.body

  if (tipo !== 'entrada' && tipo !== 'saida') {
    return res.status(400).json({ mensagem: 'O tipo informado está incorreto' })
  }

  try {
    schemaCadastrarTransacao.validate(req.body)
    const categoriaFiltrada = await knex('categorias').where('id', categoria_id).first()

    if (!categoriaFiltrada) {
      return res
        .status(404)
        .json({ mensagem: 'Não existe categoria para o id informado' })
    }

    const transacoesDoUsuario = await knex('transacoes')
      .insert({
        descricao: descricao,
        valor: valor,
        data: data,
        categoria_id: categoria_id,
        usuario_id: usuario.id,
        tipo: tipo,
      })
      .returning('*')

    const transacaoFilter = transacoesDoUsuario.pop()

    return res
      .status(200)
      .json({
        id: transacaoFilter.id,
        tipo: transacaoFilter.tipo,
        descricao: transacaoFilter.descricao,
        valor: transacaoFilter.valor,
        data: transacaoFilter.data,
        usuario_id: transacaoFilter.usuario_id,
        categoria_id: transacaoFilter.categoria_id,
        categoria_nome: categoriaFiltrada.descricao,
      })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const obterTransacao = async (req, res) => {
  const { id } = req.params
  const { usuario } = req

  try {
    const transacaoDoUsuario = await knex('transacoes').where('usuario_id',usuario.id)

    if (!transacaoDoUsuario) {
      return res.status(404).json({ mensagem: 'Você não possui transações' })
    }

    const TransacaoFiltrada = transacaoDoUsuario.find((transacao) => {
      return transacao.id === Number(id)
    })
    if (!TransacaoFiltrada) {
      return res
        .status(404)
        .json({ mensagem: 'Transação inexistente ou de outra pessoa.' })
    }

    const categoriaFiltrada = await knex('categorias').where('id', TransacaoFiltrada.categoria_id).first()

    const transacaoFormatada = {
      id: TransacaoFiltrada.id,
      tipo: TransacaoFiltrada.tipo,
      descricao: TransacaoFiltrada.descricao,
      valor: TransacaoFiltrada.valor,
      data: TransacaoFiltrada.data,
      usuario_id: TransacaoFiltrada.usuario_id,
      categoria_id: TransacaoFiltrada.categoria_id,
      categoria_nome: categoriaFiltrada.descricao,
    }

    res.status(200).json(transacaoFormatada)
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const listarTransacoes = async (req, res) => {
  const { usuario } = req

  try {
    const transacoesDoUsuario = await knex('transacoes').where('usuario_id',usuario.id)
    if (!transacoesDoUsuario) {
      return res.status(404).json({ mensagem: 'Não existem transações para esse usuario' })
    }
    return res.status(200).json(transacoesDoUsuario)
  } catch (error) {
    return res.status(400).json({ mensagem: error })
  }
}

const extratoDeTransacoes = async (req, res) => {
  const { usuario } = req
  try {
    const transacao = await knex('transacoes')
      .where('usuario_id', usuario.id)
      .first()

    if (!transacao) {
      return res
        .status(404)
        .json({ mensagem: 'Não existem transacoes para este usuario' })
    }

    const transacoesSaida = await knex('transacoes').where('tipo', 'saida').where('usuario_id', usuario.id)
    const transacoesEntrada = await knex('transacoes').where('tipo', 'entrada').where('usuario_id', usuario.id)

    const saida = transacoesSaida.map((transacao) => transacao.valor).reduce((total, valor) => total + valor, 0)
    const entrada = transacoesEntrada.map((transacao) => transacao.valor).reduce((total, valor) => total + valor, 0)

    return res.status(200).json({ entrada: entrada, saida: saida })
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const atualizarTransacaoDoUsuarioLogado = async (req, res) => {
  const { usuario } = req
  const { id } = req.params
  const { descricao, valor, data, categoria_id, tipo } = req.body

  if (tipo !== 'entrada' && tipo !== 'saida') {
    return res.status(400).json({ mensagem: 'O tipo informado está incorreto' })
  }

  try {
    await schemaAtualizarTransacaoDoUsuarioLogado.validate(req.body)

    const transacao = await knex('transacoes').where('id',id).first()

    if (!transacao) {
      return res.status(404).json({ mensagem: 'Essa transação não existe' })
    }

    if (transacao.usuario_id !== usuario.id) {
      return res.status(403).json({mensagem: 'Você não pode atualizar a transação de outra pessoa'})
    }

    const categoriaFiltrada = await knex('categorias').where('id',categoria_id).first()

    if (!categoriaFiltrada) {
      return res.status(404).json({ mensagem: 'Não existe categoria para o id informado' })
    }

    await knex('transacoes').where('id',id).update({descricao: descricao,valor: valor,data:data,categoria_id:categoria_id,tipo:tipo})
    return res.status(200).json()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const deletarTransacaoDoUsuarioLogado = async (req, res) => {
  const { id } = req.params
  const { usuario } = req

  try {

    const transacao = await knex('transacoes').where('id',id).first()

    if (!transacao) {
      return res.status(404).json({ mensagem: 'Transacao não encontrada' })
    }

    if (transacao.usuario_id !== usuario.id) {
      return res.status(403).json({mensagem: 'Você não pode excluir a transação de outro usuario'})
    }
  
    await knex('transacoes').where('id', id).del()

    return res.status(200).json()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = {
  cadastrarTransacao,
  obterTransacao,
  listarTransacoes,
  extratoDeTransacoes,
  atualizarTransacaoDoUsuarioLogado,
  deletarTransacaoDoUsuarioLogado,
}
