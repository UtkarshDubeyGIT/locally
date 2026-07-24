-- A successful Data API query keeps Free Plan projects active without exposing
-- application data or requiring an RLS-bypassing secret in the scheduler.
create or replace function public.keepalive()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select true;
$$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;
