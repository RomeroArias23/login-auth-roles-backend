/**
 * SQLite database configuration
 *
 * This file is responsible for:
 * - creating the database connection
 * - initializing required tables
 * - exposing a single shared database instance
 *
 * In a real enterprise system, this layer would normally be replaced
 * by PostgreSQL / MySQL / Oracle, but SQLite is ideal for local development
 * and technical assessments.
 */

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Node.js ES Modules do not provide __dirname by default.
 * These two lines recreate it so we can build absolute file paths safely.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Internal reference to the database connection.
 * It is kept private and accessed only through getDB().
 */
let db;

/**
 * Initializes the SQLite database connection.
 *
 * This function:
 * 1. Opens (or creates) the SQLite file
 * 2. Creates required tables if they do not exist
 * 3. Keeps the connection in memory for reuse
 *
 * It must be executed ONCE when the application starts.
 */
export async function connectDB() {
    db = await open({
        // Absolute path ensures compatibility across OS environments
        filename: path.join(__dirname, '../database.sqlite'),

        // SQLite driver used by the `sqlite` package
        driver: sqlite3.Database
    });

    /**
     * Users table
     *
     * - id: auto-increment primary key
     * - username: unique login identifier
     * - passwordHashed: bcrypt-hashed password
     * - role: authorization role used for access control
     *
     * Roles supported:
     * - user
     * - advisor
     * - admin
     */
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            passwordHashed TEXT,
            role TEXT
        )
    `);

    console.log('SQLite connected and users table ready.');
}

/**
 * Returns the active database connection.
 *
 * This ensures:
 * - a single shared connection across the app
 * - consistent access from controllers and services
 *
 * If the database is accessed before initialization,
 * an explicit error is thrown to avoid silent failures.
 */
export function getDB() {
    if (!db) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return db;
}
