create policy chat_content_self_insert on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'chat_content'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()::text
    )
  );
