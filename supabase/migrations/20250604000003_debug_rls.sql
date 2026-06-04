-- Verificar estrutura da tabela problems
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'problems'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'problems';

-- Verificar se a coluna response existe
SELECT column_name FROM information_schema.columns
WHERE table_name = 'problems' AND column_name = 'response';