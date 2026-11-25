import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'day' | 'night' | 'auto';

const KEY = 'theme-mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(readMode());
  private readonly media = window.matchMedia('(prefers-color-scheme: light)');

  constructor() {
    this.media.addEventListener('change', () => this.apply());
    this.apply();
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
    try { localStorage.setItem(KEY, mode); } catch { /* ignore */ }
    this.apply();
  }

  /** Cycle day → night → auto (keyboard shortcut "t"). */
  cycle(): void {
    const order: ThemeMode[] = ['day', 'night', 'auto'];
    this.set(order[(order.indexOf(this.mode()) + 1) % order.length]);
  }

  isLight(): boolean {
    const mode = this.mode();
    return mode === 'day' || (mode === 'auto' && this.media.matches);
  }

  private apply(): void {
    document.documentElement.dataset['theme'] = this.isLight() ? 'light' : 'dark';
  }
}

function readMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'day' || stored === 'night' || stored === 'auto') return stored;
  } catch { /* ignore */ }
  return 'night';
}
