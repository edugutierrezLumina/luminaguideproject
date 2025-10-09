import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map