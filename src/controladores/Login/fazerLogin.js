const {schemaFazerLogin} = require('../../validacoes/Schemas')
const knex = require('../../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const segredoWebToken = require('../../segredo')

const login = async (req,res) => {
    const {email,senha} = req.body
   
        try {
           await schemaFazerLogin.validate(req.body)
           const usuario = await knex('usuarios').where('email',email).first()
          
           if (usuario === undefined){
               return res.status(404).json({"mensagem": "Email ou senha inválidos"})
           }   
   
           const verificarSenha = await bcrypt.compare(senha, usuario.senha)
   
           if (verificarSenha === false) {
               return res.status(400).json({"mensagem":"Email ou senha inválidos"})
           } 
   
           const token =jwt.sign({id:usuario.id}, segredoWebToken, {expiresIn:'1h'})
               
   
             const usuarioDoToken = {id:usuario.id, nome:usuario.nome, email:usuario.email, token}
   
               return res.status(200).json(usuarioDoToken)
        } catch (error) {
           return res.status(400).json(error.message)
        }     
}

module.exports = {
    login
}