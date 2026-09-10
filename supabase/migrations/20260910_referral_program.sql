-- Реферальна програма (роадмап "Курс на прибуток" → TeacherPlan AI → Далі).
-- Механіка: кожен користувач має свій referral_code; той, хто прийшов за
-- посиланням із ?ref=<code>, отримує profiles.referred_by = id реферера
-- (фіксується один раз, при першому вході — до першої оплати). Коли
-- реферал робить свою ПЕРШУ успішну оплату, обидва (реферер і реферал)
-- отримують бонусні кредити, а рядок у referrals переходить у 'rewarded'.

alter table public.profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references public.profiles(id) on delete set null;

create index if not exists profiles_referral_code_idx on public.profiles (referral_code);
create index if not exists profiles_referred_by_idx on public.profiles (referred_by);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending', -- pending | rewarded
  reward_credits integer not null default 2,
  created_at timestamptz not null default now(),
  rewarded_at timestamptz,
  unique (referred_id) -- у реферала може бути лише один реферер
);

create index if not exists referrals_referrer_id_idx on public.referrals (referrer_id);
create index if not exists referrals_status_idx on public.referrals (status);

alter table public.referrals enable row level security;

-- Сервер (service role) керує усім — атрибуція при реєстрації й
-- нарахування бонусу після першої оплати відбуваються тільки з
-- серверних роутів (service role), як і для payments/credit_transactions.
create policy "Service role can manage referrals"
  on public.referrals for all
  to service_role
  using (true)
  with check (true);

-- Користувач бачить власну статистику запрошень (скільки запросив,
-- скільки вже винагороджено) на сторінці профілю.
create policy "Users can view own referrals as referrer"
  on public.referrals for select
  to authenticated
  using (auth.uid() = referrer_id);
