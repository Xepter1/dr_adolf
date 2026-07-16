import * as migration_20260715_130834_initial from './20260715_130834_initial';
import * as migration_20260716_115528_tagline_default from './20260716_115528_tagline_default';
import * as migration_20260716_121606_aktuelles from './20260716_121606_aktuelles';

export const migrations = [
  {
    up: migration_20260715_130834_initial.up,
    down: migration_20260715_130834_initial.down,
    name: '20260715_130834_initial',
  },
  {
    up: migration_20260716_115528_tagline_default.up,
    down: migration_20260716_115528_tagline_default.down,
    name: '20260716_115528_tagline_default',
  },
  {
    up: migration_20260716_121606_aktuelles.up,
    down: migration_20260716_121606_aktuelles.down,
    name: '20260716_121606_aktuelles'
  },
];
