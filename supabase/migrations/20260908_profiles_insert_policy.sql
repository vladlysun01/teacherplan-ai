-- Баг: збереження профілю ("Мій профіль" і автозбереження зі сторінки
-- "Генерувати") падало з "new row violates row-level security policy
-- for table profiles" для деяких користувачів.
--
-- Причина: RLS на profiles мала SELECT і UPDATE для власного рядка
-- (auth.uid() = id), але жодної INSERT-політики для звичайних
-- користувачів — лише для service_role. Є тригер on_auth_user_created
-- на auth.users, який мав би сам створювати рядок профілю при
-- реєстрації, але щонайменше для одного реального користувача цей
-- рядок не існував (тригер не спрацював чи користувач зареєструвався
-- раніше, ніж тригер зʼявився) — тому upsert() із браузера (insert,
-- якщо рядка ще нема) впирався в RLS.
--
-- Фікс: додати INSERT-політику для authenticated — тепер збереження
-- профілю саме "лікує" відсутній рядок, а не залежить винятково від
-- тригера.
create policy "Users can insert own profile" on public.profiles
  for insert to authenticated
  with check (auth.uid() = id);
