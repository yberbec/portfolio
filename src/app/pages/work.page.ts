import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CASE_STUDIES, PERSONAL_PROJECT } from '../data/portfolio.data';
import { GithubService } from '../live/github.service';
import { timeAgo } from '../live/live-utils';

interface CardArt {
  art: 'art-data' | 'art-commerce';
  tag: string;
  bottom: string;
  cube?: string;
  meta: string;
  chips: string[];
}

const CARD_ART: Record<string, CardArt> = {
  'fresh-data': { art: 'art-data', tag: 'CASE STUDY 01 · NESPRESSO', bottom: 'ADOBE EXPERIENCE PLATFORM', meta: 'JAVA · SPRING BOOT · REST · GRAFANA', chips: ['Schema mapping', 'Async processing', 'Observability'] },
  'pickup-points': { art: 'art-commerce', tag: 'CASE STUDY 02 · NESPRESSO', bottom: 'EXTERNAL API INTEGRATION', cube: 'API', meta: 'JAVA · REST · DATA MAPPING', chips: ['REST integration', 'Data transformation', 'Microservices'] },
  'ratings-reviews': { art: 'art-commerce', tag: 'CASE STUDY 03 · NESPRESSO', bottom: 'PLATFORM MIGRATION', cube: '★', meta: 'JAVA · SPRING · MICROSERVICES', chips: ['Sprinklr', 'Bazaarvoice', 'API compatibility'] },
  'metro-foundation': { art: 'art-data', tag: 'CASE STUDY 04 · METRO', bottom: 'SHARED APPLICATION ARCHITECTURE', meta: 'JAVA · SPRING BOOT · JEE', chips: ['Shared components', 'Multi-brand', 'Production support'] },
  'quality-reliability': { art: 'art-commerce', tag: 'CASE STUDY 05 · NESPRESSO', bottom: 'BUILD & PRODUCTION', cube: '✓', meta: 'JAVA · JUNIT · KIBANA · GRAFANA', chips: ['Refactoring', 'Unit tests', 'On-call'] }
};

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="content-section section-wrap">
      <div class="section-heading"><div><p class="eyebrow pixel-font">01 / SELECTED WORK</p><h2>Things I've <span>built.</span></h2></div><span class="muted mono">A FEW PROJECT HIGHLIGHTS</span></div>
      <div class="project-grid case-study-grid">
        @for (study of studies; track study.id; let first = $first) {
          <article class="project-card" [class.featured]="first" [id]="study.id">
            <div class="project-art" [class]="art(study.id).art">
              <span class="art-tag pixel-font">{{ art(study.id).tag }}</span>
              @if (art(study.id).art === 'art-data') {
                <div class="data-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
              } @else {
                <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="cube">{{ art(study.id).cube }}</div>
              }
              <span class="art-bottom mono">{{ art(study.id).bottom }}</span>
            </div>
            <div class="project-info">
              <div class="project-meta mono">{{ art(study.id).meta }}</div>
              <h3>{{ study.title }}</h3>
              <p>{{ study.summary }}</p>
              <div class="chips">@for (chip of art(study.id).chips; track chip) {<span>{{ chip }}</span>}</div>
              <a class="case-study-link" [routerLink]="['/work', study.id]">Explore case study <span>↗</span></a>
            </div>
          </article>
        }
        <article class="project-card" [id]="personal.id">
          <div class="project-art art-jobs"><span class="art-tag pixel-font">PERSONAL PROJECT</span><div class="terminal"><span>$</span> job-scraper<br><b>✓</b> jobs collected<br><b>✓</b> exported to xlsx</div><span class="art-bottom mono">JOB DISCOVERY TOOL</span></div>
          <div class="project-info">
            <div class="project-meta mono">SPRING BOOT · DOCKER · POSTGRESQL</div>
            <h3>{{ personal.title }}</h3>
            <p>{{ personal.description }}</p>
            <div class="chips">@for (t of personal.technologies; track t) {<span>{{ t }}</span>}</div>
            @if (gh.repo(personal.repo); as repo) {
              <div class="repo-stats mono">
                <span title="GitHub stars">★ {{ repo.stargazers_count }}</span>
                @if (repo.language) { <span>{{ repo.language }}</span> }
                <span>pushed {{ ago(repo.pushed_at) }}</span>
              </div>
              <a class="case-study-link" [href]="repo.html_url" target="_blank" rel="noopener noreferrer">View on GitHub <span>↗</span></a>
            }
          </div>
        </article>
      </div>
    </section>

    @if (gh.ownRepos().length) {
      <section class="content-section section-wrap repos-section">
        <div class="section-heading"><div><p class="eyebrow pixel-font">LIVE / OPEN SOURCE</p><h2>On <span>GitHub.</span></h2></div><a class="muted mono" [href]="gh.profileUrl" target="_blank" rel="noopener noreferrer">ALL REPOSITORIES ↗</a></div>
        <div class="repo-grid">
          @for (repo of gh.ownRepos().slice(0, 6); track repo.name) {
            <a class="live-card repo-card" [href]="repo.html_url" target="_blank" rel="noopener noreferrer">
              <strong>{{ repo.name }}</strong>
              <p>{{ repo.description || 'No description yet.' }}</p>
              <div class="repo-stats mono">
                <span title="GitHub stars">★ {{ repo.stargazers_count }}</span>
                @if (repo.language) { <span>{{ repo.language }}</span> }
                <span>pushed {{ ago(repo.pushed_at) }}</span>
              </div>
            </a>
          }
        </div>
      </section>
    }
  `
})
export class WorkPage implements OnInit {
  readonly gh = inject(GithubService);
  ago = timeAgo;
  readonly studies = CASE_STUDIES;
  readonly personal = PERSONAL_PROJECT;

  ngOnInit(): void {
    void this.gh.load();
  }
  art(id: string): CardArt {
    return CARD_ART[id];
  }
}
