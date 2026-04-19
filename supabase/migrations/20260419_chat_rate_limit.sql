-- Rate-limit storage for the floating chatbot at /api/chat.
-- IPs are SHA-256 hashed before insertion; no raw PII is stored.

create table if not exists chat_requests (
  id bigserial primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_requests_ip_time
  on chat_requests (ip_hash, created_at desc);

-- Atomic check + insert. Allowed iff count in the sliding window < p_limit.
-- Returns one row: {allowed, remaining, retry_after_seconds}.
create or replace function chat_rate_limit_check(
  p_ip_hash text,
  p_limit int,
  p_window_seconds int
) returns table(allowed boolean, remaining int, retry_after_seconds int)
language plpgsql as $$
declare
  v_count int;
  v_oldest timestamptz;
begin
  select count(*), min(created_at)
    into v_count, v_oldest
    from chat_requests
    where ip_hash = p_ip_hash
      and created_at > now() - (p_window_seconds || ' seconds')::interval;

  if v_count >= p_limit then
    return query select
      false,
      0,
      greatest(
        1,
        extract(epoch from (v_oldest + (p_window_seconds || ' seconds')::interval - now()))::int
      );
    return;
  end if;

  insert into chat_requests (ip_hash) values (p_ip_hash);
  return query select true, (p_limit - v_count - 1), 0;
end;
$$;
