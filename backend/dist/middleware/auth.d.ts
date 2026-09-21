import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}
export declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map