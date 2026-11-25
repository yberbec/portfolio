import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ABOUT_PARAGRAPHS, EDUCATION, EMAIL, EXPERIENCE, GITHUB_URL, LANGUAGES_NOTE, LINKEDIN_URL, SKILLS } from '../data/portfolio.data';

@Component({
  selector: 'app-experience-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="content-section section-wrap">
      <div class="section-heading"><div><p class="eyebrow pixel-font">02 / THE JOURNEY</p><h2>Where I've <span>worked.</span></h2></div><span class="muted mono">7 YEARS IN SOFTWARE</span></div>
      <div class="timeline">
        @for (job of jobs; track job.id) {
          <article class="timeline-item" [id]="job.id">
            <div class="timeline-date mono">{{ job.dates }}<br>{{ job.location }}</div>
            <div>
              <h3>{{ job.role }} <span>&#64; {{ job.company }}</span></h3>
              <p>{{ job.description }}</p>
              <div class="chips">@for (t of job.technologies; track t) {<span>{{ t }}</span>}</div>
              @if (job.caseStudyId) {
                <a class="case-study-link" [routerLink]="['/work', job.caseStudyId]">{{ job.caseStudyLabel }} <span>↗</span></a>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class ExperiencePage {
  readonly jobs = EXPERIENCE;
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  template: `
    <section class="content-section about-section section-wrap">
      <div><p class="eyebrow pixel-font">03 / A LITTLE ABOUT ME</p><h2>Backend by craft.<br><span>Curious by nature.</span></h2></div>
      <div class="about-copy">
        @for (p of paragraphs; track $index) {<p>{{ p }}</p>}
        <div class="stats"><div><strong>7+</strong><span>YEARS EXPERIENCE</span></div><div><strong>Java</strong><span>CORE SPECIALTY</span></div><div><strong>MTL</strong><span>BASED IN CANADA</span></div></div>
      </div>
    </section>
  `
})
export class AboutPage {
  readonly paragraphs = ABOUT_PARAGRAPHS;
}

@Component({
  selector: 'app-skills-page',
  standalone: true,
  template: `
    <section class="content-section section-wrap stack-section">
      <div class="section-heading"><div><p class="eyebrow pixel-font">04 / MY TOOLBOX</p><h2>Technologies I <span>work with.</span></h2></div></div>
      <div class="stack-grid">
        @for (group of skills; track group.id) {
          <div [id]="group.id"><b>{{ group.label }}</b><p>{{ group.items }}</p>@if (group.note) {<small>{{ group.note }}</small>}</div>
        }
      </div>
    </section>
  `
})
export class SkillsPage {
  readonly skills = SKILLS;
}

@Component({
  selector: 'app-education-page',
  standalone: true,
  template: `
    <section class="content-section section-wrap education-section">
      <div class="section-heading"><div><p class="eyebrow pixel-font">05 / LEARNING & CREDENTIALS</p><h2>Education & <span>certifications.</span></h2></div></div>
      <div class="education-grid">
        @for (item of items; track item.id) {
          <div class="education-card" [id]="item.id"><span class="project-meta mono">{{ item.dates }}</span><h3>{{ item.title }}</h3><p>{{ item.detail }}</p></div>
        }
      </div>
      <p class="education-note">{{ note }}</p>
    </section>
  `
})
export class EducationPage {
  readonly items = EDUCATION;
  readonly note = LANGUAGES_NOTE;
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  template: `
    <section class="contact-section">
      <div class="section-wrap contact-inner">
        <p class="eyebrow pixel-font">06 / HAVE A PROJECT IN MIND?</p>
        <h2>Let's build something<br><span>that matters.</span></h2>
        <p>Open to Java backend opportunities and interesting engineering conversations in Montréal and beyond.</p>
        <div class="contact-actions">
          <button class="button primary" type="button" (click)="copyEmail()">{{ copied() ? 'Email copied ✓' : 'Copy my email ↗' }}</button>
          <a class="button secondary" [href]="'mailto:' + email">Send an email</a>
        </div>
        <div class="contact-socials"><a [href]="linkedInUrl" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a [href]="githubUrl" target="_blank" rel="noopener noreferrer">GitHub ↗</a><span>{{ email }}</span></div>
      </div>
    </section>
  `
})
export class ContactPage {
  readonly email = EMAIL;
  readonly linkedInUrl = LINKEDIN_URL;
  readonly githubUrl = GITHUB_URL;
  readonly copied = signal(false);

  async copyEmail(): Promise<void> {
    await navigator.clipboard.writeText(this.email);
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1800);
  }
}
