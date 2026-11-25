import { LIVE_CONFIG } from '../config';

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/** fetch JSON with a sessionStorage cache so repeat page views don't burn API rate limits. */
export async function cachedJson<T>(key: string, url: string, maxAgeMinutes = LIVE_CONFIG.cacheMinutes): Promise<T> {
  const storageKey = 'live:' + key;
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      const hit = JSON.parse(raw) as { at: number; data: T };
      if (Date.now() - hit.at < maxAgeMinutes * 60_000) return hit.data;
    }
  } catch { /* storage unavailable: just fetch */ }

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  const data = (await response.json()) as T;
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({ at: Date.now(), data }));
  } catch { /* quota or private mode */ }
  return data;
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function timeAgo(date: Date | string | number): string {
  const then = new Date(date).getTime();
  const seconds = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return 'just now';
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(seconds / 86400), 'day');
  if (abs < 86400 * 365) return rtf.format(Math.round(seconds / (86400 * 30)), 'month');
  return rtf.format(Math.round(seconds / (86400 * 365)), 'year');
}

export function shortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** Local time in the configured city, e.g. "14:05". */
export function cityTime(now = new Date()): string {
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: LIVE_CONFIG.location.timeZone });
}

export function cityHour(now = new Date()): number {
  return Number(now.toLocaleString('en-GB', { hour: '2-digit', hour12: false, timeZone: LIVE_CONFIG.location.timeZone }));
}
