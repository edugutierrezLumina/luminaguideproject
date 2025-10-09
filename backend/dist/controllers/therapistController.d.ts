import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getMyProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateMyProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllTherapistsPublic: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTherapistByIdPublic: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=therapistController.d.ts.map