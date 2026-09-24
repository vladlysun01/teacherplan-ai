-- КРИТИЧНА ВРАЗЛИВІСТЬ, знайдена й підтверджена живим експлойтом
-- (2026-09-24, аудит "перевір усі баги"): RLS-політика "Users can update
-- own profile" обмежувала лише ЯКИЙ рядок можна редагувати
-- (auth.uid() = id), але не ЯКІ КОЛОНКИ — авторизований користувач міг
-- одним PATCH-запитом до /rest/v1/profiles виписати собі будь-яку
-- кількість credits і будь-який subscription_tier БЕЗ оплати. Перевірено
-- живим тестом: credits 2 → 999999, subscription_tier free → premium,
-- одним запитом із власним JWT.
--
-- RLS сама по собі не обмежує колонки (лише рядки) — стандартне рішення
-- саме column-level GRANT (той самий прийом, що вже задокументований у
-- пам'яті проєкту для tender-intel): забрати широкий table-level грант,
-- дати назад лише безпечні поля, що клієнт РЕАЛЬНО редагує сам
-- (app/dashboard/settings/page.tsx — єдине місце клієнтського запису в
-- profiles, upsert саме цими полями). credits/subscription_tier/
-- subscription_expires_at/documents_this_month/total_generations/
-- referral_code/referred_by/activation_reminder_sent_at/created_at —
-- усі керуються виключно service_role (вебхук оплати, генерація коду,
-- реферальна атрибуція) і йому REVOKE не заважає (service_role обходить
-- GRANT/RLS за задумом Supabase).
revoke insert, update on public.profiles from authenticated;
grant insert (id, full_name, email, school_name, subject, teacher_category, updated_at) on public.profiles to authenticated;
grant update (full_name, email, school_name, subject, teacher_category, updated_at) on public.profiles to authenticated;

NOTIFY pgrst, 'reload schema';
