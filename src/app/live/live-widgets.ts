import { Component, ElementRef, afterNextRender, computed, inject, input } from '@angular/core';
import { ContributionDay, ShipItem } from './github.service';
import { shortDate, timeAgo } from './live-utils';

function dayTitle(d: ContributionDay): string {
  const n = d.count;
  return `${shortDate(d.date + 'T12:00:00')}: ${n === 0 ? 'no' : n} contribution${n === 1 ? '' : 's'}`;
}

/** GitHub-style year grid: one column per week, one square per day. */
@Component({
  selector: 'app-contribution-graph',
  standalone: true,
  template: `
    <div class="contrib-scroll">
      <div class="contrib-months" [style.grid-template-columns]="'repeat(' + weeks().length + ', var(--cell))'">
        @for (m of months(); track m.col) {
          <span [style.grid-column]="m.col + 1">{{ m.label }}</span>
        }
      </div>
      <div class="contrib-grid" role="img" [attr.aria-label]="total() + ' contributions in the last year'">
        @for (week of weeks(); track $index) {
          <div class="contrib-week">
            @for (day of week; track $index) {
              @if (day) {
                <i class="contrib-cell" [attr.data-level]="day.level" [title]="title(day)"></i>
              } @else {
                <i class="contrib-cell empty"></i>
              }
            }
          </div>
        }
      </div>
    </div>
    <div class="contrib-legend mono"><span>Less</span><i data-level="0"></i><i data-level="1"></i><i data-level="2"></i><i data-level="3"></i><i data-level="4"></i><span>More</span></div>
  `
})
export class ContributionGraphComponent {
  constructor() {
    // Start scrolled to the most recent weeks on narrow screens.
    const host = inject(ElementRef<HTMLElement>);
    afterNextRender(() => {
      const scroller = host.nativeElement.querySelector('.contrib-scroll') as HTMLElement | null;
      if (scroller) scroller.scrollLeft = scroller.scrollWidth;
    });
  }

  readonly days = input.required<ContributionDay[]>();
  readonly total = computed(() => this.days().reduce((s, d) => s + d.count, 0));

  readonly weeks = computed(() => {
    const days = this.days();
    if (!days.length) return [];
    const firstDow = new Date(days[0].date + 'T12:00:00').getDay();
    const cells: (ContributionDay | null)[] = [...Array(firstDow).fill(null), ...days];
    const weeks: (ContributionDay | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  });

  readonly months = computed(() => {
    const out: { col: number; label: string }[] = [];
    let last = -1;
    this.weeks().forEach((week, col) => {
      const first = week.find(d => d);
      if (!first) return;
      const month = new Date(first.date + 'T12:00:00').getMonth();
      if (month !== last) {
        if (col > 0 || week[0]) out.push({ col, label: new Date(first.date + 'T12:00:00').toLocaleString('en', { month: 'short' }) });
        last = month;
      }
    });
    return out;
  });

  title = dayTitle;
}

/** One square per day in a single row: the compact strip used on the home page. */
@Component({
  selector: 'app-day-strip',
  standalone: true,
  template: `
    <div class="day-strip" role="img" [attr.aria-label]="'Contributions per day, ' + range()">
      @for (day of days(); track day.date) {
        <i class="contrib-cell" [attr.data-level]="day.level" [title]="title(day)"></i>
      }
    </div>
    <p class="day-strip-caption mono">One square a day, {{ range() }}</p>
  `
})
export class DayStripComponent {
  readonly days = input.required<ContributionDay[]>();
  readonly range = computed(() => {
    const d = this.days();
    return d.length ? `${shortDate(d[0].date + 'T12:00:00')} to ${shortDate(d[d.length - 1].date + 'T12:00:00')}` : '';
  });
  title = dayTitle;
}

const ICONS: Record<ShipItem['kind'], string> = { commit: '●', push: '↑', merge: '⑂', release: '◆', repo: '+' };

@Component({
  selector: 'app-ship-feed',
  standalone: true,
  template: `
    <ol class="ship-feed">
      @for (item of items(); track item.url + item.date) {
        <li>
          <span class="ship-when mono" [title]="item.date">{{ ago(item.date) }}</span>
          <span class="ship-icon" [attr.data-kind]="item.kind" aria-hidden="true">{{ icon(item.kind) }}</span>
          <a class="ship-text" [href]="item.url" target="_blank" rel="noopener noreferrer"><b>{{ item.repo }}</b> {{ item.title }}</a>
        </li>
      } @empty {
        <li class="ship-empty">Nothing public shipped recently.</li>
      }
    </ol>
  `
})
export class ShipFeedComponent {
  readonly items = input.required<ShipItem[]>();
  ago = timeAgo;
  icon(kind: ShipItem['kind']): string { return ICONS[kind]; }
}
