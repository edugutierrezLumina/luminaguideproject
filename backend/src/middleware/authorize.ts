// backend/src/middleware/authorize.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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