create table "public"."documents" (
  "id" uuid not null default gen_random_uuid(),
  "name" text not null default 'New Document'::text,
  "description" text not null default 'A new document'::text,
  "updated_at" timestamp with time zone not null default now(),
  "template" jsonb not null default '{}'::jsonb
);

alter table "public"."documents" enable row level security;

create unique index documents_pkey on public.documents using btree (id);

alter table "public"."documents"
add constraint "documents_pkey" primary key using index "documents_pkey";

alter table "public"."documents"
add constraint "documents_description_check" check (
  (
    (0 < length(description))
    and (length(description) < 255)
  )
) not valid;

alter table "public"."documents" validate constraint "documents_description_check";

alter table "public"."documents"
add constraint "documents_name_check" check (
  (
    (0 < length(name))
    and (length(name) < 255)
  )
) not valid;

alter table "public"."documents" validate constraint "documents_name_check";

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant
select
  on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant
truncate on table "public"."documents" to "anon";

grant
update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

revoke insert on table "public"."documents"
from
  "authenticated";

grant references on table "public"."documents" to "authenticated";

grant
select
  on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant
truncate on table "public"."documents" to "authenticated";

revoke
update on table "public"."documents"
from
  "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant
select
  on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant
truncate on table "public"."documents" to "service_role";

grant
update on table "public"."documents" to "service_role";

create policy "anon_select" on "public"."documents" as permissive for
select
  to anon,
  authenticated using (true);

create policy "authenticated_delete" on "public"."documents" as permissive for delete to authenticated using (true);

grant insert (name, description, template) on "public"."documents" to "authenticated";

create policy "authenticated_insert" on "public"."documents" as permissive for insert to authenticated
with
  check (true);

grant
update (name, description, template) on "public"."documents" to "authenticated";

create policy "authenticated_update" on "public"."documents" as permissive
for update
  to authenticated using (true);
