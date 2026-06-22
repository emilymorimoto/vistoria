-- ============================================================================
-- Vistoria — Dados de exemplo (opcional)
-- Rode no SQL Editor do Supabase DEPOIS do schema.sql, se quiser ver o sistema
-- com alguns processos já cadastrados. É idempotente: só insere se ainda não
-- houver nenhum processo (rodar de novo não duplica).
-- (O SQL Editor ignora o RLS, então a inserção funciona mesmo sem login.)
-- ============================================================================
do $$
begin
  if (select count(*) from processo) = 0 then

    -- Imóveis
    insert into imovel (codigo, endereco, tipo) values
      ('IM-001','Rua das Flores, 123 - Centro','apartamento'),
      ('IM-002','Av. Principal, 456 - Jardim América','casa'),
      ('IM-003','R. Comercial, 789 - Centro','comercial'),
      ('IM-004','Rua do Sol, 321','apartamento'),
      ('IM-005','Av. Beira Mar, 555','apartamento')
    on conflict (codigo) do nothing;

    -- Inquilinos
    insert into inquilino (nome, contato) values
      ('João Silva','(44) 99999-0001'),
      ('Ana Costa','(44) 99999-0002'),
      ('Empresa XYZ Ltda','(44) 3333-0003'),
      ('Roberto Alves','(44) 99999-0004'),
      ('Claudia Ferreira','(44) 99999-0005');

    -- Processos (datas relativas a hoje para os status fazerem sentido)
    insert into processo (imovel_id, inquilino_id, etapa_atual, status, prioridade,
                          data_aviso_desocupacao, data_inicio_etapa, observacoes)
    select i.id, q.id, 'aviso-desocupacao'::etapa_processo, 'atencao'::status_prazo, 'alta'::prioridade,
           current_date - 27, current_date - 27, null
      from imovel i, inquilino q where i.codigo='IM-001' and q.nome='João Silva';

    insert into processo (imovel_id, inquilino_id, etapa_atual, status, prioridade,
                          data_aviso_desocupacao, data_inicio_etapa, observacoes)
    select i.id, q.id, 'agendamento-vistoria', 'no-prazo', 'media',
           current_date - 16, current_date - 6, null
      from imovel i, inquilino q where i.codigo='IM-002' and q.nome='Ana Costa';

    insert into processo (imovel_id, inquilino_id, etapa_atual, status, prioridade,
                          data_aviso_desocupacao, data_inicio_etapa, observacoes)
    select i.id, q.id, 'tratativas', 'vencido', 'alta',
           current_date - 40, current_date - 26, 'Pendência de pagamento'
      from imovel i, inquilino q where i.codigo='IM-003' and q.nome='Empresa XYZ Ltda';

    insert into processo (imovel_id, inquilino_id, etapa_atual, status, prioridade,
                          data_aviso_desocupacao, data_inicio_etapa, observacoes)
    select i.id, q.id, 'orientacao-inquilino', 'no-prazo', 'media',
           current_date - 11, current_date - 5, null
      from imovel i, inquilino q where i.codigo='IM-004' and q.nome='Roberto Alves';

    insert into processo (imovel_id, inquilino_id, etapa_atual, status, prioridade,
                          data_aviso_desocupacao, data_inicio_etapa, observacoes)
    select i.id, q.id, 'execucao', 'no-prazo', 'media',
           current_date - 6, current_date - 2, null
      from imovel i, inquilino q where i.codigo='IM-005' and q.nome='Claudia Ferreira';

  end if;
end $$;
