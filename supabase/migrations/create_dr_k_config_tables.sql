-- K博士配置管理表

-- 提示词配置表
create table if not exists dr_k_prompts (
  id uuid primary key default uuid_generate_v4(),
  category text not null, -- 'speaking_style', 'knowledge', 'scenario', 'rule'
  title text not null,
  content text not null,
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 知识库表
create table if not exists dr_k_knowledge (
  id uuid primary key default uuid_generate_v4(),
  topic text not null, -- 'learning', 'emotion', 'social', 'future', etc.
  title text not null,
  content text not null,
  tags text[],
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 场景提示词表
create table if not exists dr_k_scenarios (
  id uuid primary key default uuid_generate_v4(),
  scenario_name text not null, -- 'difficulty', 'achievement', 'emotion', etc.
  title text not null,
  prompt text not null,
  example text,
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS 策略
alter table dr_k_prompts enable row level security;
alter table dr_k_knowledge enable row level security;
alter table dr_k_scenarios enable row level security;

-- 管理员可以查看和编辑
create policy "Admins can manage prompts"
  on dr_k_prompts for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can manage knowledge"
  on dr_k_knowledge for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can manage scenarios"
  on dr_k_scenarios for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
