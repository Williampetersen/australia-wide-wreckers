-- Default live chat content. Safe to re-run.
-- Facts come from src/lib/faqs.ts and src/lib/site.ts. No prices or promises are invented:
-- offers are always confirmed by a person.

insert into public.chat_settings (id, notify_emails)
values (1, '{}')
on conflict (id) do nothing;

insert into public.canned_responses (shortcut, title, body) values
  ('hello', 'Greeting',
   'Hi {{visitor_name}}, thanks for getting in touch. It''s {{agent_name}} from Australia Wide Wreckers. Tell me about the vehicle (make, model, year and condition) and where it is, and I''ll get you a cash offer.'),
  ('paperwork', 'Paperwork needed',
   'You''ll generally need proof of ownership and photo ID. If you don''t have the registration papers, let us know and we''ll advise what''s needed for your vehicle.'),
  ('payment', 'How payment works',
   'Payment is made at the time of pickup once the vehicle and paperwork are confirmed, so you walk away with cash in hand the same day.'),
  ('removal', 'Free removal',
   'Towing is free in our service area, with no callout fees. We collect from your home, workplace or roadside.'),
  ('pickup', 'Same-day pickup',
   'In most cases we can arrange same-day or next-day pickup. What suburb is the vehicle in, and what time suits you?'),
  ('norego', 'Car without registration',
   'Yes, we buy unregistered vehicles. Please have your photo ID and any ownership papers ready, and tell us if the registration papers are missing so we can advise what we need.'),
  ('areas', 'Areas we service',
   'We cover Newcastle, Lake Macquarie, Maitland and the Hunter Valley, Port Stephens and the Central Coast. If you tell me your suburb I''ll confirm for you.'),
  ('condition', 'Any condition',
   'We buy vehicles running or not, including damaged, rusted, flooded, written-off or missing parts. Condition affects the offer, but it doesn''t stop us buying.'),
  ('photos', 'Ask for photos',
   'Could you send a few photos of the vehicle (front, back, both sides and the damage if any)? Tap the camera icon below the message box.'),
  ('quote', 'How we calculate the offer',
   'We look at the make, model, age, condition and current market value for parts and scrap metal to give you a fair offer. The final price is confirmed when we inspect the vehicle.'),
  ('callback', 'Call back',
   'Happy to call you back. What''s the best number and a good time to reach you? Our hours are Monday to Saturday, 9am to 5pm.'),
  ('thanks', 'Thanks / wrap up',
   'Thanks {{visitor_name}}, that''s all booked in. If anything changes, call us on {{business_phone}}. Have a great day!')
on conflict (shortcut) do nothing;
