import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createForumPost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPendingForumPosts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getApprovedForumPosts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const approveForumPost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteForumPost: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=forumController.d.ts.map