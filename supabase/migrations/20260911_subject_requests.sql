-- "Не знайшли свій предмет?" форма на головній сторінці — окремо від
-- school_leads (інша мета: продуктовий беклог, не продаж школам).

create table if not exists public.subject_requests (
  id uuid primary key default gen_random_uuid(),
  request_text text not null,
  email text,
  status text not null default 'new', -- new | planned | done | declined
  created_at timestamptz not null default now()
);

create index if not exists subject_requests_status_idx on public.subject_requests (status);
create index if not exists subject_requests_created_at_idx on public.subject_requests (created_at desc);

alter table public.subject_requests enable row level security;

-- Так само, як school_leads: форма неавтентифікована, увесь доступ —
-- через service role в /api/subject-requests.
create policy "Service role can manage subject requests"
  on public.subject_requests for all
  to service_role
  using (true)
  with check (true);
