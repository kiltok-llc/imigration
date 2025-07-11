drop
from
  storage.buckets
where
  id = 'documents';

insert into
  storage.buckets (id, name, public)
values
  ('documents', 'documents', true);
