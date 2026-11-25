import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../data/portfolio.data';
import { GithubService } from '../live/github.service';
import { MusicService } from '../live/music.service';
import { WeatherService } from '../live/weather.service';
import { DayStripComponent } from '../live/live-widgets';
import { shortDate, timeAgo } from '../live/live-utils';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DayStripComponent],
  template: `
    <section class="hero section-wrap">
      <div class="hero-copy">
        <div class="status-line"><span class="status-dot"></span> AVAILABLE FOR OPPORTUNITIES <span class="status-location">· MONTRÉAL, CA</span></div>
        <p class="eyebrow pixel-font">HELLO, WORLD! I'M</p>
        <h1>Yahya<br><span>Berbeche</span><span class="period">.</span></h1>
        <h2>Java Backend Developer</h2>
        <p class="intro">Java backend developer with 7 years of experience building enterprise applications, microservices and integrations. I focus on reliable APIs, maintainable code and production-ready systems.</p>
        <div class="hero-actions">
          <a class="button primary" routerLink="/work">Explore my work <span>↘</span></a>
          <a class="text-link" routerLink="/contact">Let's talk <span>↗</span></a>
        </div>
        <div class="social-row">
          <a [href]="linkedInUrl" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a [href]="githubUrl" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a [href]="'mailto:' + email">Email ↗</a>
        </div>
      </div>

      <div class="pixel-scene" aria-label="Pixel art desk with a computer">
        <div class="scene-label pixel-font">DEV ROOM / 001</div>
        <div class="window-frame">
          <div class="window-top"><i></i><i></i><i></i><span>workspace.exe</span></div>
          <div class="window-content">
            <div class="sun"></div><div class="cloud cloud-one"></div><div class="cloud cloud-two"></div>
            <div class="city city-back"></div><div class="city city-front"></div>
            <div class="desk"></div><div class="monitor"><div class="screen-code"><b>01</b> const dev = &#123;<br>&nbsp; stack: <em>'Java'</em>,<br>&nbsp; focus: <em>'Backend'</em><br>&#125;;<br><strong>build(dev);</strong></div></div>
            <div class="monitor-stand"></div><div class="keyboard"></div><div class="plant"><i></i><i></i><i></i></div>
            <div class="mug"></div><div class="chair"></div>
          </div>
        </div>
        <div class="scene-caption pixel-font"><span>▲</span> BUILD · LEARN · REPEAT</div>
      </div>
    </section>

    <section id="room" class="room-section section-wrap">
      <div class="section-heading">
        <div><p class="eyebrow pixel-font">INTERACTIVE / EXPLORE MY SPACE</p><h2>Welcome to my <span>dev room.</span></h2></div>
        <span class="muted mono">CLICK AN OBJECT TO EXPLORE</span>
      </div>
      <p class="room-intro">A little virtual workspace. Pick an object and take a look around.</p>
      <div class="room-game">
        <div class="room-hud"><span class="pixel-font">YB_WORKSPACE.EXE</span><span class="room-live"><i></i> {{ weather.label().toUpperCase() }}</span></div>
        <div class="room-scene" [class.is-night]="!weather.isDay()">
          <div class="room-window" [title]="weather.label()">
            <div class="window-sky" [attr.data-sky]="weather.sky()" [class.night]="!weather.isDay()">
              <span class="pixel-stars"></span>
              <span class="pixel-sun"></span><span class="pixel-cloud cloud-a"></span><span class="pixel-cloud cloud-b"></span>
              <span class="pixel-precip"></span>
              <div class="pixel-skyline"></div>
            </div>
            <div class="window-sill"></div>
          </div>
          <a class="room-hotspot hotspot-cork" routerLink="/shipping" [attr.aria-label]="'Shipping: ' + shipLabel()">
            <span class="cork-pixel"><i></i><i></i><i></i><i></i></span>
            <span class="hotspot-label">{{ shipLabel() }}</span>
          </a>
          <div class="room-shelf"><div class="shelf-books"><i></i><i></i><i></i><i></i><i></i></div><div class="shelf-plants">✦</div></div>
          <a class="room-hotspot hotspot-books" routerLink="/skills" aria-label="Explore skills"><span class="hotspot-icon">▤</span><span class="hotspot-label">BOOKSHELF</span></a>
          <div class="room-desk-top"></div><div class="room-desk-leg leg-left"></div><div class="room-desk-leg leg-right"></div>
          <a class="room-hotspot hotspot-monitor" routerLink="/work" aria-label="Explore projects">
            <span class="monitor-pixel">
              <b>YB</b>
              @if (gh.latest(); as last) {
                <small class="monitor-live">{{ last.repo }}<br>{{ last.kind.toUpperCase() }} ✓<br>{{ ago(last.date) }}</small>
              } @else {
                <small>0101<br>JAVA<br>BUILD ✓</small>
              }
            </span>
            <span class="hotspot-label">PROJECTS.EXE</span>
          </a>
          <a class="room-hotspot hotspot-record" routerLink="/music" [attr.aria-label]="'Music: ' + musicLabel()">
            <span class="record-pixel" [class.spinning]="music.current()?.nowPlaying"><i></i></span><span class="record-stand"></span>
            <span class="hotspot-label">{{ musicLabel() }}</span>
          </a>
          <a class="room-hotspot hotspot-laptop" routerLink="/experience" aria-label="Explore work experience"><span class="laptop-pixel"><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="hotspot-label">EXPERIENCE</span></a>
          <a class="room-hotspot hotspot-mug" routerLink="/about" aria-label="Read about Yahya"><span class="mug-pixel">Y</span><span class="hotspot-label">ABOUT ME</span></a>
          <a class="room-hotspot hotspot-terminal" routerLink="/contact" aria-label="Contact Yahya"><span class="terminal-pixel"><b>&gt;_</b></span><span class="hotspot-label">CONTACT</span></a>
          <div class="room-rug"></div><div class="room-chair"></div>
          <div class="room-floor"></div>
          <div class="room-player"><span class="player-head"></span><span class="player-body"></span><span class="player-leg one"></span><span class="player-leg two"></span></div>
        </div>
        <div class="room-footer"><span>✦ TIP: EXPLORE THE OBJECTS</span><span>MONTRÉAL, CANADA · PIXEL WORKSPACE</span></div>
      </div>
      <div class="room-hint"><span class="hint-key">↖</span> Each object opens a different page of my portfolio. Press <kbd>/</kbd> to search.</div>
    </section>

    <section class="content-section section-wrap live-section">
      <div class="section-heading"><div><p class="eyebrow pixel-font">LIVE / RIGHT NOW</p><h2>What's <span>happening.</span></h2></div><span class="muted mono">UPDATED LIVE</span></div>
      <div class="live-grid">
        <a class="live-card live-tile" routerLink="/music">
          <span class="live-tile-label mono">♪ LISTENING</span>
          @if (!music.configured) {
            <strong>Record player unplugged</strong><p>Music appears once Last.fm is connected.</p>
          } @else if (music.current(); as t) {
            <strong>{{ t.name }}</strong>
            <p>{{ t.artist }} · {{ t.nowPlaying ? 'playing now' : ago(t.playedAt!) }}</p>
          } @else if (music.state() === 'ready') {
            <strong>Quiet for now</strong><p>No plays recorded yet.</p>
          } @else {
            <strong>…</strong><p>Tuning in</p>
          }
          <span class="page-index-arrow" aria-hidden="true">↗</span>
        </a>
        <a class="live-card live-tile" routerLink="/shipping">
          <span class="live-tile-label mono">⑂ SHIPPING</span>
          @if (gh.latest(); as last) {
            <strong>{{ last.repo }} {{ last.title }}</strong>
            <p>{{ ago(last.date) }}</p>
          } @else {
            <strong>{{ gh.state() === 'error' ? 'GitHub is resting' : '…' }}</strong><p>Public GitHub activity</p>
          }
          @if (gh.recentDays().length) {
            <app-day-strip [days]="gh.recentDays()" />
          }
          <span class="page-index-arrow" aria-hidden="true">↗</span>
        </a>
        <div class="live-card live-tile">
          <span class="live-tile-label mono">◐ {{ weather.city.toUpperCase() }}</span>
          <strong>{{ weather.time() }}@if (weather.temperature() !== null) { · {{ weather.temperature()! | number: '1.0-0' }}°C }</strong>
          <p>{{ weather.isDay() ? 'Daytime' : 'Night' }} in Montréal, {{ weather.sky() }} skies. The dev room above follows along.</p>
        </div>
      </div>
    </section>

    <section class="ticker" aria-label="Technology stack">
      <div>JAVA <b>✳</b> SPRING BOOT <b>✳</b> REST API <b>✳</b> SQL <b>✳</b> ANGULAR <b>✳</b> DOCKER <b>✳</b> JAVA <b>✳</b> SPRING BOOT <b>✳</b> REST API <b>✳</b> SQL <b>✳</b></div>
    </section>

    <section class="content-section section-wrap">
      <div class="section-heading"><div><p class="eyebrow pixel-font">SITE MAP</p><h2>Where to <span>next?</span></h2></div></div>
      <div class="page-index">
        @for (page of pages; track page.path) {
          <a class="page-index-card" [routerLink]="page.path">
            <span class="project-meta mono">{{ page.number }}</span>
            <strong>{{ page.title }}</strong>
            <p>{{ page.blurb }}</p>
            <span class="page-index-arrow" aria-hidden="true">↗</span>
          </a>
        }
      </div>
    </section>
  `
})
export class HomePage implements OnInit, OnDestroy {
  readonly gh = inject(GithubService);
  readonly music = inject(MusicService);
  readonly weather = inject(WeatherService);
  ago = timeAgo;
  private stopMusic?: () => void;

