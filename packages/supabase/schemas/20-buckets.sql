-- buckets
truncate storage.buckets cascade;

truncate storage.objects cascade;

-- drop all storage object and storage bucket policies
do $$
declare
rec record;
sql_text text;
begin
for rec in (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'storage' AND (tablename = 'objects' OR tablename = 'buckets')) loop
    sql_text := format('drop policy "%s" on storage.%I', rec.policyname, rec.tablename);
    raise notice '%', sql_text;
    execute sql_text;
end loop;
end;
$$;

insert into
  storage.buckets (id, name, public)
values
  ('documents', 'documents', false);
