import mongoose, { Document } from 'mongoose';
export interface IForumPost extends Document {
    title: string;
    content: string;
    authorName: string;
    authorEmail?: string;
    status: 'pending' | 'approved' | 'rejected';
    category?: string;
    tags?: string[];
    replies: IReply[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IReply {
    _id?: mongoose.Types.ObjectId;
    therapistId: mongoose.Types.ObjectId;
    therapistName: string;
    content: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IForumPost, {}, {}, {}, mongoose.Document<unknown, {}, IForumPost, {}, {}> & IForumPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ForumPost.d.ts.map