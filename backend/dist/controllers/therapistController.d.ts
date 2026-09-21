import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getAvailableFilters: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllTherapistsPublic: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTherapistByIdPublic: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createTherapist: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllTherapistsAdmin: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTherapist: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTherapist: (req: AuthRequest, res: Response) => Promise<void>;
export declare const reactivateTherapist: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleTherapistStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const hardDeleteTherapist: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMyProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateMyProfile: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=therapistController.d.ts.map