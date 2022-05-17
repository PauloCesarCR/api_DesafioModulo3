const {schemaCadastrarUsuario,schemaAtualizarUsuario} = require('../../validacoes/Schemas')
const knex = require('../../conexao')
const bcrypt = require('bcrypt')

const cadastrarUsuario = async (req,res) => {
    const {nome,email,senha} = req.body

    try {   
        await schemaCadastrarUsuario.validate(req.body)
    
        const verificarUsuario = await knex('usuarios').where('email', email)
        if (verificarUsuario.length > 0){
            return res.status(403).json({'mensagem':'Esse email já está cadastrado.'})
        } 

       const senhaSegura = await bcrypt.hash(senha, 10)
       await knex('usuarios').insert({nome: nome, email:email, senha:senhaSegura})
       const usuario = await knex('usuarios').where('email', email)

        const UsuarioFiltrado = []
            
        for (let item of usuario){
                UsuarioFiltrado.push({id:item.id, nome:item.nome, email:item.email})
        }
        return res.status(201).json(UsuarioFiltrado)
        
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const atualizarUsuario = async (req,res) => {
    const {nome,email,senha} = req.body
    const {usuario} = req

    try {
        await schemaAtualizarUsuario.validate(req.body)

        const UsuarioFiltrado = await knex('usuarios').where('email',email).first()

        if (UsuarioFiltrado){
            if ( UsuarioFiltrado.id !== usuario.id){
                return res.status(403).json({"mensagem": "Email já cadastrado."})
            } 
        }
        const senhaSegura = await bcrypt.hash(senha, 10)

                const usuarioAtualizado =await knex('usuarios').where('id', usuario.id).update({
                  nome: nome,
                  email: email,
                  senha:senhaSegura,
                })
                return res.status(200).json()
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const obterUsuario =  async (req,res) => {
    const {usuario} = req

        if (!usuario){
         return res.status(401).json({"mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."})
        }
    
   try {
       return res.status(200).json(usuario)
   } catch (error) {
    return res.status(400).json(error.message)
   }

}

module.exports = {
    cadastrarUsuario,
    atualizarUsuario,
    obterUsuario
}