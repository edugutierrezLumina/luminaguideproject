import mongoose, { Document, Schema } from 'mongoose';

export interface IForumPost extends Document {
  content: string;
  authorName: string; // Para posts anónimos
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema: Schema = new Schema({
  content: {
    type: String,
    required: [true, 'This content is required'],
    maxlength: 1000
  },
  authorName: {
    type: String,
    required: [true, 'The author name is required'],
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);