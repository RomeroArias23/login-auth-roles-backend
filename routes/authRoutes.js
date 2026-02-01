/**
 * Authentication routes
 *
 * This file defines all HTTP endpoints related to authentication.
 *
 * It acts as the routing layer between:
 * - incoming HTTP requests
 * - authentication controllers
 *
 * Route responsibility:
 * - delegate request handling
 * - keep business logic out of route definitions
 */

import express from 'express';
import { login } from '../controllers/authController.js';

/**
 * Create isolated Express router instance.
 *
 * This allows authentication routes to be mounted
 * under a specific path, for example:
 *
 *   app.use('/auth', authRoutes);
 */
const router = express.Router();

/**
 * POST /auth/login
 *
 * Public endpoint.
 *
 * Used to authenticate users using:
 * - username
 * - password
 *
 * On success returns:
 * - JWT access token
 * - user id
 * - username
 * - role
 *
 * The actual authentication logic is handled
 * inside the authController.
 */
router.post('/login', login);

/**
 * Export router to be mounted in the main app.
 */
export default router;