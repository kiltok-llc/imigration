-- surveys table
drop table if exists surveys cascade;

create table surveys (
  id uuid not null primary key default gen_random_uuid(),
  name text not null default 'New Survey' check (
    0 < length(name)
    and length(name) < 255
  ),
  description text not null default 'A new survey' check (
    0 < length(description)
    and length(description) < 255
  ),
  updated_at timestamptz not null default now(),
  json jsonb not null default '{}'::jsonb
);

alter table surveys enable row level security;

-- anyone can query surveys
create policy anon_select on surveys for
select
  to anon,
  authenticated using (true);

-- authenticated users can insert surveys
revoke insert on surveys
from
  authenticated;

grant insert (name, description, json) on surveys to authenticated;

create policy authenticated_insert on surveys for insert to authenticated
with
  check (true);

-- authenticated users can update surveys
revoke
update on surveys
from
  authenticated;

grant
update (name, description, json) on surveys to authenticated;

create policy authenticated_update on surveys
for update
  to authenticated using (true);

-- authenticated users can delete surveys
create policy authenticated_delete on surveys for delete to authenticated using (true);
