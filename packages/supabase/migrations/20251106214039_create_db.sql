create extension if not exists "timescaledb"
with
  schema "extensions";

create schema if not exists "private";

set
  check_function_bodies = off;

create or replace function private.handle_auth_token (event jsonb) returns jsonb language plpgsql stable
set
  search_path to '' as $function$
declare
  claims     jsonb;
  new_claims jsonb;
  claim      text;
begin
  -- Claims like user_id, project_id, and backtest_id are used to create
  -- access tokens with specific, limited permissions. For example:
  -- - A token with user_id can only access that user's data
  -- - A token with project_id can only access that specific project
  -- - A token with backtest_id can only access that specific backtest
  -- Claims are restrictive, meaning if a token has multiple claims they will
  -- ALL need to match in order for access to be given.
  -- This granular permission system ensures that runner nodes (workers)
  -- can only access the resources they need for their assigned tasks.

  -- Here we set the user_id claim from the JWT.
  claims = event -> 'claims';

  claims = claims || jsonb_build_object('user_id', claims ->> 'sub');

  return jsonb_build_object('claims', claims);
end;
$function$;

create or replace function private.handle_auth_user_created () returns trigger language plpgsql security definer
set
  search_path to '' as $function$
begin
  insert into public.users (id) values (new.id);
  return new;
end;
$function$;

create or replace function private.handle_public_user_deleted () returns trigger language plpgsql security definer
set
  search_path to '' as $function$
begin
  delete from auth.users where id = old.id;
  return old;
end;
$function$;

create table "public"."users" (
  "id" uuid not null,
  "name" text not null default 'New user'::text,
  "avatar_url" text
);

alter table "public"."users" enable row level security;

create unique index users_pkey on public.users using btree (id);

alter table "public"."users"
add constraint "users_pkey" primary key using index "users_pkey";

alter table "public"."users"
add constraint "users_id_fkey" foreign key (id) references auth.users (id) on update cascade on delete cascade not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users"
add constraint "users_name_check" check (
  (
    (0 < length(name))
    and (length(name) <= 255)
  )
) not valid;

alter table "public"."users" validate constraint "users_name_check";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant
select
  on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant
truncate on table "public"."users" to "anon";

grant
update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant
select
  on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant
truncate on table "public"."users" to "authenticated";

grant
update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant
select
  on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant
truncate on table "public"."users" to "service_role";

grant
update on table "public"."users" to "service_role";

create policy "self_select" on "public"."users" as permissive for
select
  to authenticated using (
    (
      id = (
        select
          auth.uid () as uid
      )
    )
  );

create trigger on_auth_user_deleted
after delete on public.users for each row
execute function private.handle_public_user_deleted ();
