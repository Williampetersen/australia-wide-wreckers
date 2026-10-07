-- RLS and realtime-authorization checks for the live chat.
--
-- Run against a THROWAWAY database after applying the migration, for example:
--   supabase db reset            (local Supabase: needs Docker)
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls.sql
-- or paste the whole file into the Supabase SQL editor of a scratch project.
-- Everything runs inside one transaction that is rolled back at the end.
-- Any failed expectation raises an exception with a message starting "FAIL:".

begin;

-- Fixtures: two anonymous visitors, one agent and one signed-in user who is NOT an agent.
insert into auth.users (id, instance_id, aud, role, email, is_anonymous)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', null, true),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', null, true),
  ('00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'agent@test.local', false),
  ('00000000-0000-0000-0000-0000000000d4', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nobody@test.local', false);

insert into public.agents (user_id, display_name, role, status)
values ('00000000-0000-0000-0000-0000000000c3', 'Test Agent', 'agent', 'online');

insert into public.visitors (id, name) values
  ('00000000-0000-0000-0000-0000000000a1', 'Visitor A'),
  ('00000000-0000-0000-0000-0000000000b2', 'Visitor B');

insert into public.conversations (id, visitor_id) values
  ('11111111-1111-1111-1111-1111111111a1', '00000000-0000-0000-0000-0000000000a1'),
  ('22222222-2222-2222-2222-2222222222b2', '00000000-0000-0000-0000-0000000000b2');

-- Seed messages as the (trusted) owner role, including an internal note in A's chat.
insert into public.messages (conversation_id, sender_type, type, body, is_internal)
values
  ('11111111-1111-1111-1111-1111111111a1', 'visitor', 'text', 'hello from A', false),
  ('11111111-1111-1111-1111-1111111111a1', 'agent',   'text', 'private note about A', true),
  ('22222222-2222-2222-2222-2222222222b2', 'visitor', 'text', 'hello from B', false);

create or replace function pg_temp.act_as(p_uid uuid, p_anonymous boolean)
returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    json_build_object('sub', p_uid, 'role', 'authenticated', 'is_anonymous', p_anonymous)::text, true);
  perform set_config('request.jwt.claim.sub', p_uid::text, true);
  set local role authenticated;
end $$;

create or replace function pg_temp.expect_error(p_sql text, p_label text)
returns void language plpgsql as $$
begin
  begin
    execute p_sql;
  exception when others then
    return; -- an error is the expected outcome
  end;
  raise exception 'FAIL: % should have been rejected', p_label;
end $$;

create or replace function pg_temp.expect_no_rows(p_sql text, p_label text)
returns void language plpgsql as $$
declare n integer;
begin
  begin
    execute p_sql;
    get diagnostics n = row_count;
  exception when others then
    return; -- an error also counts as rejected
  end;
  if n <> 0 then raise exception 'FAIL: % changed % row(s)', p_label, n; end if;
end $$;

-- ---------------------------------------------------------------------------
-- Visitor A
-- ---------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000a1', true);

do $$
declare n integer;
begin
  select count(*) into n from public.messages where conversation_id = '22222222-2222-2222-2222-2222222222b2';
  if n <> 0 then raise exception 'FAIL: visitor A can read visitor B messages'; end if;

  select count(*) into n from public.messages where is_internal;
  if n <> 0 then raise exception 'FAIL: visitor A can read internal notes'; end if;

  select count(*) into n from public.messages where conversation_id = '11111111-1111-1111-1111-1111111111a1';
  if n <> 1 then raise exception 'FAIL: visitor A should see exactly their own public message, saw %', n; end if;

  select count(*) into n from public.conversations;
  if n <> 0 then raise exception 'FAIL: visitors must not read the conversations table directly'; end if;

  select count(*) into n from public.visitors;
  if n <> 0 then raise exception 'FAIL: visitors must not read the visitors table directly'; end if;

  select count(*) into n from public.my_conversations;
  if n <> 1 then raise exception 'FAIL: my_conversations should return only A''s conversation, got %', n; end if;

  select count(*) into n from public.agents;
  if n <> 0 then raise exception 'FAIL: visitors must not read the agents table'; end if;

  if public.can_access_topic('inbox') then raise exception 'FAIL: visitor can join inbox'; end if;
  if public.can_access_topic('agents') then raise exception 'FAIL: visitor can join agents presence'; end if;
  if public.can_access_topic('conversation:22222222-2222-2222-2222-2222222222b2') then
    raise exception 'FAIL: visitor A can join visitor B topic'; end if;
  if not public.can_access_topic('conversation:11111111-1111-1111-1111-1111111111a1') then
    raise exception 'FAIL: visitor A cannot join their own topic'; end if;
  if public.can_access_topic('conversation:not-a-uuid') then raise exception 'FAIL: malformed topic accepted'; end if;
end $$;

select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, body) values ('22222222-2222-2222-2222-2222222222b2', 'visitor', 'text', 'x')$$,
  'visitor A writing into B''s conversation');
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, body) values ('11111111-1111-1111-1111-1111111111a1', 'agent', 'text', 'x')$$,
  'visitor posing as agent');
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, body) values ('11111111-1111-1111-1111-1111111111a1', 'system', 'system', 'x')$$,
  'visitor posing as system');
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, body, payload) values ('11111111-1111-1111-1111-1111111111a1', 'visitor', 'offer', 'x', '{"amount": 9999}')$$,
  'visitor inserting an offer');
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, body) values ('11111111-1111-1111-1111-1111111111a1', 'visitor', 'form_request', 'x')$$,
  'visitor inserting a form request');
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, body, is_internal) values ('11111111-1111-1111-1111-1111111111a1', 'visitor', 'text', 'x', true)$$,
  'visitor inserting an internal note');
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, attachments) values ('11111111-1111-1111-1111-1111111111a1', 'visitor', 'image', '[{"path":"22222222-2222-2222-2222-2222222222b2/x.jpg"}]')$$,
  'visitor attaching a file from another conversation');
