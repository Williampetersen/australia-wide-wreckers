export function fillCanned(
  body: string,
  vars: { visitor_name?: string | null; agent_name?: string | null; business_phone: string }
): string {
  return body
    .replace(/\{\{\s*visitor_name\s*\}\}/g, vars.visitor_name?.trim() || "there")
    .replace(/\{\{\s*agent_name\s*\}\}/g, vars.agent_name?.trim() || "the team")
    .replace(/\{\{\s*business_phone\s*\}\}/g, vars.business_phone);
}
