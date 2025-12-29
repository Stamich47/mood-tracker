-- Create a table for daily logs
create table public.daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null default current_date,
  mood integer check (mood >= 1 and mood <= 5),
  worked_out boolean default false,
  exercises text[] default '{}',
  drinks integer default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure one log per user per day
  unique(user_id, date)
);

-- Set up Row Level Security (RLS)
alter table public.daily_logs enable row level security;

-- Create policies
create policy "Users can view their own logs"
  on public.daily_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own logs"
  on public.daily_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own logs"
  on public.daily_logs for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own logs"
  on public.daily_logs for delete
  using ( auth.uid() = user_id );
