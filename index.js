/**
 * Server bootstrap file
 *
 * This file is responsible only for:
 * - loading environment variables
 * - starting the HTTP server
 * - binding the Express application to a port
 *
 * All application logic lives inside app.js.
 * This separation improves maintainability,
 * testing, and deployment flexibility.
 */

import app from './app.js';
import dotenv from 'dotenv';

/**
 * Load environment variables from .env file.
 */
dotenv.config();

/**
 * Server port configuration.
 *
 * Uses environment variable when available,
 * otherwise defaults to port 3000.
 */
const PORT = process.env.PORT || 3000;

/**
 * Start HTTP server.
 *
 * The Express application is now listening
 * for incoming requests.
 */
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
