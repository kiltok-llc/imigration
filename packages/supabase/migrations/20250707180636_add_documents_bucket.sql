insert into
  storage.buckets (id, name, public)
values
  ('documents', 'documents', false);

create policy authenticated_documents_select on storage.objects for
select
  to authenticated using (bucket_id = 'documents');

create policy authenticated_documents_insert on storage.objects for insert to authenticated
with
  check (bucket_id = 'documents');

create policy authenticated_documents_update on storage.objects
for update
  to authenticated using (bucket_id = 'documents')
with
  check (bucket_id = 'documents');

create policy authenticated_documents_delete on storage.objects for delete to authenticated using (bucket_id = 'documents')
