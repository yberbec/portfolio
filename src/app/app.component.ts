import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';
import { SearchDialogComponent } from './search/search-dialog.component';
import { ThemeMode, ThemeService } from './live/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SearchDialogComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly router = inject(Router);

  readonly theme = inject(ThemeService);
  readonly themes: { mode: ThemeMode; label: string; icon: string; title: string }[] = [
    { mode: 'day', label: 'Day', icon: '☼', title: 'Light theme' },
    { mode: 'night', label: 'Night', icon: '☾', title: 'Dark theme' },
    { mode: 'auto', label: 'Auto', icon: '◐', title: 'Follow your system setting' }
  ];
  searchOpen = signal(false);

  readonly nav = [
    { path: '/work', label: 'Work' },
    { path: '/experience', label: 'Experience' },
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/education', label: 'Education' },
    { path: '/shipping', label: 'Shipping' },
    { path: '/music', label: 'Music' },
    { path: '/contact', label: 'Contact' }
  ];

  constructor() {
    // Leave room for the sticky header when the router scrolls to a #fragment.
    inject(ViewportScroller).setOffset([0, 96]);

    // Briefly highlight the element a search result pointed at.
    const sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (!fragment) return;
        window.setTimeout(() => {
          const el = document.getElementById(fragment);
          if (!el) return;
          el.classList.remove('search-hit');
          void el.offsetWidth;
          el.classList.add('search-hit');
          window.setTimeout(() => el.classList.remove('search-hit'), 2200);
        }, 50);
      });
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());
  }

  openSearch(): void {
    this.searchOpen.set(true);
  }

  closeSearch(): void {
    this.searchOpen.set(false);
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.searchOpen()) {
      this.closeSearch();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchOpen.update(open => !open);
      return;
    }
    const target = event.target as HTMLElement | null;
    const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
    if (typing || event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === '/' && !this.searchOpen()) {
      event.preventDefault();
      this.openSearch();
    } else if (event.key.toLowerCase() === 't' && !this.searchOpen()) {
      this.theme.cycle();
    }
  }
}
