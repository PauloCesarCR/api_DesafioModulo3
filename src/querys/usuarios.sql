create table usuarios (
	id serial primary key,
  	nome varchar(50) not null,
	email varchar(50) not null unique,
  	senha text not null
)
