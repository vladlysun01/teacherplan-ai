-- Той самий клас проблеми, що й profiles (той самий аудит, 2026-09-24):
-- "Users can update own documents" обмежувала лише РЯДОК (user_id =
-- auth.uid()), не колонки. app/dashboard/documents/generate/route.ts
-- працює через сесію користувача (createServerClient з anon-ключем, НЕ
-- service_role), тому реально спирається на ці RLS-грант, а не обходить
-- їх — на відміну від profiled, тут не можна просто відкликати все:
-- потрібен точковий набір колонок, які цей маршрут дійсно пише.
--
-- Перевірено по коду generate/route.ts:
--   INSERT: user_id, title, type, status, generation_params
--   UPDATE: status, file_url, metadata
-- credits_used і settings ніде в легітимному потоці не записуються —
-- лишаються лише для service_role (захист від майбутнього дрейфу, якщо
-- колись з'явиться клієнтський запис із довільним credits_used).
revoke insert, update on public.documents from authenticated;
grant insert (user_id, title, type, status, generation_params) on public.documents to authenticated;
grant update (status, file_url, metadata) on public.documents to authenticated;

NOTIFY pgrst, 'reload schema';
