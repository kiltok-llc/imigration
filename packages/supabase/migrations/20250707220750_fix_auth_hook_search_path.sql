create or replace function private.handle_auth_token (event jsonb) returns jsonb language plpgsql stable
set
  search_path = '' as $function$
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
