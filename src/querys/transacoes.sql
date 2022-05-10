create table transacoes (
	id serial primary key,
  	descricao text,
  	valor int,
  	data date,
  	categoria_id references categorias(id),
  	usuario_id references usuarios(id)
)