set
  check_function_bodies = off;

create table "public"."surveys" (
  "id" uuid not null default gen_random_uuid(),
  "name" text not null default 'New Survey'::text,
  "description" text not null default 'A new survey'::text,
  "updated_at" timestamp with time zone not null default now(),
  "json" jsonb not null default '{}'::jsonb
);

alter table "public"."surveys" enable row level security;

create unique index surveys_pkey on public.surveys using btree (id);

alter table "public"."surveys"
add constraint "surveys_pkey" primary key using index "surveys_pkey";

alter table "public"."surveys"
add constraint "surveys_description_check" check (
  (
    (0 < length(description))
    and (length(description) < 255)
  )
) not valid;

alter table "public"."surveys" validate constraint "surveys_description_check";

alter table "public"."surveys"
add constraint "surveys_name_check" check (
  (
    (0 < length(name))
    and (length(name) < 255)
  )
) not valid;

alter table "public"."surveys" validate constraint "surveys_name_check";

grant delete on table "public"."surveys" to "anon";

grant insert on table "public"."surveys" to "anon";

grant references on table "public"."surveys" to "anon";

grant
select
  on table "public"."surveys" to "anon";

grant trigger on table "public"."surveys" to "anon";

grant
truncate on table "public"."surveys" to "anon";

grant
update on table "public"."surveys" to "anon";

grant delete on table "public"."surveys" to "authenticated";

revoke insert on table "public"."surveys"
from
  "authenticated";

grant references on table "public"."surveys" to "authenticated";

grant
select
  on table "public"."surveys" to "authenticated";

grant trigger on table "public"."surveys" to "authenticated";

grant
truncate on table "public"."surveys" to "authenticated";

revoke
update on table "public"."surveys"
from
  "authenticated";

grant delete on table "public"."surveys" to "service_role";

grant insert on table "public"."surveys" to "service_role";

grant references on table "public"."surveys" to "service_role";

grant
select
  on table "public"."surveys" to "service_role";

grant trigger on table "public"."surveys" to "service_role";

grant
truncate on table "public"."surveys" to "service_role";

grant
update on table "public"."surveys" to "service_role";

create policy "anon_select" on "public"."surveys" as permissive for
select
  to anon,
  authenticated using (true);

create policy "authenticated_delete" on "public"."surveys" as permissive for delete to authenticated using (true);

grant insert (name, description, json) on "public"."surveys" to "authenticated";

create policy "authenticated_insert" on "public"."surveys" as permissive for insert to authenticated
with
  check (true);

grant
update (name, description, json) on "public"."surveys" to "authenticated";

create policy "authenticated_update" on "public"."surveys" as permissive
for update
  to authenticated using (true);
