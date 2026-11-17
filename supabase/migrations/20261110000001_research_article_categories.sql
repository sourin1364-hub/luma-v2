alter table public.research_articles
  add column if not exists category text not null default 'other';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'research_articles_category_check'
      and conrelid = 'public.research_articles'::regclass
  ) then
    alter table public.research_articles
      add constraint research_articles_category_check
      check (category in ('astronomy', 'astrology', 'tarot', 'psychology', 'spirituality', 'other'));
  end if;
end;
$$;

create index if not exists research_articles_category_publication_idx
  on public.research_articles (language, published, category, created_at desc);
