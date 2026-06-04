-- DELETAR TODAS AS DENÚNCIAS DE TESTE
-- Execute este SQL no Editor SQL do Supabase

DELETE FROM problem_upvotes;
DELETE FROM problems;

-- Verificar se foi deletado
SELECT COUNT(*) as total_problemas FROM problems;