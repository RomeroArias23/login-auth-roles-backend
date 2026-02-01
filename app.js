/**
 * Express application configuration
 *
 * This file is responsible for:
 * - creating the Express application
 * - registering global middleware
 * - mounting API routes
 * - initializing core services (database)
 *
 * It represents the central entry point of the backend application.
 */

import express from 'express';
import cors from 'cors';

/**
 * Route modules
 */
import authRoutes from './routes/authRoutes.js';
import dataRoutes from './routes/dataRoutes.js';

/**
 * Database initialization
 */
import { connectDB } from './config/db.js';

/**
 * Create Express application instance.
 */
const app = express();

/**
 * Disable ETag headers.
 *
 * This prevents browser-side caching issues
 * when working with authenticated requests
 * and JWT-protected APIs.
 */
app.disable('etag');

/**
 * Initialize database connection.
 *
 * This is executed once at application startup.
 */
connectDB();

/**
 * Enable Cross-Origin Resource Sharing (CORS).
 *
 * Allows frontend applications hosted on
 * different domains/ports to access the API.
 */
app.use(cors());

/**
 * Parse incoming JSON payloads.
 *
 * Required to read req.body in controllers.
 */
app.use(express.json());

/**
 * Mount authentication routes.
 *
 * Base path:
 *   /auth
 *
 * Example:
 *   POST /auth/login
 */
app.use('/auth', authRoutes);

/**
 * Mount protected data routes.
 *
 * Base path:
 *   /data
 *
 * Example:
 *   GET /data/admin
 */
app.use('/data', dataRoutes);

/**
 * Health check endpoint.
 *
 * Useful for:
 * - verifying server availability
 * - load balancer health checks
 * - local development testing
 */
app.get('/', (req, res) => {
    res.send('Backend working');
});

/**
 * Export Express app instance.
 *
 * The server is started separately
 * to allow easier testing and scalability.
 */
export default app;