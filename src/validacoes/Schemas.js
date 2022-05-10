const yup = require('./configuracoes')


const schemaCadastrarUsuario = yup.object().shape({
   nome: yup.string().required('O nome é obrigatório'),
   email: yup.string().required('O email é obrigatório').email(),
   senha: yup.string().required('A senha é obrigatória')
})

const schemaFazerLogin = yup.object().shape({
    email: yup.string().required('O email é obrigatório').email(),
    senha: yup.string().required('A senha é obrigatória')
})

const schemaAtualizarUsuario = yup.object().shape({
    nome: yup.string().required('O nome é obrigatório'),
    email: yup.string().required('O email é obrigatório').email(),
    senha: yup.string().required('A senha é obrigatória')
})

const schemaCadastrarTransacao = yup.object().shape({
    descricao: yup.string().required('A descrição é obrigatória'),
    valor: yup.number().required('O valor é obrigatório'),
    data: yup.string().required('A data é obrigatória'),
    categoria_id: yup.number().required('A categoria é obrigatória'),
    tipo: yup.string().required('O tipo é obrigatório')
})

const schemaAtualizarTransacaoDoUsuarioLogado = yup.object().shape({
    descricao: yup.string().required('A descrição é obrigatória'),
    valor: yup.number().required('O valor é obrigatório'),
    data: yup.string().required('A data é obrigatória'),
    categoria_id: yup.number().required('A categoria é obrigatória'),
    tipo: yup.string().required('O tipo é obrigatório')
})


module.exports = {
    schemaCadastrarUsuario,
    schemaFazerLogin,
    schemaAtualizarUsuario,
    schemaCadastrarTransacao,
    schemaAtualizarTransacaoDoUsuarioLogado
}