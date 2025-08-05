const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Chord = require('../models/chords');
const Song = require('../models/song');
const User = require('../models/user');

// Migration tracking collection
const migrationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    appliedAt: { type: Date, default: Date.now },
    version: { type: Number, required: true }
});

const Migration = mongoose.model('Migration', migrationSchema);

class MigrationRunner {
    constructor() {
        this.migrations = [];
    }

    // Register a migration
    register(name, version, upFunction) {
        this.migrations.push({
            name,
            version,
            up: upFunction
        });
    }

    // Run all pending migrations
    async runMigrations() {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to MongoDB');

            // Sort migrations by version
            this.migrations.sort((a, b) => a.version - b.version);

            for (const migration of this.migrations) {
                const exists = await Migration.findOne({ name: migration.name });
                
                if (!exists) {
                    console.log(`Running migration: ${migration.name} (v${migration.version})`);
                    await migration.up();
                    
                    // Record the migration
                    await new Migration({
                        name: migration.name,
                        version: migration.version
                    }).save();
                    
                    console.log(`✓ Migration ${migration.name} completed`);
                } else {
                    console.log(`- Migration ${migration.name} already applied`);
                }
            }

            console.log('All migrations completed!');
            process.exit(0);
        } catch (error) {
            console.error('Migration failed:', error);
            process.exit(1);
        }
    }

    // Rollback last migration
    async rollback() {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            
            const lastMigration = await Migration.findOne().sort({ version: -1 });
            if (!lastMigration) {
                console.log('No migrations to rollback');
                return;
            }

            console.log(`Rolling back: ${lastMigration.name}`);
            // You can implement rollback logic here
            await Migration.deleteOne({ _id: lastMigration._id });
            console.log(`Rolled back: ${lastMigration.name}`);
            
            process.exit(0);
        } catch (error) {
            console.error('Rollback failed:', error);
            process.exit(1);
        }
    }

    async showStatus() {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            
            const appliedMigrations = await Migration.find().sort({ version: 1 });
            const pendingMigrations = this.migrations.filter(m => 
                !appliedMigrations.find(am => am.name === m.name)
            );

            console.log('\n=== Migration Status ===');
            console.log('\nApplied migrations:');
            appliedMigrations.forEach(m => {
                console.log(`✓ ${m.name} (v${m.version}) - ${m.appliedAt}`);
            });

            if (pendingMigrations.length > 0) {
                console.log('\nPending migrations:');
                pendingMigrations.forEach(m => {
                    console.log(`- ${m.name} (v${m.version})`);
                });
            } else {
                console.log('\n✓ All migrations applied');
            }
            
            process.exit(0);
        } catch (error) {
            console.error('Status check failed:', error);
            process.exit(1);
        }
    }
}

module.exports = MigrationRunner; 