import { Injectable } from '@angular/core';
import {
  ABOUT_PARAGRAPHS, CASE_STUDIES, EDUCATION, EMAIL, EXPERIENCE, LANGUAGES_NOTE, PERSONAL_PROJECT, SKILLS
} from '../data/portfolio.data';

export interface SearchEntry {
  /** Section label shown above the title, e.g. "Education". */
  section: string;
  title: string;
  /** Router path to open. */
  path: string[];
  fragment?: string;
  /** Extra words that should match but aren't in the visible text. */
  keywords?: string;
  text: string;
}

export interface Segment { text: string; hit: boolean; }

export interface SearchResult {
  entry: SearchEntry;
  score: number;
  titleSegments: Segment[];
  snippet: Segment[];
}

/** Lowercase and strip accents so "ecole" matches "École", "montreal" matches "Montréal". */
function fold(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [
    { section: 'Page', title: 'Home', path: ['/'], keywords: 'home start dev room welcome', text: 'Java backend developer with 7 years of experience building enterprise applications, microservices and integrations. I focus on reliable APIs, maintainable code and production-ready systems.' },
    { section: 'Page', title: 'Work', path: ['/work'], keywords: 'projects portfolio case studies built', text: 'Things I have built. Case studies from Nespresso and Metro: ' + CASE_STUDIES.map(s => s.title).join(', ') + ', plus a personal job scraping application.' },
    { section: 'Page', title: 'Experience', path: ['/experience'], keywords: 'jobs career journey worked employment history', text: 'Where I have worked. 7 years in software: ' + EXPERIENCE.map(e => `${e.role} at ${e.company} (${e.dates})`).join('; ') + '.' },
    { section: 'Page', title: 'About', path: ['/about'], keywords: 'about me bio profile who', text: ABOUT_PARAGRAPHS.join(' ') },
    { section: 'Page', title: 'Skills', path: ['/skills'], keywords: 'skills toolbox stack technologies tech', text: SKILLS.map(s => `${s.label}: ${s.items}`).join('. ') },
    { section: 'Page', title: 'Education', path: ['/education'], keywords: 'education degrees school university studies diploma certifications credentials learning', text: 'Education & certifications. ' + EDUCATION.map(e => `${e.title}, ${e.detail} (${e.dates})`).join('. ') + '. ' + LANGUAGES_NOTE },
    { section: 'Page', title: 'Shipping', path: ['/shipping'], keywords: 'shipping github git commits merges pull requests releases activity contributions open source', text: 'What I shipped: live commits, pushes, merged pull requests and releases from my public GitHub repositories, with a contribution heatmap.' },
    { section: 'Page', title: 'Music', path: ['/music'], keywords: 'music listening now playing songs last.fm spotify record player', text: 'What I am playing right now: the current or last played track, recent plays and top artists, live from Last.fm.' },
    { section: 'Page', title: 'Contact', path: ['/contact'], keywords: 'contact email hire reach linkedin github talk', text: `Let's build something that matters. Open to Java backend opportunities in Montréal and beyond. ${EMAIL}` }
  ];

  for (const s of CASE_STUDIES) {
    entries.push({
      section: 'Case study',
      title: s.title,
      path: ['/work', s.id],
      keywords: s.client + ' project',
      text: [s.summary, s.context, ...s.contribution, s.outcome, 'Technologies: ' + s.technologies.join(', ')].join(' ')
    });
  }
  entries.push({ section: 'Project', title: PERSONAL_PROJECT.title, path: ['/work'], fragment: PERSONAL_PROJECT.id, keywords: 'personal side project scraper', text: PERSONAL_PROJECT.description + ' ' + PERSONAL_PROJECT.technologies.join(', ') });

  for (const e of EXPERIENCE) {
    entries.push({ section: 'Experience', title: `${e.role} @ ${e.company}`, path: ['/experience'], fragment: e.id, keywords: e.location, text: `${e.dates}, ${e.location}. ${e.description} ${e.technologies.join(', ')}` });
  }
  for (const g of SKILLS) {
    entries.push({ section: 'Skills', title: titleCase(g.label), path: ['/skills'], fragment: g.id, text: g.items });
  }
  for (const item of EDUCATION) {
    entries.push({ section: item.kind, title: item.title, path: ['/education'], fragment: item.id, keywords: item.kind === 'Education' ? 'education degree university' : 'certification certificate', text: `${item.detail}. ${item.dates}.` });
  }
  return entries;
}

function titleCase(label: string): string {
  return label.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

/** Split `value` into highlighted / plain segments for every occurrence of any term. */
function highlight(value: string, terms: string[]): Segment[] {
  const folded = fold(value);
  const marks = new Array<boolean>(value.length).fill(false);
  for (const term of terms) {
    let at = folded.indexOf(term);
    while (at !== -1) {
      for (let i = at; i < at + term.length; i++) marks[i] = true;
      at = folded.indexOf(term, at + term.length);
    }
  }
  const segments: Segment[] = [];
  for (let i = 0; i < value.length; i++) {
    const last = segments[segments.length - 1];
    if (last && last.hit === marks[i]) last.text += value[i];
    else segments.push({ text: value[i], hit: marks[i] });
  }
  return segments;
}

/** A ~170-character window of `text` around the first term hit. */
function snippet(text: string, terms: string[]): Segment[] {
  const folded = fold(text);
  const first = Math.min(...terms.map(t => folded.indexOf(t)).filter(i => i >= 0));
  const max = 170;
  if (!Number.isFinite(first) || text.length <= max) return highlight(text.length <= max ? text : text.slice(0, max) + '…', terms);
  let start = Math.max(0, first - 50);
  if (start > 0) start = text.indexOf(' ', start) + 1 || start;
  const end = Math.min(text.length, start + max);
  return highlight((start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : ''), terms);
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly index = buildIndex().map(entry => ({
    entry,
    title: fold(entry.title),
    meta: fold(`${entry.section} ${entry.keywords ?? ''}`),
    text: fold(entry.text)
  }));

  search(query: string, limit = 8): SearchResult[] {
    const terms = fold(query).split(/\s+/).filter(t => t.length > 0);
    if (!terms.length) return [];

    const results: SearchResult[] = [];
    for (const item of this.index) {
      let score = 0;
      let all = true;
      for (const term of terms) {
        const inTitle = item.title.includes(term);
        const inMeta = item.meta.includes(term);
        const inText = item.text.includes(term);
        if (!inTitle && !inMeta && !inText) { all = false; break; }
        score += (inTitle ? 10 : 0) + (inMeta ? 5 : 0) + (inText ? 1 : 0);
        if (item.title === term || item.title.startsWith(term)) score += 8;
      }
      if (!all) continue;
      if (item.entry.section === 'Page') score += 2;
      results.push({
        entry: item.entry,
        score,
        titleSegments: highlight(item.entry.title, terms),
        snippet: snippet(item.entry.text, terms)
      });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
