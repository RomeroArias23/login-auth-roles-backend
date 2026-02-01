/**
 * Authentication Controller
 *
 * Responsible for handling user authentication logic.
 *
 * This controller:
 * - validates login input
 * - verifies user credentials
 * - generates a signed JWT token
 * - returns minimal user information to the frontend
 *
 * This file represents the "authentication boundary" of the system.
 */

import { getDB } from '../config/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

/**
 * POST /auth/login
 *
 * Login flow:
 * 1. Validate request payload
 * 2. Retrieve user from database
 * 3. Compare plaintext password with bcrypt hash
 * 4. Generate JWT access token
 * 5. Return user identity + token
 *
 * All authorization decisions are handled later by middleware
 * using the JWT token.
 */
export async function login(req, res) {

    /**
     * Extract credentials from request body.
     * Expected payload:
     *
     * {
     *   "username": "admin1",
     *   "password": "password123"
     * }
     */
    const { username, password } = req.body;

    /**
     * Basic input validation.
     * Prevents empty or malformed requests.
     */
    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password required'
        });
    }

    try {
        /**
         * Obtain active SQLite connection.
         * The connection is created once at app startup.
         */
        const db = getDB();

        /**
         * Retrieve user by username.
         * Passwords are NEVER stored or compared in plaintext.
         */
        const user = await db.get(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        /**
         * If the user does not exist, return generic error.
         * This avoids leaking information about valid usernames.
         */
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        /**
         * Compare provided password with stored bcrypt hash.
         *
         * bcrypt.compare():
         * - hashes the input password
         * - compares it securely against the stored hash
         */
        const isMatch = await bcrypt.compare(
            password,
            user.passwordHashed
        );

        /**
         * If password comparison fails,
         * return the same generic error message.
         */
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        /**
         * Generate signed JWT access token.
         *
         * The token includes:
         * - user id
         * - username
         * - role
         *
         * Token expiration is enforced server-side.
         */
        const token = await generateToken(user);

        /**
         * Successful authentication response.
         *
         * Sensitive information such as password hashes
         * is NEVER returned to the client.
         */
        res.json({
            id: user.id,
            username: user.username,
            role: user.role,
            token: token
        });

    } catch (err) {

        /**
         * Any unexpected error is treated as internal server error.
         * Detailed logs remain server-side only.
         */
        console.error('Login error:', err);

        res.status(500).json({
            message: 'Server error'
        });
    }
}
