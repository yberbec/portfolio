/**
 * Live-data settings. Everything here is public: the site fetches from the
 * visitor's browser, so never put a secret in this file.
 */
export const LIVE_CONFIG = {
  github: {
    user: 'yberbec',
    /** How many recently-pushed repos to read commits from for the Shipping feed. */
    commitRepos: 3,
    /** Repos to leave out of the feed and repo lists (e.g. profile-README repos). */
    excludeRepos: ['yberbec', 'Yahya-Berbeche']
  },
  lastfm: {
    /** Your Last.fm username, e.g. 'yberbec'. Leave empty to show the setup card. */
    user: 'yberbec',
    /** A Last.fm API key (public, read-only). Create one at https://www.last.fm/api/account/create */
    apiKey: 'ffecc9629df4c0e4c099cdcb040e332b'
  },
  contact: {
    /**
     * Public email shown on the site: a forwarding alias, never your real inbox.
     * Leave empty to show no address at all.
     */
    email: '',
    /** Web3Forms access key for the contact form (public-safe). Get one at https://web3forms.com. Empty hides the form. */
    web3formsKey: ''
  },
  location: {
    city: 'Montréal',
    latitude: 45.5017,
    longitude: -73.5673,
    timeZone: 'America/Toronto'
  },
  /** How long fetched data is reused (per visitor tab) before asking the APIs again. */
  cacheMinutes: 10
};
