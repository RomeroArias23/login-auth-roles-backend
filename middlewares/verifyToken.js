/**
 * JWT verification middleware
 *
 * This middleware is responsible for:
 * - extracting the JWT token from the request
 * - validating its signature
 * - checking token expiration
 * - attaching the decoded user payload to the request
 *
 * It protects private API routes from unauthorized access.
 */

import { jwtVerify } from 'jose';
import dotenv from 'dotenv';

/**
 * Load environment variables.
 * JWT_SECRET must be defined in the .env file.
 */
dotenv.config();

/**
 * Convert secret string into Uint8Array,
 * which is required by the jose library.
 */
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Middleware: verifyToken
 *
 * This function runs before protected routes.
 *
 * If the token is valid:
 * - req.user will be populated
 * - request continues to the next middleware/controller
 *
 * If the token is missing or invalid:
 * - request is rejected immediately
 */
export async function verifyToken(req, res, next) {

    /**
     * Authorization header format:
     *
     * Authorization: Bearer <jwt_token>
     */
    const authHeader = req.headers['authorization'];

    /**
     * Reject request if Authorization header is missing.
     */
    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    /**
     * Extract token from "Bearer <token>" format.
     */
    const token = authHeader.split(' ')[1];

    /**
     * Reject malformed authorization headers.
     */
    if (!token) {
        return res.status(401).json({
            message: 'Malformed token'
        });
    }

    try {
        /**
         * Verify JWT token.
         *
         * jwtVerify performs:
         * - signature validation
         * - expiration check (exp claim)
         * - payload decoding
         *
         * If verification fails, an exception is thrown.
         */
        const { payload } = await jwtVerify(token, secret);

        /**
         * Attach decoded user information to the request.
         *
         * This data becomes available to:
         * - authorization middleware (checkRole)
         * - route controllers
         */
        req.user = {
            id: payload.id,
            username: payload.username,
            role: payload.role
        };

        /**
         * Token successfully validated.
         * Continue request lifecycle.
         */
        next();

    } catch (err) {

        /**
         * Token verification failure may be caused by:
         * - expired token
         * - invalid signature
         * - malformed token
         * - wrong secret
         */
        console.error('Token verification failed:', err);

        return res.status(403).json({
            message: 'Invalid or expired token'
        });
    }
}