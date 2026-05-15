-- Buat tabel transaksi
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  item text not null,
  cat text not null,
  type text not null,
  amount numeric not null,
  date text,
  time text
);

-- Aktifkan Row Level Security (RLS)
alter table public.transactions enable row level security;

-- Buat policy agar aplikasi bisa membaca, menambah, dan menghapus data
create policy "Allow public insert" on public.transactions
  for insert with check (true);

create policy "Allow public select" on public.transactions
  for select using (true);

create policy "Allow public delete" on public.transactions
  for delete using (true);
