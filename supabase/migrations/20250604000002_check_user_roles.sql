-- Verificar usuários e suas roles
SELECT
  u.id as user_id,
  u.email,
  COALESCE(p.display_name, 'SEM NOME') as display_name,
  COALESCE(p.city, 'SEM CIDADE') as city,
  array_agg(ur.role) as roles
FROM auth.users u
LEFT JOIN profiles p ON p.user_id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
GROUP BY u.id, u.email, p.display_name, p.city
ORDER BY u.created_at DESC
LIMIT 10;