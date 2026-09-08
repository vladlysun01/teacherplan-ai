-- КРИТИЧНИЙ БАГ: таблиці payments НІКОЛИ не існувало в базі, хоча
-- app/api/payments/create/route.ts і app/api/payments/callback/route.ts
-- обидва працюють з нею так, ніби вона є. Наслідок:
--   1) create/route.ts: insert у payments обгорнутий у try/catch, який
--      лише логує помилку і мовчки продовжує — тому користувача однаково
--      відправляло на WayForPay платити;
--   2) callback/route.ts: після оплати WayForPay стукає на наш вебхук,
--      робить SELECT з payments по order_id, отримує помилку "relation
--      does not exist" → "Payment not found" → 404, і КРЕДИТИ НІКОЛИ НЕ
--      НАРАХОВУЮТЬСЯ. Тобто будь-яка реальна оплата на проді на 100%
--      не давала користувачу оплачені кредити.
-- Створюємо таблицю саме з тими колонками, які код уже використовує.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id text not null unique,
  package_id text,
  amount integer not null,
  credits integer not null,
  status text not null default 'pending', -- pending | completed | failed
  payment_method text default 'wayforpay',
  transaction_status text,
  card_pan text,
  auth_code text,
  reason_code text,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists payments_order_id_idx on public.payments (order_id);
create index if not exists payments_user_id_idx on public.payments (user_id);

alter table public.payments enable row level security;

-- Сервер (service role) керує усім — саме через нього і create-, і
-- callback-роут мають працювати (див. фікс app/api/payments/create/route.ts,
-- який перевели з anon-ключа на service role, бо anon-запит з сервера
-- йде без сесії користувача, і auth.uid() там завжди null).
create policy "Service role can manage payments"
  on public.payments for all
  to service_role
  using (true)
  with check (true);

-- Користувач може бачити свою історію оплат (наприклад, для сторінки
-- біллінгу в майбутньому).
create policy "Users can view own payments"
  on public.payments for select
  to authenticated
  using (auth.uid() = user_id);
