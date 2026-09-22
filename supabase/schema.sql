-- Voice Authenticity Lab: Supabase schema
create extension if not exists pgcrypto;
create table if not exists public.audio_samples (
  id uuid primary key default gen_random_uuid(), name text not null, storage_path text not null unique,
  sample_rate integer not null check (sample_rate = 44100), is_active boolean not null default true,
  ground_truth text not null check (ground_truth in ('real','deepfake')), created_at timestamptz not null default now()
);
create table if not exists public.trials (
  id uuid primary key default gen_random_uuid(), sample_id uuid not null references public.audio_samples(id),
  answer text not null check (answer in ('0','1')), is_correct boolean, response_ms integer,
  session_id text, created_at timestamptz not null default now()
);
alter table public.audio_samples enable row level security; alter table public.trials enable row level security;
create policy "public reads active sample metadata" on public.audio_samples for select to anon using (is_active = true);
create policy "public can insert trials" on public.trials for insert to anon with check (answer in ('0','1'));
create policy "no public trial reads" on public.trials for select to anon using (false);
insert into storage.buckets (id,name,public) values ('audio','audio',true) on conflict (id) do nothing;
