/**
 * Database seed script
 *
 * This script populates the database with initial users.
 *
 * It is intended ONLY for development and testing environments.
 *
 * In real enterprise systems, seeding is commonly used to:
 * - create demo users
 * - initialize environments
 * - simplify local development
 */

import bcrypt from 'bcrypt';
import { connectDB, getDB } from '../config/db.js';

/**
 * Seed function
 *
 * Flow:
 * 1. Connect to the database
 * 2. Define initial user accounts
 * 3. Hash passwords using bcrypt
 * 4. Insert users into the database
 * 5. Ignore duplicates safely
 */
async function seed() {

    /**
     * Establish database connection.
     * Required before performing any queries.
     */
    await connectDB();

    /**
     * Retrieve active database instance.
     */
    const db = getDB();

    /**
     * Demo users for local development.
     *
     * Passwords are stored in plaintext ONLY here.
     * They are immediately hashed before insertion.
     *
     * Roles reflect the authorization model:
     * - user    → basic access
     * - advisor → restricted role
     * - admin   → full access
     */
    const users = [
        { username: 'user1', password: 'password1', role: 'user' },
        { username: 'advisor1', password: 'password2', role: 'advisor' },
        { username: 'admin1', password: 'password3', role: 'admin' },
    ];

    /**
     * Iterate through users and insert them into the database.
     */
    for (const u of users) {

        /**
         * Hash password using bcrypt.
         *
         * Salt rounds = 10
         * Higher values increase security but reduce performance.
         */
        const hashed = await bcrypt.hash(u.password, 10);

        try {
            /**
             * Insert user record.
             *
             * Password hashes are stored instead of plaintext passwords.
             */
            await db.run(
                'INSERT INTO users (username, passwordHashed, role) VALUES (?, ?, ?)',
                [u.username, hashed, u.role]
            );

        } catch (err) {

            /**
             * Ignore duplicate users.
             *
             * This allows the seed script to be executed
             * multiple times safely without crashing.
             */
            if (err.message.includes('UNIQUE')) continue;
        }
    }

    /**
     * Confirmation message for successful seeding.
     */
    console.log('Users seeded.');

    /**
     * Exit Node process explicitly.
     * This script is not meant to keep running.
     */
    process.exit(0);
}

/**
 * Execute seed script.
 */
seed();