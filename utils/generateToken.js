/**
 * JWT token generation utility
 *
 * This module is responsible for creating signed JSON Web Tokens (JWT).
 *
 * The generated token is used as an access token to:
 * - authenticate API requests
 * - identify the current user
 * - enforce role-based authorization
 *
 * Tokens are stateless and do not require server-side storage.
 */

import { SignJWT } from 'jose';
import dotenv from 'dotenv';

/**
 * Load environment variables.
 * JWT_SECRET must be defined in the .env file.
 */
dotenv.config();

/**
 * Generates a signed JWT access token.
 *
 * @param {Object} user - Authenticated user object
 * @param {number} user.id - User unique identifier
 * @param {string} user.username - Login username
 * @param {string} user.role - Authorization role
 *
 * @returns {Promise<string>} Signed JWT token
 */
export async function generateToken(user) {

    /**
     * Convert secret key into Uint8Array.
     * Required by the jose cryptography API.
     */
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    try {
        /**
         * Create a new JWT token.
         *
         * Payload contains only non-sensitive data.
         * Passwords and hashes are NEVER included.
         */
        const token = await new SignJWT({
            id: user.id,
            username: user.username,
            role: user.role
        })
            /**
             * Specify signing algorithm.
             * HS256 = HMAC SHA-256 symmetric encryption.
             */
            .setProtectedHeader({ alg: 'HS256' })

            /**
             * Token expiration time.
             *
             * Short-lived access tokens reduce security risk
             * in case a token is compromised.
             */
            .setExpirationTime('1m')

            /**
             * Cryptographically sign the token.
             */
            .sign(secret);

        /**
         * Return signed JWT string.
         */
        return token;

    } catch (error) {

        /**
         * Any cryptographic or configuration failure
         * is logged and propagated to the caller.
         */
        console.error('Token generation failed:', error);
        throw error;
    }
}