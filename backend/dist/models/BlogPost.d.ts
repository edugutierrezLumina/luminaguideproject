import mongoose, { Document } from 'mongoose';
export interface IBlogPost extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    images: string[];
    videos: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IBlogPost, {}, {}, {}, mongoose.Document<unknown, {}, IBlogPost, {}, {}> & IBlogPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=BlogPost.d.ts.map