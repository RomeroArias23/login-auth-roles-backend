/**
 * Role-based authorization middleware
 *
 * This middleware is responsible for enforcing access control
 * based on user roles extracted from the JWT token.
 *
 * It is executed AFTER token verification.
 *
 * Typical roles supported:
 * - user
 * - advisor
 * - admin
 */

export function checkRole(roles = []) {

    /**
     * The function returns an Express middleware.
     * This allows passing allowed roles dynamically per route.
     *
     * Example:
     *   checkRole(['admin'])
     *   checkRole(['advisor', 'admin'])
     */
    return (req, res, next) => {

        /**
         * At this point, req.user must already exist.
         * It is injected by the verifyToken middleware
         * after successful JWT validation.
         *
         * Example:
         * req.user = {
         *   id: 1,
         *   username: 'admin1',
         *   role: 'admin'
         * }
         */

        /**
         * Authorization check:
         * - If the user is not authenticated
         * - Or the user's role is not included in allowed roles
         *
         * Access is denied.
         */
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied: insufficient permissions'
            });
        }

        /**
         * If the user has the required role,
         * allow the request to continue to the controller.
         */
        next();
    };
}