  readonly shipLabel = computed(() => {
    const last = this.gh.latest();
    return last ? `SHIPPED ${shortDate(last.date).toUpperCase()}` : 'SHIPPING';
  });

  readonly musicLabel = computed(() => {
    const t = this.music.current();
    if (!t) return '♪ MUSIC';
    const text = `${t.name} · ${t.artist}`;
    return (t.nowPlaying ? '▶ ' : '♪ ') + (text.length > 26 ? text.slice(0, 25) + '…' : text);
  });

  ngOnInit(): void {
    void this.gh.load();
    this.weather.start();
    this.stopMusic = this.music.watch();
  }

  ngOnDestroy(): void {
    this.stopMusic?.();
  }

  readonly email = EMAIL;
  readonly linkedInUrl = LINKEDIN_URL;
  readonly githubUrl = GITHUB_URL;

  readonly pages = [
    { number: '01', path: '/work', title: 'Work', blurb: 'Case studies from Nespresso and Metro, plus a personal project.' },
    { number: '02', path: '/experience', title: 'Experience', blurb: '7 years across Build and Production teams.' },
    { number: '03', path: '/about', title: 'About', blurb: 'Backend by craft, curious by nature.' },
    { number: '04', path: '/skills', title: 'Skills', blurb: 'Java, Spring, databases, tooling and cloud.' },
    { number: '05', path: '/education', title: 'Education', blurb: 'Degrees and certifications.' },
    { number: '06', path: '/shipping', title: 'Shipping', blurb: 'Live commits, merges and releases from GitHub.' },
    { number: '07', path: '/music', title: 'Music', blurb: "What's on the record player right now." },
    { number: '08', path: '/contact', title: 'Contact', blurb: "Let's build something that matters." }
  ];
}
