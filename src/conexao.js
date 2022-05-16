require('dotenv').config()

const knex = require('knex')({
    client: 'pg',
    connection: {
      host:'ec2-54-164-40-66.compute-1.amazonaws.com',
      database :'d96kpne5iiuru1',
      user :'gjhkpcfjyaqkyj',
      password :'e82b13d9852f26796b11ff7aabe60c7ba93acabedc6f987084760d090c8b3291',
      port :5432,
      ssl:{ 
        rejectUnauthorized: false 
      }
    }
  });

module.exports = knex