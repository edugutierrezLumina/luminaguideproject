export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            });
            return;
        }
        next();
    };
};
//# sourceMappingURL=authorize.js.map