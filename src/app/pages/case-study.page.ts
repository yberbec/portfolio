import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CASE_STUDIES } from '../data/portfolio.data';

@Component({
  selector: 'app-case-study-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="content-section section-wrap case-study-page-wrap">
      <a class="text-link back-link" routerLink="/work">← All projects</a>
      @if (study(); as study) {
        <article class="case-study-dialog case-study-page">
          <div class="case-study-dialog-top">
            <span class="project-meta mono">CASE STUDY {{ study.number }} / {{ study.client }}</span>
          </div>
          <p class="eyebrow pixel-font">PROJECT DEEP DIVE</p>
          <h2>{{ study.title }}</h2>
          <p class="case-study-lead">{{ study.summary }}</p>

          <div class="case-study-detail-grid">
            <section class="case-study-block">
              <h3>Context</h3>
              <p>{{ study.context }}</p>
            </section>
            <section class="case-study-block">
              <h3>My contributions</h3>
              <ul>
                @for (item of study.contribution; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </section>
          </div>

          <section class="case-study-flow-section">
            <h3>{{ study.flowTitle }}</h3>
            <div class="case-study-flow">
              @for (step of study.flow; track $index; let last = $last) {
                <div class="case-study-flow-step">
                  <span class="flow-index">{{ $index + 1 }}</span>
                  <strong>{{ step }}</strong>
                </div>
                @if (!last) {
                  <span class="flow-arrow" aria-hidden="true">→</span>
                }
              }
            </div>
          </section>

          <section class="case-study-block outcome-block">
            <h3>Outcome & impact</h3>
            <p>{{ study.outcome }}</p>
          </section>

          <section class="case-study-tech-section">
            <h3>Technologies & tools</h3>
            <div class="chips">
              @for (technology of study.technologies; track technology) {
                <span>{{ technology }}</span>
              }
            </div>
          </section>

          @if (study.notes) {
            <p class="case-study-note"><strong>Scope note:</strong> {{ study.notes }}</p>
          }
          <div class="case-study-dialog-footer">
            @if (prev(); as p) {
              <a class="button secondary" [routerLink]="['/work', p.id]">← {{ p.title }}</a>
            } @else { <span></span> }
            @if (next(); as n) {
              <a class="button primary" [routerLink]="['/work', n.id]">{{ n.title }} →</a>
            } @else {
              <a class="button primary" routerLink="/work">Back to projects ↗</a>
            }
          </div>
        </article>
      } @else {
        <div class="section-heading"><div><p class="eyebrow pixel-font">404 / CASE STUDY</p><h2>Project <span>not found.</span></h2></div></div>
        <a class="button primary" routerLink="/work">See all projects ↗</a>
      }
    </div>
  `
})
export class CaseStudyPage {
  readonly id = input<string>('');
  private readonly index = computed(() => CASE_STUDIES.findIndex(s => s.id === this.id()));
  readonly study = computed(() => CASE_STUDIES[this.index()] ?? null);
  readonly prev = computed(() => (this.index() > 0 ? CASE_STUDIES[this.index() - 1] : null));
  readonly next = computed(() => (this.index() >= 0 && this.index() < CASE_STUDIES.length - 1 ? CASE_STUDIES[this.index() + 1] : null));

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle((this.study()?.title ?? 'Project not found') + ' · Yahya Berbeche'));
  }
}
