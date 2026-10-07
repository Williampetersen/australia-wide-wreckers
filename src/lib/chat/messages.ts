export type ChatMessage = {
  seq?: number;
  id: string;
  conversation_id: string;
  sender_type: "visitor" | "agent" | "system";
  sender_agent_id: string | null;
  type: "text" | "image" | "form_request" | "form_response" | "offer" | "system";
  body: string;
  attachments: { path: string; mime: string; size: number; width?: number; height?: number }[];
  payload: Record<string, unknown>;
  is_internal: boolean;
  created_at: string;
  deleted_at?: string | null;
  /** client-only state */
  status?: "sending" | "sent" | "failed";
};

export type MessageGroup = {
  key: string;
  senderType: ChatMessage["sender_type"];
  senderAgentId: string | null;
  messages: ChatMessage[];
};

const GROUP_WINDOW_MS = 5 * 60 * 1000;

/** Groups consecutive messages from the same sender within five minutes. System messages stand alone. */
export function groupMessages(messages: ChatMessage[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  for (const m of messages) {
    const last = groups[groups.length - 1];
    const lastMsg = last?.messages[last.messages.length - 1];
    const sameSender =
      last &&
      lastMsg &&
      m.sender_type !== "system" &&
      last.senderType === m.sender_type &&
      last.senderAgentId === m.sender_agent_id &&
      m.is_internal === lastMsg.is_internal &&
      new Date(m.created_at).getTime() - new Date(lastMsg.created_at).getTime() < GROUP_WINDOW_MS;
    if (sameSender) {
      last.messages.push(m);
    } else {
      groups.push({ key: m.id, senderType: m.sender_type, senderAgentId: m.sender_agent_id, messages: [m] });
    }
  }
  return groups;
}

/** Inserts or replaces by id (realtime echo replaces the optimistic copy) and keeps seq/created order. */
export function upsertMessage(list: ChatMessage[], incoming: ChatMessage): ChatMessage[] {
  const index = list.findIndex((m) => m.id === incoming.id);
  const next = index === -1 ? [...list, incoming] : list.map((m, i) => (i === index ? { ...m, ...incoming } : m));
  return next.sort((a, b) => {
    if (a.seq != null && b.seq != null) return a.seq - b.seq;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}

export function lastSeq(list: ChatMessage[]): number {
  return list.reduce((max, m) => (m.seq != null && m.seq > max ? m.seq : max), 0);
}
