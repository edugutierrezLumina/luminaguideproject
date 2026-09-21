import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createForumPost: (req: Request, res: Response) => Promise<void>;
export declare const getApprovedPosts: (req: Request, res: Response) => Promise<void>;
export declare const getPostById: (req: Request, res: Response) => Promise<void>;
export declare const addReply: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPendingPosts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const moderatePost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePost: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=forumController.d.ts.map