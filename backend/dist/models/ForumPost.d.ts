import mongoose, { Document } from 'mongoose';
export interface IForumPost extends Document {
    content: string;
    authorName: string;
    isApproved: boolean;
    approvedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IForumPost, {}, {}, {}, mongoose.Document<unknown, {}, IForumPost, {}, {}> & IForumPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ForumPost.d.ts.map