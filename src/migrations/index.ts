import * as migration_20260715_130834_initial from './20260715_130834_initial';

export const migrations = [
  {
    up: migration_20260715_130834_initial.up,
    down: migration_20260715_130834_initial.down,
    name: '20260715_130834_initial'
  },
];
