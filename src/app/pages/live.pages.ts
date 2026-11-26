import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GithubService } from '../live/github.service';
import { MusicService } from '../live/music.service';
import { ContributionGraphComponent, ShipFeedComponent } from '../live/live-widgets';
import { timeAgo } from '../live/live-utils';
import { LIVE_CONFIG } from '../config';

@Component({
  selector: 'app-shipping-page',
  standalone: true,
  imports: [ContributionGraphComponent, ShipFeedComponent],
  template: `
    <section class="content-section section-wrap">
      <div class="section-heading">
        <div><p class="eyebrow pixel-font">LIVE / SHIPPING</p><h2>What I <span>shipped.</span></h2></div>
        <span class="muted mono">PUBLIC GITHUB ACTIVITY</span>
      </div>
      <p class="live-lead">Commits, pushes, merged pull requests and releases from my public repositories, pulled live from GitHub.</p>

      @switch (gh.state()) {
        @case ('error') {
          <div class="live-card live-empty">GitHub didn't answer (it limits anonymous requests to 60 an hour). <a class="text-link" [href]="gh.profileUrl" target="_blank" rel="noopener noreferrer">See my profile on GitHub ↗</a></div>
        }
        @case ('ready') {
          <div class="live-card">
            <div class="live-card-head">
              <h3>{{ gh.yearTotal() }} contributions in the last year</h3>
              <a class="text-link" [href]="gh.profileUrl" target="_blank" rel="noopener noreferrer">github.com/{{ user }} ↗</a>
            </div>
            <app-contribution-graph [days]="gh.calendar()" />
          </div>

          <div class="ship-columns">
            <div class="live-card">
              <div class="live-card-head"><h3>Latest activity</h3></div>
              <app-ship-feed [items]="gh.feed()" />
            </div>
            <div class="live-card">
              <div class="live-card-head"><h3>Busiest days</h3></div>
              <ol class="busy-days">
                @for (d of busiest(); track d.date) {
                  <li><span class="mono">{{ d.label }}</span><i [style.width.%]="d.pct"></i><b>{{ d.count }}</b></li>
                } @empty {
                  <li class="ship-empty">No public contributions yet this year.</li>
                }
              </ol>
              @if (gh.fetchedAt(); as at) {
                <p class="live-footnote mono">Counted {{ ago(at) }}</p>
              }
            </div>
          </div>
        }
        @default {
          <div class="live-card live-skeleton" aria-busy="true">Loading GitHub activity…</div>
        }
      }
    </section>
  `
})
export class ShippingPage implements OnInit {
  readonly gh = inject(GithubService);
  readonly user = LIVE_CONFIG.github.user;
  ago = timeAgo;

  readonly busiest = computed(() => {
    const days = [...this.gh.calendar()].filter(d => d.count > 0).sort((a, b) => b.count - a.count).slice(0, 6);
    const max = days[0]?.count ?? 1;
    return days.map(d => ({
      ...d,
      pct: (d.count / max) * 100,
      label: new Date(d.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }));
  });

  ngOnInit(): void {
    void this.gh.load();
  }
}

@Component({
  selector: 'app-music-page',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <section class="content-section section-wrap">
      <div class="section-heading">
        <div><p class="eyebrow pixel-font">LIVE / MUSIC</p><h2>What I'm <span>playing.</span></h2></div>
        <span class="muted mono">VIA LAST.FM</span>
      </div>

      @if (!music.configured) {
        <div class="live-card live-empty">
          <h3>The record player isn't plugged in yet</h3>
          <p>Add a Last.fm username and API key in <code>src/app/config.ts</code> to show what's playing.</p>
        </div>
      } @else {
        @if (music.current(); as track) {
          <a class="now-playing live-card" [href]="track.url" target="_blank" rel="noopener noreferrer">
            <div class="vinyl" [class.spinning]="track.nowPlaying">
              @if (track.image) { <img [src]="track.image" alt="" /> }
            </div>
            <div>
              <p class="eyebrow pixel-font">{{ track.nowPlaying ? '▶ NOW PLAYING' : 'LAST PLAYED' }}</p>
              <h3>{{ track.name }}</h3>
              <p class="now-artist">{{ track.artist }}@if (track.album) { · {{ track.album }} }</p>
              @if (track.playedAt) { <p class="live-footnote mono">{{ ago(track.playedAt) }}</p> }
            </div>
          </a>
        } @else if (music.state() === 'ready') {
          <div class="live-card live-empty">
            <h3>The record player is quiet</h3>
            <p>No plays recorded yet. Songs show up here as soon as they're scrobbled to <a class="text-link" [href]="music.profileUrl" target="_blank" rel="noopener noreferrer">Last.fm ↗</a></p>
          </div>
        } @else if (music.state() === 'error') {
          <div class="live-card live-empty">Last.fm didn't answer. <a class="text-link" [href]="music.profileUrl" target="_blank" rel="noopener noreferrer">Open my Last.fm ↗</a></div>
        } @else {
          <div class="live-card live-skeleton" aria-busy="true">Dropping the needle…</div>
        }

        @if (music.history().length || music.topArtists().length) {
        <div class="ship-columns">
          <div class="live-card">
            <div class="live-card-head"><h3>Last {{ music.history().length }} plays</h3><a class="text-link" [href]="music.profileUrl" target="_blank" rel="noopener noreferrer">Last.fm ↗</a></div>
            <ol class="track-list">
              @for (t of music.history(); track $index) {
                <li>
                  @if (t.image) { <img [src]="t.image" alt="" loading="lazy" /> } @else { <span class="track-noart">♪</span> }
                  <a [href]="t.url" target="_blank" rel="noopener noreferrer"><b>{{ t.name }}</b><span>{{ t.artist }}</span></a>
                  <span class="mono ship-when">{{ t.playedAt ? ago(t.playedAt) : 'now' }}</span>
                </li>
              }
            </ol>
          </div>
          <div class="live-card">
            <div class="live-card-head"><h3>Top artists · 30 days</h3></div>
            <ol class="busy-days">
              @for (a of music.topArtists(); track a.name) {
                <li><a [href]="a.url" target="_blank" rel="noopener noreferrer">{{ a.name }}</a><i [style.width.%]="(a.plays / maxPlays()) * 100"></i><b>{{ a.plays | number }}</b></li>
              } @empty {
                <li class="ship-empty">Not enough plays this month yet.</li>
              }
            </ol>
          </div>
        </div>
        }
      }
    </section>
  `
})
export class MusicPage implements OnInit, OnDestroy {
  readonly music = inject(MusicService);
  readonly maxPlays = computed(() => this.music.topArtists()[0]?.plays || 1);
  ago = timeAgo;
  private stop?: () => void;

  ngOnInit(): void {
    this.stop = this.music.watch();
    void this.music.loadTopArtists();
  }

  ngOnDestroy(): void {
    this.stop?.();
  }
}
