-- ==========================================================================
-- Мінімальна аналітика лійки — знайдено 2026-09-17: 63 з 84 користувачів
-- (75%) ніколи не генерували документ, і НЕМАЄ жодного технічного сліду
-- невдалої спроби (documents.status лише 'ready', жодного 'error') —
-- тобто вони не намагаються взагалі, ДО кнопки "Згенерувати". До цього
-- моменту не було ЖОДНОЇ аналітики (ні PostHog, ні GA, нічого) — рішення
-- ухвалювались наосліп.
--
-- Мінімум для початку: dashboard_view (відкрив дашборд) і generate_click
-- (натиснув кнопку, до результату) — щоб наступного разу відрізнити
-- "ніколи не відкривав форму" від "відкрив, налякався, пішов".
-- ==========================================================================
create table if not exists public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists funnel_events_user_idx on public.funnel_events (user_id);
create index if not exists funnel_events_event_idx on public.funnel_events (event, created_at);

alter table public.funnel_events enable row level security;

create policy "Service role can manage funnel_events"
  on public.funnel_events for all
  to service_role
  using (true)
  with check (true);

NOTIFY pgrst, 'reload schema';
