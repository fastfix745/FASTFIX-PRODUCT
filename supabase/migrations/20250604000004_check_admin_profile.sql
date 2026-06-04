-- Ver o profile do admin
SELECT p.*, u.email
FROM profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE u.email = 'fastfixadm@gmail.com';

-- Testar get_user_city
SELECT public.get_user_city('2ff7ee41-634c-4227-b483-ca8b3a34d663');