-- Live chat for Australia Wide Wreckers.
-- Human agents only: no bot, no automated answers. See README "Live chat".
--
-- Security model (read this before editing):
--  * Anonymous visitors sign in with Supabase anonymous auth and therefore use the
--    `authenticated` Postgres role. Never write `to authenticated using (true)`.
--  * Agent access always goes through public.is_agent() / public.is_admin().
--  * Visitor access is always ownership (visitor_id = auth.uid()) and, where a table
--    holds internal fields, goes through an owner-privileged view that exposes only
--    the columns the widget needs (no direct table grants for visitors).
--  * All times are timestamptz (UTC); the UI displays Australia/Sydney.

create extension if not exists pg_trgm with schema extensions;
create extension if not exists pg_net;
create extension if not exists pg_cron with schema pg_catalog;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.agents (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  role text not null default 'agent' check (role in ('owner', 'admin', 'agent')),
  status text not null default 'offline' check (status in ('online', 'away', 'offline')),
  status_changed_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_assigned_at timestamptz,
  notify_push boolean not null default true,
  notify_email boolean not null default true,
  notify_sound boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents (user_id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create table public.visitors (
  id uuid primary key references auth.users (id) on delete cascade,
  name text check (name is null or char_length(name) <= 120),
  email text check (email is null or char_length(email) <= 254),
  phone text check (phone is null or phone ~ '^\+61\d{9}$'),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  current_page text check (current_page is null or char_length(current_page) <= 500),
  landing_page text,
  referrer text,
  utm jsonb not null default '{}'::jsonb,
  click_ids jsonb not null default '{}'::jsonb,
  city text,
  region text,
  country text,
  device text,
  browser text,
  os text,
  blocked_at timestamptz,
  blocked_reason text
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references public.visitors (id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  assigned_agent_id uuid references public.agents (user_id) on delete set null,
  source_page text,
  vehicle_type text,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  vehicle_condition text,
  rego text,
  suburb text,
  postcode text,
  lead_status text not null default 'new'
    check (lead_status in ('new', 'contacted', 'offer_sent', 'offer_accepted', 'pickup_booked', 'purchased', 'lost')),
  offer_amount numeric(10, 2),
  pickup_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  last_message_at timestamptz not null default now(),
  last_message_preview text,
  last_message_sender text,
  unread_for_agents integer not null default 0,
  unread_for_visitor integer not null default 0,
  visitor_last_read_at timestamptz,
  agent_last_read_at timestamptz,
  first_response_at timestamptz,
  closed_at timestamptz,
  closed_by uuid references public.agents (user_id) on delete set null,
  rating smallint check (rating between 1 and 5),
  rating_comment text check (rating_comment is null or char_length(rating_comment) <= 1000),
  missed_notified_at timestamptz,
  visitor_emailed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  seq bigint generated always as identity,
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_type text not null check (sender_type in ('visitor', 'agent', 'system')),
  sender_agent_id uuid references public.agents (user_id) on delete set null,
  type text not null default 'text'
    check (type in ('text', 'image', 'form_request', 'form_response', 'offer', 'system')),
  body text not null default '' check (char_length(body) <= 4000),
  attachments jsonb not null default '[]'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  is_internal boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  constraint messages_seq_unique unique (seq)
);

create table public.canned_responses (
  id uuid primary key default gen_random_uuid(),
  shortcut text not null unique check (shortcut ~ '^[a-z0-9_-]{1,40}$'),
  title text not null,
  body text not null check (char_length(body) <= 4000),
  usage_count integer not null default 0,
  created_by uuid references public.agents (user_id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.chat_settings (
  id integer primary key default 1 check (id = 1),
  accent_colour text not null default '#feba02',
  launcher_label text not null default 'Chat with us',
  welcome_title text not null default 'Australia Wide Wreckers',
  welcome_text text not null default 'Hi! Tell us about your car and one of our team will reply shortly.',
  quick_chips jsonb not null default '["Get a cash offer for my car","Can you pick up today?","What paperwork do I need?","Talk to someone"]'::jsonb,
  hidden_paths text[] not null default '{}',
  business_hours jsonb not null default '{
    "mon": {"open": "09:00", "close": "17:00"},
    "tue": {"open": "09:00", "close": "17:00"},
    "wed": {"open": "09:00", "close": "17:00"},
    "thu": {"open": "09:00", "close": "17:00"},
    "fri": {"open": "09:00", "close": "17:00"},
    "sat": {"open": "09:00", "close": "17:00"},
    "sun": null
  }'::jsonb,
  timezone text not null default 'Australia/Sydney',
  live_only_in_business_hours boolean not null default true,
  offline_message text not null default 'We''re offline right now. Leave your name and number and we''ll call you back as soon as we''re open.',
  missed_chat_minutes integer not null default 3 check (missed_chat_minutes between 1 and 120),
  visitor_email_after_minutes integer not null default 5 check (visitor_email_after_minutes between 1 and 240),
  auto_assign boolean not null default false,
  retention_months integer not null default 24 check (retention_months between 1 and 120),
  turnstile_enabled boolean not null default false,
  notify_emails text[] not null default '{}',
  updated_at timestamptz not null default now()
);
insert into public.chat_settings (id) values (1) on conflict do nothing;

-- Copy of every /api/quote submission so admins see form leads next to chat leads.
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  vehicle_type text,
  condition text,
  make text,
  model text,
  car_model text,
  car_year text,
  rego text,
  suburb text,
  postal_code text,
  name text,
  phone text,
  email text,
  note text,
  page text,
  raw jsonb not null default '{}'::jsonb,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'offer_sent', 'offer_accepted', 'pickup_booked', 'purchased', 'lost')),
  assigned_agent_id uuid references public.agents (user_id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index messages_conversation_seq_idx on public.messages (conversation_id, seq desc);
create index conversations_status_last_idx on public.conversations (status, last_message_at desc);
create index conversations_assigned_idx on public.conversations (assigned_agent_id, status);
create index conversations_lead_status_idx on public.conversations (lead_status);
create index conversations_visitor_idx on public.conversations (visitor_id);
create index visitors_phone_idx on public.visitors (phone);
create index visitors_email_idx on public.visitors (email);
create index quote_requests_created_idx on public.quote_requests (created_at desc);
create index messages_body_trgm on public.messages using gin (body extensions.gin_trgm_ops);
create index visitors_name_trgm on public.visitors using gin (name extensions.gin_trgm_ops);
create index visitors_phone_trgm on public.visitors using gin (phone extensions.gin_trgm_ops);
create index visitors_email_trgm on public.visitors using gin (email extensions.gin_trgm_ops);
create index conversations_rego_trgm on public.conversations using gin (rego extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

create or replace function public.is_agent()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.agents a where a.user_id = (select auth.uid()) and a.active
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.agents a
    where a.user_id = (select auth.uid()) and a.active and a.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_anonymous_user()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false);
$$;

create or replace function public.owns_conversation(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.conversations c
    where c.id = p_conversation_id and c.visitor_id = (select auth.uid())
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger conversations_updated_at before update on public.conversations
  for each row execute function public.set_updated_at();
create trigger canned_updated_at before update on public.canned_responses
  for each row execute function public.set_updated_at();
create trigger settings_updated_at before update on public.chat_settings
  for each row execute function public.set_updated_at();

-- Server-to-server call into our Next.js API, signed with a shared secret kept in Vault.
-- A no-op until the secrets exist, so local dev and fresh projects keep working.
create or replace function public.notify_api(p_path text, p_body jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url text;
  v_secret text;
begin
  select decrypted_secret into v_url from vault.decrypted_secrets where name = 'chat_site_url' limit 1;
  select decrypted_secret into v_secret from vault.decrypted_secrets where name = 'chat_webhook_secret' limit 1;
  if v_url is null or v_secret is null then
    return;
  end if;
  perform net.http_post(
    url := rtrim(v_url, '/') || p_path,
    body := p_body,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_secret
    ),
    timeout_milliseconds := 5000
  );
exception when others then
  -- Never block a chat message because a webhook failed.
  null;
end;
$$;
revoke all on function public.notify_api(text, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Message rules, aggregates and realtime fan-out
-- ---------------------------------------------------------------------------

create or replace function public.messages_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_internal boolean := coalesce(current_setting('chat.internal', true), '') = '1';
  v_visitor_id uuid;
  v_blocked timestamptz;
  v_att jsonb;
begin
  new.created_at := now();

  select c.visitor_id into v_visitor_id from public.conversations c where c.id = new.conversation_id;
  if v_visitor_id is null then
    raise exception 'conversation not found' using errcode = 'P0002';
  end if;

  -- Trusted server paths: secret-key requests and our own SECURITY DEFINER RPCs.
  if v_internal or (select auth.role()) = 'service_role' then
    return new;
  end if;

  if public.is_agent() then
    if new.sender_type <> 'agent' or new.sender_agent_id is distinct from v_uid then
      raise exception 'agents may only send as themselves' using errcode = '42501';
    end if;
    return new;
  end if;

  -- Everyone else must be the visitor who owns this conversation.
  if v_uid is null or v_uid <> v_visitor_id then
    raise exception 'not your conversation' using errcode = '42501';
  end if;
  select v.blocked_at into v_blocked from public.visitors v where v.id = v_uid;
  if v_blocked is not null then
    raise exception 'chat unavailable' using errcode = '42501';
  end if;
  if new.sender_type <> 'visitor' or new.type not in ('text', 'image')
     or new.is_internal or new.sender_agent_id is not null or new.payload <> '{}'::jsonb then
    raise exception 'visitors may only send text or images' using errcode = '42501';
  end if;
  if new.type = 'text' and char_length(btrim(new.body)) = 0 then
    raise exception 'empty message' using errcode = '23514';
  end if;
  if new.type = 'image' then
    if jsonb_typeof(new.attachments) <> 'array' or jsonb_array_length(new.attachments) not between 1 and 5 then
      raise exception 'between 1 and 5 images are required' using errcode = '23514';
    end if;
    for v_att in select * from jsonb_array_elements(new.attachments) loop
      if (v_att ->> 'path') is null or (v_att ->> 'path') not like (new.conversation_id::text || '/%') then
        raise exception 'invalid attachment path' using errcode = '42501';
      end if;
    end loop;
  elsif new.attachments <> '[]'::jsonb then
    raise exception 'text messages cannot carry attachments' using errcode = '23514';
  end if;

  -- Rate limit: 15 per minute, 300 per day.
  if (select count(*) from public.messages m
      where m.conversation_id in (select id from public.conversations where visitor_id = v_uid)
        and m.sender_type = 'visitor' and m.created_at > now() - interval '1 minute') >= 15 then
    raise exception 'You are sending messages too quickly. Please wait a moment.' using errcode = '54000';
  end if;
  if (select count(*) from public.messages m
      where m.conversation_id in (select id from public.conversations where visitor_id = v_uid)
        and m.sender_type = 'visitor' and m.created_at > now() - interval '1 day') >= 300 then
    raise exception 'Daily message limit reached. Please call us instead.' using errcode = '54000';
  end if;

  return new;
end;
$$;

create trigger messages_before_insert
  before insert on public.messages
  for each row execute function public.messages_before_insert();

create or replace function public.message_event_payload(m public.messages)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'seq', m.seq,
    'id', m.id,
    'conversation_id', m.conversation_id,
    'sender_type', m.sender_type,
    'sender_agent_id', m.sender_agent_id,
    'type', m.type,
    'body', m.body,
    'attachments', m.attachments,
    'payload', m.payload,
    'is_internal', m.is_internal,
    'created_at', m.created_at
  );
$$;

create or replace function public.messages_after_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_conv public.conversations;
  v_preview text;
  v_is_first boolean;
  v_event jsonb;
begin
  v_event := public.message_event_payload(new);
  v_preview := left(
    case
      when new.type = 'image' then '📷 Photo'
      when new.type = 'offer' then '💰 Cash offer'
      when new.type = 'form_request' then 'Requested details'
      when new.type = 'form_response' then 'Sent details'
      else regexp_replace(new.body, '\s+', ' ', 'g')
    end, 140);

  select * into v_conv from public.conversations where id = new.conversation_id for update;
  select count(*) = 1 into v_is_first from public.messages where conversation_id = new.conversation_id;

  if new.is_internal then
    -- Internal notes never touch the visitor-facing aggregates or topic.
    perform realtime.send(v_event, 'message', 'inbox', true);
    return new;
  end if;

  if new.sender_type = 'visitor' then
    update public.conversations set
      last_message_at = new.created_at,
      last_message_preview = v_preview,
      last_message_sender = 'visitor',
      unread_for_agents = unread_for_agents + 1,
      status = case when status = 'closed' then 'open' else status end,
      closed_at = case when status = 'closed' then null else closed_at end,
      missed_notified_at = null
    where id = new.conversation_id;
  elsif new.sender_type = 'agent' then
    update public.conversations set
      last_message_at = new.created_at,
      last_message_preview = v_preview,
      last_message_sender = 'agent',
      unread_for_visitor = unread_for_visitor + 1,
      first_response_at = coalesce(first_response_at, new.created_at),
      status = case when status = 'pending' then 'open' else status end
    where id = new.conversation_id;
  else
    update public.conversations set
      last_message_at = new.created_at,
      last_message_preview = v_preview,
      last_message_sender = 'system'
    where id = new.conversation_id;
  end if;

  perform realtime.send(v_event, 'message', 'conversation:' || new.conversation_id::text, true);
  perform realtime.send(v_event, 'message', 'inbox', true);

  if new.sender_type = 'visitor' and (v_is_first or new.type in ('text', 'image')) then
    perform public.notify_api('/api/chat/events', jsonb_build_object(
      'event', case when v_is_first then 'new_conversation' else 'visitor_message' end,
      'conversation_id', new.conversation_id,
      'message_id', new.id
    ));
  end if;

  return new;
end;
$$;

create trigger messages_after_insert
  after insert on public.messages
  for each row execute function public.messages_after_insert();

-- Slim "conversation updated" broadcast to the inbox; status changes also go to the visitor.
create or replace function public.conversations_after_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slim jsonb;
begin
  v_slim := jsonb_build_object(
    'id', new.id,
    'visitor_id', new.visitor_id,
    'status', new.status,
    'assigned_agent_id', new.assigned_agent_id,
    'lead_status', new.lead_status,
    'last_message_at', new.last_message_at,
    'last_message_preview', new.last_message_preview,
    'last_message_sender', new.last_message_sender,
    'unread_for_agents', new.unread_for_agents,
    'updated_at', new.updated_at
  );
  perform realtime.send(v_slim, 'conversation', 'inbox', true);

  if new.status is distinct from old.status then
    perform realtime.send(
      jsonb_build_object('id', new.id, 'status', new.status, 'closed_at', new.closed_at),
      'status', 'conversation:' || new.id::text, true);
  end if;
  if new.unread_for_visitor is distinct from old.unread_for_visitor and new.unread_for_visitor = 0 then
    perform realtime.send(
      jsonb_build_object('id', new.id, 'reader', 'visitor', 'at', new.visitor_last_read_at),
      'read', 'conversation:' || new.id::text, true);
  end if;
  if new.unread_for_agents is distinct from old.unread_for_agents and new.unread_for_agents = 0 then
    perform realtime.send(
      jsonb_build_object('id', new.id, 'reader', 'agent', 'at', new.agent_last_read_at),
      'read', 'conversation:' || new.id::text, true);
  end if;
  return new;
end;
$$;

create trigger conversations_after_update
  after update on public.conversations
  for each row execute function public.conversations_after_update();

create or replace function public.conversations_after_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.send(
    jsonb_build_object('id', new.id, 'visitor_id', new.visitor_id, 'status', new.status,
      'assigned_agent_id', new.assigned_agent_id, 'lead_status', new.lead_status,
      'last_message_at', new.last_message_at, 'updated_at', new.updated_at),
    'conversation', 'inbox', true);
  return new;
end;
$$;

create trigger conversations_after_insert
  after insert on public.conversations
  for each row execute function public.conversations_after_insert();

-- Round-robin auto assignment.
create or replace function public.next_round_robin_agent()
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  select a.user_id into v_id
  from public.agents a
  where a.active and a.status = 'online'
  order by a.last_assigned_at nulls first, a.created_at
  limit 1
  for update skip locked;
  if v_id is not null then
    update public.agents set last_assigned_at = now() where user_id = v_id;
  end if;
  return v_id;
end;
$$;
revoke all on function public.next_round_robin_agent() from public, anon, authenticated;

create or replace function public.conversations_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.assigned_agent_id is null
     and coalesce((select s.auto_assign from public.chat_settings s where s.id = 1), false) then
    new.assigned_agent_id := public.next_round_robin_agent();
  end if;
  return new;
end;
$$;

create trigger conversations_before_insert
  before insert on public.conversations
  for each row execute function public.conversations_before_insert();

-- ---------------------------------------------------------------------------
-- Visitor-facing views and RPCs (visitors never get direct table access)
-- ---------------------------------------------------------------------------

-- Owner-privileged views on purpose: they filter by auth.uid() and expose only safe columns.
create view public.my_conversations as
  select c.id, c.status, c.created_at, c.last_message_at, c.unread_for_visitor,
         c.agent_last_read_at, c.closed_at, c.rating, c.visitor_id
  from public.conversations c
  where c.visitor_id = (select auth.uid());

create view public.my_visitor as
  select v.id, v.name, v.email, v.phone, v.blocked_at is not null as blocked
  from public.visitors v
  where v.id = (select auth.uid());

create view public.agents_public as
  select a.user_id, a.display_name, a.avatar_url
  from public.agents a
  where a.active;

create view public.chat_public_settings as
  select s.accent_colour, s.launcher_label, s.welcome_title, s.welcome_text, s.quick_chips,
         s.hidden_paths, s.business_hours, s.timezone, s.live_only_in_business_hours,
         s.offline_message, s.turnstile_enabled
  from public.chat_settings s
  where s.id = 1;

create or replace function public.chat_availability()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  s public.chat_settings;
  v_agents integer;
  v_local timestamp;
  v_dow text;
  v_hours jsonb;
  v_in_hours boolean := true;
  v_next timestamptz;
  v_day timestamp;
  i integer;
  v_open time;
  v_close time;
begin
  select * into s from public.chat_settings where id = 1;
  select count(*) into v_agents from public.agents a
   where a.active and a.status = 'online' and a.last_seen_at > now() - interval '12 hours';

  v_local := now() at time zone s.timezone;
  v_dow := (array['sun','mon','tue','wed','thu','fri','sat'])[extract(dow from v_local)::int + 1];
  v_hours := s.business_hours -> v_dow;
  if v_hours is null or v_hours = 'null'::jsonb then
    v_in_hours := false;
  else
    v_open := (v_hours ->> 'open')::time;
    v_close := (v_hours ->> 'close')::time;
    v_in_hours := v_local::time >= v_open and v_local::time < v_close;
  end if;

  if not v_in_hours or v_agents = 0 then
    -- next opening time within the coming 8 days
    for i in 0..8 loop
      v_day := date_trunc('day', v_local) + make_interval(days => i);
      v_dow := (array['sun','mon','tue','wed','thu','fri','sat'])[extract(dow from v_day)::int + 1];
      v_hours := s.business_hours -> v_dow;
      if v_hours is not null and v_hours <> 'null'::jsonb then
        v_open := (v_hours ->> 'open')::time;
        if (v_day + v_open) > v_local then
          v_next := (v_day + v_open) at time zone s.timezone;
          exit;
        end if;
      end if;
    end loop;
  end if;

  return jsonb_build_object(
    'live', v_agents > 0 and (v_in_hours or not s.live_only_in_business_hours),
    'agents_online', v_agents,
    'next_open_at', v_next
  );
end;
$$;
grant execute on function public.chat_availability() to anon, authenticated;

create or replace function public.mark_read(p_conversation_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_agent() then
    update public.conversations
       set unread_for_agents = 0, agent_last_read_at = now()
     where id = p_conversation_id and unread_for_agents > 0;
  elsif public.owns_conversation(p_conversation_id) then
    update public.conversations
       set unread_for_visitor = 0, visitor_last_read_at = now()
     where id = p_conversation_id and unread_for_visitor > 0;
  else
    raise exception 'not allowed' using errcode = '42501';
  end if;
end;
$$;
grant execute on function public.mark_read(uuid) to authenticated;

create or replace function public.update_my_visitor(
  p_name text, p_email text, p_phone text, p_current_page text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  update public.visitors v set
    name = coalesce(nullif(left(btrim(p_name), 120), ''), v.name),
    email = coalesce(nullif(left(btrim(p_email), 254), ''), v.email),
    phone = coalesce(nullif(btrim(p_phone), ''), v.phone),
    current_page = coalesce(left(p_current_page, 500), v.current_page),
    last_seen_at = now()
  where v.id = (select auth.uid());
end;
$$;
grant execute on function public.update_my_visitor(text, text, text, text) to authenticated;

create or replace function public.submit_form(p_message_id uuid, p_answers jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  m public.messages;
  v_uid uuid := (select auth.uid());
  v_kind text;
  v_summary text;
  k text;
begin
  select * into m from public.messages where id = p_message_id;
  if m.id is null or m.type <> 'form_request' or not public.owns_conversation(m.conversation_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if jsonb_typeof(p_answers) <> 'object' then
    raise exception 'invalid answers' using errcode = '22023';
  end if;
  v_kind := m.payload ->> 'kind';

  if v_kind = 'contact' then
    update public.visitors v set
      name = coalesce(nullif(left(btrim(p_answers ->> 'name'), 120), ''), v.name),
      email = coalesce(nullif(left(btrim(p_answers ->> 'email'), 254), ''), v.email),
      phone = case when (p_answers ->> 'phone') ~ '^\+61\d{9}$' then p_answers ->> 'phone' else v.phone end
    where v.id = v_uid;
    v_summary := 'Contact details sent';
  elsif v_kind = 'vehicle' then
    update public.conversations c set
      vehicle_type = coalesce(nullif(left(p_answers ->> 'vehicle_type', 60), ''), c.vehicle_type),
      vehicle_condition = coalesce(nullif(left(p_answers ->> 'vehicle_condition', 60), ''), c.vehicle_condition),
      vehicle_year = coalesce(nullif(left(p_answers ->> 'vehicle_year', 10), ''), c.vehicle_year),
      vehicle_make = coalesce(nullif(left(p_answers ->> 'vehicle_make', 60), ''), c.vehicle_make),
      vehicle_model = coalesce(nullif(left(p_answers ->> 'vehicle_model', 60), ''), c.vehicle_model),
      rego = coalesce(nullif(left(upper(p_answers ->> 'rego'), 12), ''), c.rego),
      suburb = coalesce(nullif(left(p_answers ->> 'suburb', 80), ''), c.suburb),
      postcode = case when (p_answers ->> 'postcode') ~ '^\d{4}$' then p_answers ->> 'postcode' else c.postcode end
    where c.id = m.conversation_id;
    v_summary := 'Vehicle details sent';
  elsif v_kind = 'photos' then
    v_summary := 'Photos requested were sent below';
  else
    raise exception 'unknown form' using errcode = '22023';
  end if;

  perform set_config('chat.internal', '1', true);
  insert into public.messages (conversation_id, sender_type, type, body, payload)
  values (m.conversation_id, 'visitor', 'form_response', v_summary,
          jsonb_build_object('kind', v_kind, 'request_id', m.id, 'answers', p_answers));
  perform set_config('chat.internal', '', true);
end;
$$;
grant execute on function public.submit_form(uuid, jsonb) to authenticated;

create or replace function public.respond_to_offer(p_message_id uuid, p_action text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  m public.messages;
  v_text text;
begin
  if p_action not in ('accept', 'decline', 'call_me') then
    raise exception 'invalid action' using errcode = '22023';
  end if;
  select * into m from public.messages where id = p_message_id;
  if m.id is null or m.type <> 'offer' or not public.owns_conversation(m.conversation_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if (m.payload ->> 'valid_until') is not null and (m.payload ->> 'valid_until')::timestamptz < now()
     and p_action = 'accept' then
    raise exception 'This offer has expired. Please ask us for a new one.' using errcode = '22023';
  end if;

  v_text := case p_action
    when 'accept' then 'Offer accepted'
    when 'decline' then 'Offer declined'
    else 'Visitor asked for a call back about the offer' end;

  perform set_config('chat.internal', '1', true);
  update public.messages
     set payload = payload || jsonb_build_object('response', p_action, 'responded_at', now())
   where id = m.id;
  if p_action = 'accept' then
    update public.conversations set lead_status = 'offer_accepted' where id = m.conversation_id;
  end if;
  insert into public.messages (conversation_id, sender_type, type, body, payload)
  values (m.conversation_id, 'system', 'system', v_text,
          jsonb_build_object('offer_id', m.id, 'action', p_action));
  perform set_config('chat.internal', '', true);

  if p_action = 'accept' then
    perform public.notify_api('/api/chat/events', jsonb_build_object(
      'event', 'offer_accepted', 'conversation_id', m.conversation_id, 'message_id', m.id));
  end if;
end;
$$;
grant execute on function public.respond_to_offer(uuid, text) to authenticated;

create or replace function public.rate_conversation(p_conversation_id uuid, p_rating integer, p_comment text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_rating not between 1 and 5 or not public.owns_conversation(p_conversation_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  update public.conversations
     set rating = p_rating, rating_comment = left(p_comment, 1000)
   where id = p_conversation_id and status = 'closed' and rating is null;
end;
$$;
grant execute on function public.rate_conversation(uuid, integer, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Agent-only RPCs
-- ---------------------------------------------------------------------------

create or replace function public.admin_search(p_query text)
returns table (conversation_id uuid)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  q text := left(btrim(p_query), 100);
begin
  if not public.is_agent() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if char_length(q) < 2 then
    return;
  end if;
  return query
  select distinct r.cid from (
    select c.id as cid, c.last_message_at as ts
    from public.conversations c join public.visitors v on v.id = c.visitor_id
    where v.name ilike '%' || q || '%' or v.phone ilike '%' || q || '%'
       or v.email ilike '%' || q || '%' or c.rego ilike '%' || q || '%'
    union all
    select m.conversation_id, m.created_at
    from public.messages m where m.body ilike '%' || q || '%'
    order by ts desc limit 200
  ) r limit 50;
end;
$$;
grant execute on function public.admin_search(text) to authenticated;

create or replace function public.admin_analytics(p_from timestamptz, p_to timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_tz text := (select timezone from public.chat_settings where id = 1);
  v_missed_min integer := (select missed_chat_minutes from public.chat_settings where id = 1);
  r jsonb;
begin
  if not public.is_agent() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  select jsonb_build_object(
    'chats_per_day', coalesce((
      select jsonb_agg(jsonb_build_object('day', d, 'count', n) order by d)
      from (select (c.created_at at time zone v_tz)::date as d, count(*) as n
            from public.conversations c where c.created_at >= p_from and c.created_at < p_to
            group by 1) x), '[]'::jsonb),
    'total_chats', (select count(*) from public.conversations c where c.created_at >= p_from and c.created_at < p_to),
    'missed_chats', (select count(*) from public.conversations c
                      where c.created_at >= p_from and c.created_at < p_to
                        and c.first_response_at is null
                        and c.created_at < now() - make_interval(mins => v_missed_min)),
    'median_first_response_seconds', (select percentile_cont(0.5) within group (
        order by extract(epoch from (c.first_response_at - c.created_at)))
      from public.conversations c
      where c.created_at >= p_from and c.created_at < p_to and c.first_response_at is not null),
    'median_resolution_seconds', (select percentile_cont(0.5) within group (
        order by extract(epoch from (c.closed_at - c.created_at)))
      from public.conversations c
      where c.created_at >= p_from and c.created_at < p_to and c.closed_at is not null),
    'heatmap', coalesce((
      select jsonb_agg(jsonb_build_object('dow', dow, 'hour', hr, 'count', n))
      from (select extract(dow from (c.created_at at time zone v_tz))::int as dow,
                   extract(hour from (c.created_at at time zone v_tz))::int as hr, count(*) as n
            from public.conversations c where c.created_at >= p_from and c.created_at < p_to
            group by 1, 2) h), '[]'::jsonb),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object('page', page, 'count', n))
      from (select coalesce(c.source_page, '(unknown)') as page, count(*) as n
            from public.conversations c where c.created_at >= p_from and c.created_at < p_to
            group by 1 order by 2 desc limit 10) p), '[]'::jsonb),
    'top_sources', coalesce((
      select jsonb_agg(jsonb_build_object('source', src, 'count', n))
      from (select coalesce(v.utm ->> 'utm_source', nullif(v.referrer, ''), '(direct)') as src, count(*) as n
            from public.conversations c join public.visitors v on v.id = c.visitor_id
            where c.created_at >= p_from and c.created_at < p_to
            group by 1 order by 2 desc limit 10) s), '[]'::jsonb),
    'leads_captured', (select count(distinct c.visitor_id) from public.conversations c
                        join public.visitors v on v.id = c.visitor_id
                        where c.created_at >= p_from and c.created_at < p_to
                          and (v.phone is not null or v.email is not null)),
    'offers_sent', (select count(*) from public.messages m
                     where m.type = 'offer' and m.created_at >= p_from and m.created_at < p_to),
    'offers_accepted', (select count(*) from public.conversations c
                         where c.lead_status in ('offer_accepted', 'pickup_booked', 'purchased')
                           and c.created_at >= p_from and c.created_at < p_to),
    'pickups_booked', (select count(*) from public.conversations c
                        where c.lead_status in ('pickup_booked', 'purchased')
                          and c.created_at >= p_from and c.created_at < p_to),
    'avg_rating', (select round(avg(c.rating)::numeric, 2) from public.conversations c
                    where c.rating is not null and c.created_at >= p_from and c.created_at < p_to),
    'per_agent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'agent_id', a.user_id, 'name', a.display_name,
        'chats', (select count(*) from public.conversations c
                   where c.assigned_agent_id = a.user_id and c.created_at >= p_from and c.created_at < p_to),
        'messages', (select count(*) from public.messages m
                      where m.sender_agent_id = a.user_id and not m.is_internal
                        and m.created_at >= p_from and m.created_at < p_to)))
      from public.agents a where a.active), '[]'::jsonb)
  ) into r;
  return r;
end;
$$;
grant execute on function public.admin_analytics(timestamptz, timestamptz) to authenticated;

create or replace function public.touch_agent_heartbeat(p_status text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_agent() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  update public.agents a set
    last_seen_at = now(),
    status = coalesce(p_status, a.status),
    status_changed_at = case when p_status is not null and p_status <> a.status then now() else a.status_changed_at end
  where a.user_id = (select auth.uid());
end;
$$;
grant execute on function public.touch_agent_heartbeat(text) to authenticated;

-- Agents may edit their own preferences, but only admins can change roles or deactivate.
create or replace function public.agents_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.role()) = 'service_role' or public.is_admin() then
    return new;
  end if;
  if new.user_id is distinct from old.user_id
     or new.role is distinct from old.role
     or new.active is distinct from old.active then
    raise exception 'only admins can change role or active state' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger agents_guard before update on public.agents
  for each row execute function public.agents_guard();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.agents enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.visitors enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.canned_responses enable row level security;
alter table public.chat_settings enable row level security;
alter table public.quote_requests enable row level security;

-- agents: teammates can see each other; users edit only their own profile preferences;
-- admins manage everyone (role changes, deactivation). Inserts happen via the secret key.
create policy agents_select on public.agents for select to authenticated
  using (public.is_agent());
create policy agents_update_self on public.agents for update to authenticated
  using ((select auth.uid()) = user_id and public.is_agent())
  with check ((select auth.uid()) = user_id);
create policy agents_update_admin on public.agents for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy push_own on public.push_subscriptions for all to authenticated
  using ((select auth.uid()) = agent_id and public.is_agent())
  with check ((select auth.uid()) = agent_id and public.is_agent());

-- visitors: agents only (visitors use my_visitor / update_my_visitor)
create policy visitors_agents on public.visitors for select to authenticated
  using (public.is_agent());
create policy visitors_agents_update on public.visitors for update to authenticated
  using (public.is_agent()) with check (public.is_agent());

-- conversations: agents only (visitors use my_conversations)
create policy conversations_agents_select on public.conversations for select to authenticated
  using (public.is_agent());
create policy conversations_agents_update on public.conversations for update to authenticated
  using (public.is_agent()) with check (public.is_agent());
create policy conversations_admin_delete on public.conversations for delete to authenticated
  using (public.is_admin());

-- messages
create policy messages_agents_select on public.messages for select to authenticated
  using (public.is_agent());
create policy messages_visitor_select on public.messages for select to authenticated
  using (
    not is_internal and deleted_at is null
    and public.owns_conversation(conversation_id)
  );
create policy messages_agents_insert on public.messages for insert to authenticated
  with check (public.is_agent() and sender_type = 'agent' and sender_agent_id = (select auth.uid()));
create policy messages_visitor_insert on public.messages for insert to authenticated
  with check (
    sender_type = 'visitor' and type in ('text', 'image') and not is_internal
    and public.owns_conversation(conversation_id)
    and public.is_anonymous_user()
  );
create policy messages_agents_update on public.messages for update to authenticated
  using (public.is_agent() and sender_agent_id = (select auth.uid()))
  with check (public.is_agent() and sender_agent_id = (select auth.uid()));

create policy canned_agents_select on public.canned_responses for select to authenticated
  using (public.is_agent());
create policy canned_admin_write on public.canned_responses for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy settings_agents_select on public.chat_settings for select to authenticated
  using (public.is_agent());
create policy settings_admin_update on public.chat_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy quotes_agents_select on public.quote_requests for select to authenticated
  using (public.is_agent());
create policy quotes_agents_update on public.quote_requests for update to authenticated
  using (public.is_agent()) with check (public.is_agent());

-- Views: only the views/functions below are reachable by visitors.
grant select on public.my_conversations, public.my_visitor, public.agents_public to authenticated;
grant select on public.chat_public_settings to anon, authenticated;
revoke all on public.my_conversations, public.my_visitor, public.agents_public, public.chat_public_settings from anon;
grant select on public.chat_public_settings to anon;

-- ---------------------------------------------------------------------------
-- Realtime Authorization (private channels)
--   conversation:<id>  owning visitor + agents; typing only is sent by clients
--   inbox              agents only
--   agents             agents only (presence)
-- ---------------------------------------------------------------------------

create or replace function public.can_access_topic(p_topic text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_topic in ('inbox', 'agents') then
    return public.is_agent();
  end if;
  if p_topic like 'conversation:%' then
    begin
      v_id := split_part(p_topic, ':', 2)::uuid;
    exception when others then
      return false;
    end;
    return public.is_agent() or public.owns_conversation(v_id);
  end if;
  return false;
end;
$$;
grant execute on function public.can_access_topic(text) to authenticated;

create policy chat_receive on realtime.messages for select to authenticated
  using (public.can_access_topic((select realtime.topic())));

-- Clients may only send typing broadcasts (and presence on `agents`); everything
-- else is pushed from database triggers.
create policy chat_send_typing on realtime.messages for insert to authenticated
  with check (
    public.can_access_topic((select realtime.topic()))
    and (select realtime.messages.extension) in ('broadcast', 'presence')
    and (
      ((select realtime.messages.extension) = 'presence' and (select realtime.topic()) = 'agents')
      or ((select realtime.messages.extension) = 'broadcast'
          and (select realtime.topic()) like 'conversation:%')
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: private bucket for chat photos
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chat-uploads', 'chat-uploads', false, 8388608,
        array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do update set
  public = false,
  file_size_limit = 8388608,
  allowed_mime_types = excluded.allowed_mime_types;

create policy chat_uploads_agents_read on storage.objects for select to authenticated
  using (bucket_id = 'chat-uploads' and public.is_agent());
create policy chat_uploads_agents_write on storage.objects for insert to authenticated
  with check (bucket_id = 'chat-uploads' and public.is_agent());
create policy chat_uploads_visitor_read on storage.objects for select to authenticated
  using (
    bucket_id = 'chat-uploads'
    and public.owns_conversation(
      case when (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$'
           then ((storage.foldername(name))[1])::uuid end)
  );
create policy chat_uploads_visitor_write on storage.objects for insert to authenticated
  with check (
    bucket_id = 'chat-uploads'
    and public.is_anonymous_user()
    and public.owns_conversation(
      case when (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$'
           then ((storage.foldername(name))[1])::uuid end)
  );

-- ---------------------------------------------------------------------------
-- Scheduled jobs: Postgres calls our API (secret-protected). Supabase Vault must hold
-- `chat_site_url` and `chat_webhook_secret` (see README). No-ops until they exist.
-- ---------------------------------------------------------------------------

select cron.schedule('chat-missed', '* * * * *',
  $$select public.notify_api('/api/chat/cron/missed', '{}'::jsonb)$$);
select cron.schedule('chat-visitor-email', '* * * * *',
  $$select public.notify_api('/api/chat/cron/visitor-email', '{}'::jsonb)$$);
select cron.schedule('chat-cleanup', '15 16 * * *',
  $$select public.notify_api('/api/chat/cron/cleanup', '{}'::jsonb)$$);

-- Lock down defaults: functions are executable by PUBLIC unless revoked. Visitors and
-- agents are both `authenticated`, so grant back only what policies and the app call.
revoke execute on all functions in schema public from public, anon;
grant execute on function public.is_agent() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_anonymous_user() to authenticated;
grant execute on function public.owns_conversation(uuid) to authenticated;
grant execute on function public.can_access_topic(text) to authenticated;
grant execute on function public.chat_availability() to anon, authenticated;
grant execute on function public.mark_read(uuid) to authenticated;
grant execute on function public.update_my_visitor(text, text, text, text) to authenticated;
grant execute on function public.submit_form(uuid, jsonb) to authenticated;
grant execute on function public.respond_to_offer(uuid, text) to authenticated;
grant execute on function public.rate_conversation(uuid, integer, text) to authenticated;
grant execute on function public.admin_search(text) to authenticated;
grant execute on function public.admin_analytics(timestamptz, timestamptz) to authenticated;
grant execute on function public.touch_agent_heartbeat(text) to authenticated;
