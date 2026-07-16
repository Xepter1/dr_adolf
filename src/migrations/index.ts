import * as migration_20260715_130834_initial from './20260715_130834_initial';
import * as migration_20260716_115528_tagline_default from './20260716_115528_tagline_default';

export const migrations = [
  {
    up: migration_20260715_130834_initial.up,
    down: migration_20260715_130834_initial.down,
    name: '20260715_130834_initial',
  },
  {
    up: migration_20260716_115528_tagline_default.up,
    down: migration_20260716_115528_tagline_default.down,
    name: '20260716_115528_tagline_default'
  },
];
