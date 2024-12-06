const { errorHandler } = require("./../controller/lib/helpers.js");

const roleMiddleware = (allowedRoles) => (req, res, next) => {
    try {
        const userRole = req.user.role;
        console.log({ userRole });

        if (!allowedRoles.includes(userRole)) {
            throw new Error("RoleMiddleware-Unauthorized");
        }
        next();
    } catch (error) {
        errorHandler(error, 'RoleMiddleware-Unauthorized');
        res.status(403).send("Forbidden: Access denied");
    }
}

module.exports = roleMiddleware;