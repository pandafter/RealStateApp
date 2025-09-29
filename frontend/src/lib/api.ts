export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5046";

export default async function fetchJSON<T>(
  path: string,
  init?: RequestInit,
  fallback?: T
): Promise<T> {
  try {
    const url = path.startsWith("http")
      ? path
      : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`fetchJSON: ${res.status} ${res.statusText} for ${url}`);
      return fallback ?? ({} as T);
    }

    const text = await res.text();
    if (!text) {
      return fallback ?? ({} as T);
    }

    return JSON.parse(text) as T;
  } catch (err) {
    console.error("fetchJSON failed:", err);
    return fallback ?? ({} as T);
  }
}
