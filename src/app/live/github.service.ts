import { Injectable, computed, signal } from '@angular/core';
import { LIVE_CONFIG } from '../config';
import { LoadState, cachedJson } from './live-utils';

export interface ContributionDay { date: string; count: number; level: 0 | 1 | 2 | 3 | 4; }

export type ShipKind = 'commit' | 'push' | 'merge' | 'release' | 'repo';

export interface ShipItem {
  kind: ShipKind;
  repo: string;
  title: string;
  url: string;
  date: string;
}

export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

interface CalendarResponse { total: Record<string, number>; contributions: ContributionDay[]; }

interface GhEvent {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { number: number; title: string; html_url: string; merged?: boolean };
    release?: { tag_name: string; name: string | null; html_url: string };
  };
}

interface GhCommit {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null; committer: { date: string } | null };
}

const API = 'https://api.github.com';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly user = LIVE_CONFIG.github.user;
  readonly profileUrl = `https://github.com/${this.user}`;

  readonly state = signal<LoadState>('idle');
  readonly calendar = signal<ContributionDay[]>([]);
  readonly yearTotal = signal(0);
  readonly feed = signal<ShipItem[]>([]);
  readonly repos = signal<Repo[]>([]);
  readonly fetchedAt = signal<Date | null>(null);

  readonly latest = computed<ShipItem | null>(() => this.feed().at(0) ?? null);
  /** Last 28 days of the calendar, for the compact home-page strip. */
  readonly recentDays = computed(() => this.calendar().slice(-28));
  readonly ownRepos = computed(() => this.repos().filter(r => !r.fork && !r.archived && !isExcluded(r.name)));

  private loading?: Promise<void>;

  /** Safe to call from any component; only the first call hits the network. */
  load(): Promise<void> {
    this.loading ??= this.fetchAll();
    return this.loading;
  }

  repo(name: string): Repo | undefined {
    return this.repos().find(r => r.name.toLowerCase() === name.toLowerCase());
  }

  private async fetchAll(): Promise<void> {
    this.state.set('loading');
    const [calendar, events, repos] = await Promise.allSettled([
      cachedJson<CalendarResponse>('gh-calendar', `https://github-contributions-api.jogruber.de/v4/${this.user}?y=last`),
      cachedJson<GhEvent[]>('gh-events', `${API}/users/${this.user}/events/public?per_page=100`),
      cachedJson<Repo[]>('gh-repos', `${API}/users/${this.user}/repos?per_page=100&sort=pushed`)
    ]);

    if (calendar.status === 'fulfilled') {
      this.calendar.set(trimToToday(calendar.value.contributions));
      this.yearTotal.set(calendar.value.total['lastYear'] ?? this.calendar().reduce((sum, d) => sum + d.count, 0));
    }
    const repoList = repos.status === 'fulfilled' ? repos.value : [];
    this.repos.set(repoList);

    const items: ShipItem[] = events.status === 'fulfilled' ? events.value.flatMap(toShipItems).filter(i => !isExcluded(i.repo)) : [];

    // Push events no longer carry commit messages, so read recent commits from the most recently pushed repos.
    const targets = repoList.filter(r => !r.fork && !r.archived && !isExcluded(r.name)).slice(0, LIVE_CONFIG.github.commitRepos);
    const commitLists = await Promise.allSettled(
      targets.map(r => cachedJson<GhCommit[]>(`gh-commits-${r.name}`, `${API}/repos/${this.user}/${r.name}/commits?per_page=10`)
        .then(list => list.map(c => commitItem(r.name, c))))
    );
    for (const result of commitLists) if (result.status === 'fulfilled') items.push(...result.value);

    this.feed.set(dedupe(items).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30));
    this.fetchedAt.set(new Date());
    const anyOk = [calendar, events, repos].some(r => r.status === 'fulfilled');
    this.state.set(anyOk ? 'ready' : 'error');
  }
}

function trimToToday(days: ContributionDay[]): ContributionDay[] {
  const today = new Date().toISOString().slice(0, 10);
  return days.filter(d => d.date <= today);
}

function repoShort(full: string): string {
  return full.split('/').pop() ?? full;
}

function toShipItems(e: GhEvent): ShipItem[] {
  const repo = repoShort(e.repo.name);
  const repoUrl = `https://github.com/${e.repo.name}`;
  switch (e.type) {
    case 'PushEvent': {
      const branch = e.payload.ref?.replace('refs/heads/', '') ?? 'main';
      return [{ kind: 'push', repo, title: `pushed to ${branch}`, url: `${repoUrl}/tree/${branch}`, date: e.created_at }];
    }
    case 'PullRequestEvent': {
      const pr = e.payload.pull_request;
      if (!pr || e.payload.action !== 'closed' || pr.merged === false) return [];
      return [{ kind: 'merge', repo, title: `merged #${pr.number}: ${pr.title}`, url: pr.html_url, date: e.created_at }];
    }
    case 'ReleaseEvent': {
      const rel = e.payload.release;
      if (!rel || e.payload.action !== 'published') return [];
      return [{ kind: 'release', repo, title: `released ${rel.name || rel.tag_name}`, url: rel.html_url, date: e.created_at }];
    }
    case 'CreateEvent':
      if (e.payload.ref_type === 'repository') return [{ kind: 'repo', repo, title: 'created the repository', url: repoUrl, date: e.created_at }];
      if (e.payload.ref_type === 'tag') return [{ kind: 'release', repo, title: `tagged ${e.payload.ref}`, url: `${repoUrl}/releases`, date: e.created_at }];
      return [];
    default:
      return [];
  }
}

function commitItem(repo: string, c: GhCommit): ShipItem {
  const message = c.commit.message.split('\n')[0];
  const pr = /^Merge pull request #(\d+)/.exec(message);
  return {
    kind: /^Merge /.test(message) ? 'merge' : 'commit',
    repo,
    title: pr ? `merged #${pr[1]}` : message,
    url: c.html_url,
    date: c.commit.committer?.date ?? c.commit.author?.date ?? ''
  };
}

/** Drop a bare "pushed to X" when a commit in the same repo landed within a few minutes of it. */
function dedupe(items: ShipItem[]): ShipItem[] {
  const commits = items.filter(i => i.kind === 'commit');
  return items.filter(item => {
    if (item.kind !== 'push') return true;
    const t = new Date(item.date).getTime();
    return !commits.some(c => c.repo === item.repo && Math.abs(new Date(c.date).getTime() - t) < 10 * 60_000);
  });
}

function isExcluded(repo: string): boolean {
  return LIVE_CONFIG.github.excludeRepos.some(name => name.toLowerCase() === repo.toLowerCase());
}
