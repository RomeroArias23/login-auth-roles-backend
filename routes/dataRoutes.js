/**
 * Protected data routes
 *
 * This file defines all secured API endpoints.
 *
 * These routes demonstrate:
 * - JWT authentication
 * - role-based authorization
 * - middleware chaining
 *
 * All endpoints in this router require a valid JWT token.
 */

import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkRole } from '../middlewares/checkRole.js';

/**
 * Create isolated router instance.
 *
 * Mounted in the main application as:
 *
 *   app.use('/data', dataRoutes);
 */
const router = express.Router();

/**
 * GET /data/all
 *
 * Accessible by any authenticated user.
 *
 * Requirements:
 * - valid JWT token
 *
 * Purpose:
 * - demonstrates basic protected route access
 * - returns user identity extracted from JWT payload
 */
router.get('/all', verifyToken, (req, res) => {

    /**
     * req.user is injected by verifyToken middleware.
     * It contains decoded JWT payload:
     *
     * {
     *   id,
     *   username,
     *   role
     * }
     */
    res.json({
        message: `Hello ${req.user.username}, your role is ${req.user.role}`
    });
});

/**
 * GET /data/admin
 *
 * Restricted endpoint.
 *
 * Requirements:
 * - valid JWT token
 * - user role must be "admin"
 *
 * Middleware execution order:
 * 1. verifyToken  → validates token
 * 2. checkRole    → verifies user role
 * 3. controller   → returns response
 */
router.get(
    '/admin',
    verifyToken,
    checkRole(['admin']),
    (req, res) => {
        res.json({
            message: 'Admin content here'
        });
    }
);

/**
 * GET /data/advisor
 *
 * Restricted endpoint.
 *
 * Requirements:
 * - valid JWT token
 * - user role must be "advisor"
 *
 * Demonstrates fine-grained access control.
 */
router.get(
    '/advisor',
    verifyToken,
    checkRole(['advisor']),
    (req, res) => {
        res.json({
            message: 'Advisor content here'
        });
    }
);

/**
 * Export router to be mounted by the main Express app.
 */
export default router;