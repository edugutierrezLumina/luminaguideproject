import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createTherapist: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllTherapists: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTherapistById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTherapist: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTherapist: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=adminController.d.ts.map