select pg_temp.expect_no_rows(
  $$update public.conversations set lead_status = 'purchased' where id = '11111111-1111-1111-1111-1111111111a1'$$,
  'visitor editing a conversation');
select pg_temp.expect_error(
  $$insert into public.conversations (visitor_id) values ('00000000-0000-0000-0000-0000000000a1')$$,
  'visitor creating a conversation directly');
select pg_temp.expect_error(
  $$select public.admin_analytics(now() - interval '1 day', now())$$,
  'visitor calling admin analytics');
select pg_temp.expect_error(
  $$select * from public.admin_search('hello')$$,
  'visitor calling admin search');

-- A normal visitor message works, and the 16th message in a minute is rate limited.
do $$
declare i integer; limited boolean := false;
begin
  insert into public.messages (conversation_id, sender_type, type, body)
  values ('11111111-1111-1111-1111-1111111111a1', 'visitor', 'text', 'allowed message');
  for i in 1..20 loop
    begin
      insert into public.messages (conversation_id, sender_type, type, body)
      values ('11111111-1111-1111-1111-1111111111a1', 'visitor', 'text', 'spam ' || i);
    exception when others then
      limited := true;
      exit;
    end;
  end loop;
  if not limited then raise exception 'FAIL: rate limit did not trigger'; end if;
end $$;

reset role;

-- A blocked visitor cannot send.
update public.visitors set blocked_at = now() where id = '00000000-0000-0000-0000-0000000000b2';
select pg_temp.act_as('00000000-0000-0000-0000-0000000000b2', true);
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, body) values ('22222222-2222-2222-2222-2222222222b2', 'visitor', 'text', 'blocked?')$$,
  'blocked visitor sending');
reset role;

-- ---------------------------------------------------------------------------
-- Signed-in user without an agents row
-- ---------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000d4', false);
do $$
declare n integer;
begin
  if public.is_agent() then raise exception 'FAIL: non-agent treated as agent'; end if;
  select count(*) into n from public.conversations;
  if n <> 0 then raise exception 'FAIL: non-agent can read conversations'; end if;
  select count(*) into n from public.messages;
  if n <> 0 then raise exception 'FAIL: non-agent can read messages'; end if;
  select count(*) into n from public.quote_requests;
  if n <> 0 then raise exception 'FAIL: non-agent can read quote requests'; end if;
  if public.can_access_topic('inbox') then raise exception 'FAIL: non-agent can join inbox'; end if;
end $$;
select pg_temp.expect_error($$select public.admin_analytics(now() - interval '1 day', now())$$, 'non-agent analytics');
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, type, body, sender_agent_id) values ('11111111-1111-1111-1111-1111111111a1', 'agent', 'text', 'x', '00000000-0000-0000-0000-0000000000d4')$$,
  'non-agent posing as agent');
reset role;

-- ---------------------------------------------------------------------------
-- Agent
-- ---------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000c3', false);
do $$
declare n integer;
begin
  if not public.is_agent() then raise exception 'FAIL: agent not recognised'; end if;
  select count(*) into n from public.conversations;
  if n <> 2 then raise exception 'FAIL: agent should see both conversations, saw %', n; end if;
  select count(*) into n from public.messages where is_internal;
  if n <> 1 then raise exception 'FAIL: agent should see the internal note'; end if;
  if not public.can_access_topic('inbox') then raise exception 'FAIL: agent cannot join inbox'; end if;
  if not public.can_access_topic('agents') then raise exception 'FAIL: agent cannot join presence'; end if;

  insert into public.messages (conversation_id, sender_type, sender_agent_id, type, body)
  values ('11111111-1111-1111-1111-1111111111a1', 'agent', '00000000-0000-0000-0000-0000000000c3', 'text', 'hi from the agent');
end $$;
select pg_temp.expect_error(
  $$insert into public.messages (conversation_id, sender_type, sender_agent_id, type, body) values ('11111111-1111-1111-1111-1111111111a1', 'agent', '00000000-0000-0000-0000-0000000000a1', 'text', 'x')$$,
  'agent posting as someone else');
select pg_temp.expect_error(
  $$update public.agents set role = 'owner' where user_id = '00000000-0000-0000-0000-0000000000c3'$$,
  'agent promoting themselves');
select pg_temp.expect_no_rows(
  $$delete from public.conversations where id = '22222222-2222-2222-2222-2222222222b2'$$,
  'non-admin agent deleting a conversation');
reset role;

-- Anonymous (not signed in) role gets nothing except availability and public settings.
set local role anon;
do $$
begin
  perform public.chat_availability();
  perform 1 from public.chat_public_settings;
exception when others then
  raise exception 'FAIL: anon should read availability and public settings: %', sqlerrm;
end $$;
select pg_temp.expect_error($$select * from public.messages$$, 'anon reading messages');
select pg_temp.expect_error($$select * from public.chat_settings$$, 'anon reading private settings');
reset role;

select 'ALL RLS CHECKS PASSED' as result;

rollback;
