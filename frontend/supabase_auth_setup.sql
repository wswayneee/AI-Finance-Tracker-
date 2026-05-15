-- 1. Tambahkan kolom user_id ke tabel transactions
alter table public.transactions add column user_id uuid references auth.users(id);

-- 2. Update existing rows (optional, if you want to assign existing data to a specific user, or just delete old test data)
-- delete from public.transactions where user_id is null;

-- 3. Pastikan RLS aktif (harus sudah aktif dari setup sebelumnya)
alter table public.transactions enable row level security;

-- 4. Hapus policy lama (yang membolehkan semua orang mengakses)
drop policy if exists "Allow public insert" on public.transactions;
drop policy if exists "Allow public select" on public.transactions;
drop policy if exists "Allow public delete" on public.transactions;
drop policy if exists "Allow public update" on public.transactions;

-- 5. Buat policy baru yang HANYA membolehkan user mengakses datanya sendiri
create policy "Users can insert their own transactions" 
on public.transactions for insert 
with check (auth.uid() = user_id);

create policy "Users can view their own transactions" 
on public.transactions for select 
using (auth.uid() = user_id);

create policy "Users can update their own transactions" 
on public.transactions for update 
using (auth.uid() = user_id);

create policy "Users can delete their own transactions" 
on public.transactions for delete 
using (auth.uid() = user_id);
