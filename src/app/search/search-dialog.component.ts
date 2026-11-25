import { AfterViewInit, Component, ElementRef, computed, inject, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResult, SearchService } from './search.service';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  template: `
    <div class="search-overlay" (click)="close.emit()">
      <section class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" (click)="$event.stopPropagation()">
        <h2 id="search-title">Search</h2>
        <p class="search-sub">Search the site</p>
        <div class="search-row">
          <input
            #input
            class="search-input"
            type="search"
            placeholder="Try “education”, “Spring Boot”, “Nespresso”…"
            autocomplete="off"
            spellcheck="false"
            role="combobox"
            aria-controls="search-results"
            [attr.aria-expanded]="results().length > 0"
            [attr.aria-activedescendant]="results().length ? 'search-result-' + active() : null"
            [value]="query()"
            (input)="onInput($event)"
            (keydown)="onKeydown($event)" />
          <button class="search-close" type="button" (click)="close.emit()">Close</button>
        </div>

        @if (query().trim()) {
          <p class="search-count" aria-live="polite">{{ results().length }} {{ results().length === 1 ? 'result' : 'results' }}.</p>
        } @else {
          <p class="search-count muted">Type a keyword. <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close.</p>
        }

        <ul class="search-results" id="search-results" role="listbox">
          @for (result of results(); track result.entry.title + result.entry.section; let i = $index) {
            <li
              class="search-card"
              role="option"
              [id]="'search-result-' + i"
              [class.active]="i === active()"
              [attr.aria-selected]="i === active()"
              (mouseenter)="active.set(i)"
              (click)="open(result)">
              <span class="search-card-section mono">{{ result.entry.section }}</span>
              <strong class="search-card-title">@for (s of result.titleSegments; track $index) {@if (s.hit) {<mark>{{ s.text }}</mark>} @else {<span>{{ s.text }}</span>}}</strong>
              <p class="search-card-snippet">@for (s of result.snippet; track $index) {@if (s.hit) {<mark>{{ s.text }}</mark>} @else {<span>{{ s.text }}</span>}}</p>
            </li>
          }
        </ul>
      </section>
    </div>
  `
})
export class SearchDialogComponent implements AfterViewInit {
  private readonly search = inject(SearchService);
  private readonly router = inject(Router);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  readonly close = output<void>();
  readonly query = signal('');
  readonly active = signal(0);
  readonly results = computed(() => this.search.search(this.query()));

  ngAfterViewInit(): void {
    this.input().nativeElement.focus();
  }

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(0);
  }

  onKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    if (event.key === 'ArrowDown' && count) {
      event.preventDefault();
      this.active.update(i => (i + 1) % count);
      this.scrollActiveIntoView();
    } else if (event.key === 'ArrowUp' && count) {
      event.preventDefault();
      this.active.update(i => (i - 1 + count) % count);
      this.scrollActiveIntoView();
    } else if (event.key === 'Enter' && count) {
      event.preventDefault();
      this.open(this.results()[this.active()]);
    }
  }

  open(result: SearchResult): void {
    this.router.navigate(result.entry.path, { fragment: result.entry.fragment });
    this.close.emit();
  }

  private scrollActiveIntoView(): void {
    queueMicrotask(() => document.getElementById('search-result-' + this.active())?.scrollIntoView({ block: 'nearest' }));
  }
}
