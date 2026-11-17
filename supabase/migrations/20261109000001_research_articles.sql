create table if not exists public.research_articles (
  id uuid primary key default gen_random_uuid(),
  language text not null check (language in ('fa', 'en', 'ar', 'ckb')),
  category text not null default 'other',
  title text not null check (length(trim(title)) between 1 and 180),
  description text not null check (length(trim(description)) between 1 and 1200),
  cover_url text not null,
  download_url text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (download_url ~ '^https://')
);

alter table public.research_articles
  add constraint research_articles_category_check
  check (category in ('astronomy', 'astrology', 'tarot', 'psychology', 'spirituality', 'other'));

create index if not exists research_articles_publication_idx
  on public.research_articles (language, published, created_at desc);
create index if not exists research_articles_category_publication_idx
  on public.research_articles (language, published, category, created_at desc);

alter table public.research_articles enable row level security;

drop policy if exists "Published research articles are readable" on public.research_articles;
create policy "Published research articles are readable"
  on public.research_articles
  for select
  to anon, authenticated
  using (
    published
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins manage research articles" on public.research_articles;
create policy "Admins manage research articles"
  on public.research_articles
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

revoke all on public.research_articles from anon, authenticated;
grant select on public.research_articles to anon, authenticated;
grant insert, update, delete on public.research_articles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'research-article-covers',
  'research-article-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins upload research covers" on storage.objects;
create policy "Admins upload research covers"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'research-article-covers'
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins update research covers" on storage.objects;
create policy "Admins update research covers"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'research-article-covers'
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    bucket_id = 'research-article-covers'
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins delete research covers" on storage.objects;
create policy "Admins delete research covers"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'research-article-covers'
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );
