import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createBlogPost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllBlogPosts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPublishedBlogPosts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBlogPostById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBlogPost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteBlogPost: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=blogController.d.ts.map