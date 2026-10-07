const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

function loadScript(): Promise<TurnstileApi | null> {
  const w = window as unknown as { turnstile?: TurnstileApi };
  if (w.turnstile) return Promise.resolve(w.turnstile);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve(w.turnstile ?? null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
}

/**
 * Returns an invisible Turnstile token, or undefined when Turnstile is off / unavailable
 * (everything must keep working with it disabled for local development).
 */
export async function getTurnstileToken(enabled: boolean): Promise<string | undefined> {
  if (!enabled || !SITE_KEY) return undefined;
  const api = await loadScript();
  if (!api) return undefined;
  return new Promise((resolve) => {
    const holder = document.createElement("div");
    holder.style.position = "fixed";
    holder.style.left = "-9999px";
    document.body.appendChild(holder);
    const done = (token?: string) => {
      try {
        api.remove(id);
      } catch {
        /* ignore */
      }
      holder.remove();
      resolve(token);
    };
    const id = api.render(holder, {
      sitekey: SITE_KEY,
      size: "invisible",
      callback: (token: string) => done(token),
      "error-callback": () => done(undefined),
      "timeout-callback": () => done(undefined),
    });
    setTimeout(() => done(undefined), 15000);
  });
}
