import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LIVE_CONFIG } from '../config';
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
        <p>Open to software engineering opportunities and interesting engineering conversations in Montréal and beyond.</p>
        @if (formEnabled) {
          @if (status() === 'sent') {
            <div class="contact-sent" role="status">
              <strong>Message sent ✓</strong>
              <p>Thanks! I'll get back to you soon.</p>
              <button class="text-link" type="button" (click)="status.set('idle')">Send another message</button>
            </div>
          } @else {
            <form class="contact-form" (submit)="send($event)">
              <div class="contact-form-row">
                <label>Name<input name="name" type="text" required maxlength="100" autocomplete="name" /></label>
                <label>Email<input name="email" type="email" required maxlength="200" autocomplete="email" /></label>
              </div>
              <label>Message<textarea name="message" required rows="5" maxlength="5000"></textarea></label>
              <!-- Honeypot: real people leave this empty, bots fill it in. -->
              <input class="contact-botcheck" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" />
              <div class="contact-actions">
                <button class="button primary" type="submit" [disabled]="status() === 'sending'">{{ status() === 'sending' ? 'Sending…' : 'Send message ↗' }}</button>
                @if (status() === 'error') {
                  <span class="contact-error" role="alert">Couldn't send it. Please try again{{ email ? ' or email me directly' : '' }}.</span>
                }
              </div>
            </form>
          }
        }
        @if (email) {
          <div class="contact-actions">
            <button class="button" [class.primary]="!formEnabled" [class.secondary]="formEnabled" type="button" (click)="copyEmail()">{{ copied() ? 'Email copied ✓' : 'Copy my email ↗' }}</button>
            <a class="button secondary" [href]="'mailto:' + email">Send an email</a>
          </div>
        }
        <div class="contact-socials"><a [href]="linkedInUrl" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a [href]="githubUrl" target="_blank" rel="noopener noreferrer">GitHub ↗</a>@if (email) {<span>{{ email }}</span>}</div>
      </div>
    </section>
  `
})
export class ContactPage {
  readonly email = EMAIL;
  readonly formEnabled = !!LIVE_CONFIG.contact.web3formsKey;
  readonly linkedInUrl = LINKEDIN_URL;
  readonly githubUrl = GITHUB_URL;
  readonly copied = signal(false);
  readonly status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async copyEmail(): Promise<void> {
    await navigator.clipboard.writeText(this.email);
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1800);
  }

  async send(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | null;
    if (field('botcheck')?.checked) return;
    const data: Record<string, string> = {
      name: field('name')?.value.trim() ?? '',
      email: field('email')?.value.trim() ?? '',
      message: field('message')?.value.trim() ?? ''
    };
    this.status.set('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: LIVE_CONFIG.contact.web3formsKey,
          subject: `Portfolio message from ${data['name']}`,
          from_name: 'Portfolio contact form',
          name: data['name'],
          email: data['email'],
          replyto: data['email'],
          message: data['message']
        })
      });
      const result = (await response.json()) as { success?: boolean };
      if (!response.ok || !result.success) throw new Error('send failed');
      form.reset();
      this.status.set('sent');
    } catch {
      this.status.set('error');
    }
  }
}
