-- Create lifecycle_items table
create table if not exists lifecycle_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  stage text default 'idea' check (stage in ('idea', 'build', 'grow', 'managed', 'sunset')),
  workflow_id text default 'default',
  data jsonb default '{}',
  metrics jsonb default '{}',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS
alter table lifecycle_items enable row level security;

-- Create RLS policy (public read/write for now - update for production)
create policy "Allow public access"
  on lifecycle_items for all
  using (true)
  with check (true);

-- Create index for faster queries
create index if not exists idx_lifecycle_items_stage on lifecycle_items(stage);
create index if not exists idx_lifecycle_items_workflow_id on lifecycle_items(workflow_id);
create index if not exists idx_lifecycle_items_created_at on lifecycle_items(created_at desc);
