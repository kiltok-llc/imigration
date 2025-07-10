alter table "public"."documents"
add column generated_fields jsonb not null default '[]'::jsonb check (
  jsonb_typeof(generated_fields) = 'array'
  and pg_column_size(generated_fields) < 10000
);

grant insert (generated_fields) on documents to authenticated;

grant
update (generated_fields) on documents to authenticated;
