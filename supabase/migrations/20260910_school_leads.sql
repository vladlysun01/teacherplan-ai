-- Заявки шкіл/методоб'єднань з /dlya-shkil (роадмап: TeacherPlan AI →
-- Далі → продаж школам). Оплата не миттєва карткою — заявка потрапляє
-- сюди, адмін зв'язується й за потреби виставляє рахунок вручну
-- (app/admin/schools, lib/invoice-builder.ts).

create table if not exists public.school_leads (
  id uuid primary key default gen_random_uuid(),
  school_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  teachers_count text, -- діапазон з форми ("1-10", "10-25", "25+"), не точне число
  package_id text, -- "10" | "25" | "unlimited" — орієнтир, фінальну суму адмін узгоджує особисто
  comment text,
  status text not null default 'new', -- new | contacted | invoiced | paid | declined
  created_at timestamptz not null default now()
);

create index if not exists school_leads_status_idx on public.school_leads (status);
create index if not exists school_leads_created_at_idx on public.school_leads (created_at desc);

alter table public.school_leads enable row level security;

-- Форма на /dlya-shkil неавтентифікована (директор школи не має і не
-- повинен мати акаунт TeacherPlan, щоб просто залишити заявку) — запис
-- і читання йдуть виключно через service role в /api/school-leads і
-- /api/admin/schools, тому окремих authenticated/anon policy не додаємо.
create policy "Service role can manage school leads"
  on public.school_leads for all
  to service_role
  using (true)
  with check (true);
