const MigrationRunner = require('./migrations/migrationRunner');
const Chord = require('./models/chords');
const Song = require('./models/song');
const User = require('./models/user');

// Import all migrations
const migration001 = require('./migrations/001_initial_schema');
const migration002 = require('./migrations/002_seed_initial_data');
const migration003 = require('./migrations/003_add_schema_validation');
const migration004 = require('./migrations/004_add_chord_categories');
const migration005 = require('./migrations/005_add_song_approval_system');
const migration006 = require('./migrations/006_fix_song_status');
const migration007 = require('./migrations/007_fix_sample_songs_status');

const runner = new MigrationRunner();

// Register migrations
runner.register(
    migration001.name,
    migration001.version,
    async () => await migration001.up({ Chord, Song, User })
);

runner.register(
    migration002.name,
    migration002.version,
    async () => await migration002.up({ Chord, Song, User })
);

runner.register(
    migration003.name,
    migration003.version,
    async () => await migration003.up({ Chord, Song, User })
);

runner.register(
    migration004.name,
    migration004.version,
    async () => await migration004.up({ Chord, Song, User })
);

runner.register(
    migration005.name,
    migration005.version,
    async () => await migration005.up({ Chord, Song, User })
);

runner.register(
    migration006.name,
    migration006.version,
    async () => await migration006.up({ Chord, Song, User })
);

runner.register(
    migration007.name,
    migration007.version,
    async () => await migration007.up({ Chord, Song, User })
);

// Run migrations
const command = process.argv[2];

if (command === 'rollback') {
    runner.rollback();
} else {
    runner.runMigrations();
} 