import * as migration_20260623_205547_initial from './20260623_205547_initial';

export const migrations = [
  {
    up: migration_20260623_205547_initial.up,
    down: migration_20260623_205547_initial.down,
    name: '20260623_205547_initial'
  },
];
