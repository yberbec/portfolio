import { Injectable, computed, signal } from '@angular/core';
import { LIVE_CONFIG } from '../config';
import { LoadState } from './live-utils';

export interface Track {
  name: string;
  artist: string;
  album: string;
  url: string;
  image: string;
  nowPlaying: boolean;
  playedAt: Date | null;
}

export interface TopArtist { name: string; plays: number; url: string; }

interface LfmImage { '#text': string; size: string; }
interface LfmTrack {
  name: string;
  url: string;
  artist: { '#text': string };
  album: { '#text': string };
  image: LfmImage[];
  date?: { uts: string };
  '@attr'?: { nowplaying?: string };
}
interface LfmRecent { recenttracks?: { track: LfmTrack[] | LfmTrack }; error?: number; message?: string; }
interface LfmTopArtists { topartists?: { artist: { name: string; playcount: string; url: string }[] }; error?: number; }

const ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';
// Last.fm returns this grey star when it has no cover art.
const PLACEHOLDER_ART = '2a96cbd8b46e442fc41c2b86b821562f';

@Injectable({ providedIn: 'root' })
export class MusicService {
  readonly configured = !!(LIVE_CONFIG.lastfm.user && LIVE_CONFIG.lastfm.apiKey);
  readonly profileUrl = LIVE_CONFIG.lastfm.user ? `https://www.last.fm/user/${LIVE_CONFIG.lastfm.user}` : 'https://www.last.fm';

  readonly state = signal<LoadState>('idle');
  readonly tracks = signal<Track[]>([]);
  readonly topArtists = signal<TopArtist[]>([]);
  readonly current = computed<Track | null>(() => this.tracks().at(0) ?? null);

  private timer?: number;
  private subscribers = 0;

  /** Start polling (every 30s) while at least one component is watching. Returns a stop function. */
  watch(): () => void {
    if (!this.configured) return () => {};
    this.subscribers++;
    if (this.subscribers === 1) {
      void this.refresh();
      this.timer = window.setInterval(() => void this.refresh(), 30_000);
    }
    return () => {
      this.subscribers = Math.max(0, this.subscribers - 1);
      if (this.subscribers === 0) window.clearInterval(this.timer);
    };
  }

  async loadTopArtists(): Promise<void> {
    if (!this.configured || this.topArtists().length) return;
    try {
      const data = await this.call<LfmTopArtists>({ method: 'user.gettopartists', period: '1month', limit: '8' });
      this.topArtists.set((data.topartists?.artist ?? []).map(a => ({ name: a.name, plays: Number(a.playcount), url: a.url })));
    } catch { /* optional section */ }
  }

  private async refresh(): Promise<void> {
    if (this.state() !== 'ready') this.state.set('loading');
    try {
      const data = await this.call<LfmRecent>({ method: 'user.getrecenttracks', limit: '20' });
      if (data.error) throw new Error(data.message);
      const raw = data.recenttracks?.track ?? [];
      const list = Array.isArray(raw) ? raw : [raw];
      this.tracks.set(list.map(toTrack));
      this.state.set('ready');
    } catch {
      if (!this.tracks().length) this.state.set('error');
    }
  }

  private async call<T>(params: Record<string, string>): Promise<T> {
    const query = new URLSearchParams({ ...params, user: LIVE_CONFIG.lastfm.user, api_key: LIVE_CONFIG.lastfm.apiKey, format: 'json' });
    const response = await fetch(`${ENDPOINT}?${query}`);
    if (!response.ok) throw new Error(String(response.status));
    return (await response.json()) as T;
  }
}

function toTrack(t: LfmTrack): Track {
  const image = [...t.image].reverse().find(i => i['#text'] && !i['#text'].includes(PLACEHOLDER_ART))?.['#text'] ?? '';
  return {
    name: t.name,
    artist: t.artist['#text'],
    album: t.album['#text'],
    url: t.url,
    image,
    nowPlaying: t['@attr']?.nowplaying === 'true',
    playedAt: t.date ? new Date(Number(t.date.uts) * 1000) : null
  };
}
