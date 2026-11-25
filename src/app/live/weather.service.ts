import { Injectable, computed, signal } from '@angular/core';
import { LIVE_CONFIG } from '../config';
import { cachedJson, cityHour, cityTime } from './live-utils';

export type Sky = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

interface OpenMeteo {
  current: { temperature_2m: number; weather_code: number; is_day: 0 | 1 };
}

/** WMO weather codes → a handful of looks the room window can draw. */
function skyFor(code: number): Sky {
  if (code <= 1) return 'clear';
  if (code <= 3) return 'cloudy';
  if (code <= 48) return 'fog';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'rain';
}

const LABELS: Record<Sky, string> = { clear: 'clear', cloudy: 'cloudy', fog: 'foggy', rain: 'rain', snow: 'snow', storm: 'storm' };

@Injectable({ providedIn: 'root' })
export class WeatherService {
  readonly city = LIVE_CONFIG.location.city;
  readonly sky = signal<Sky>('clear');
  readonly temperature = signal<number | null>(null);
  /** Falls back to the local clock in the city until the API answers. */
  readonly isDay = signal(cityHour() >= 7 && cityHour() < 19);
  readonly time = signal(cityTime());

  readonly label = computed(() => {
    const t = this.temperature();
    return `${this.city} ${this.time()}` + (t === null ? '' : ` · ${Math.round(t)}°C ${LABELS[this.sky()]}`);
  });

  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;
    void this.refresh();
    window.setInterval(() => this.time.set(cityTime()), 20_000);
    window.setInterval(() => void this.refresh(), 15 * 60_000);
  }

  private async refresh(): Promise<void> {
    const { latitude, longitude, timeZone } = LIVE_CONFIG.location;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,weather_code,is_day&timezone=${encodeURIComponent(timeZone)}`;
    try {
      const data = await cachedJson<OpenMeteo>('weather', url, 15);
      this.temperature.set(data.current.temperature_2m);
      this.sky.set(skyFor(data.current.weather_code));
      this.isDay.set(data.current.is_day === 1);
    } catch { /* keep clock-based fallback */ }
  }
}
