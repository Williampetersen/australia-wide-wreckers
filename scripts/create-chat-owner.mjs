#!/usr/bin/env node
// Invites the first owner of the chat admin.
//   node --env-file=.env.local scripts/create-chat-owner.mjs --email you@example.com --name "Chris"
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (server-only, never commit).
import { createClient } from "@supabase/supabase-js";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const email = arg("email");
const name = arg("name");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!email || !name || !url || !secret) {
  console.error(
    "Usage: node --env-file=.env.local scripts/create-chat-owner.mjs --email <email> --name <name>\n" +
      "Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in the environment."
  );
  process.exit(1);
}

const admin = createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
  redirectTo: `${siteUrl}/admin/reset-password`,
});
if (error) {
  console.error("Invite failed:", error.message);
  process.exit(1);
}

const { error: agentError } = await admin.from("agents").upsert({
  user_id: data.user.id,
  display_name: name,
  role: "owner",
  active: true,
});
if (agentError) {
  console.error("Could not create the agents row:", agentError.message);
  process.exit(1);
}

console.log(`Invited ${email} as owner. They will receive an email to set a password.`);
