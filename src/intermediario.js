const knex = require('./conexao')
const jwt = require('jsonwebtoken')

const verificarLogin = async (req,res,next) => {
    const {authorization} = req.headers;


    if ( !authorization){
        res.status(401).json({"mensagem": "O usuario precisa estar logado"})
    }

    try {
        const token = authorization.replace('Bearer ', "").trim();
        
       const user =  jwt.decode(token)

        const UsuarioAtual = await knex('usuarios').where('id', user.id).first()

            if (!UsuarioAtual){
                return res.status(404).json({"mensagem": "Usuario não encontrado"})
            }

            const {senha:_, ...dadosUsuario} = UsuarioAtual
            req.usuario = dadosUsuario;
            console.log('usuario final')

            next()

    } catch (error) {
        
    }
}

module.exports = {
    verificarLogin
}