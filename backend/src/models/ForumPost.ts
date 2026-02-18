import mongoose, { Document, Schema } from 'mongoose';

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
  therapistId: mongoose.Types.ObjectId; // ✅ Ya está correcto
  therapistName: string;
  content: string;
  createdAt: Date;
}

const ReplySchema = new Schema<IReply>({
  therapistId: {
    type: Schema.Types.ObjectId, // ✅ Esto es correcto
    ref: 'User',
    required: true
  },
  therapistName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ForumPostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true,
    minlength: 20
  },
  authorName: {
    type: String,
    required: true,
    default: 'Anonymous',
    trim: true
  },
  authorEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  category: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  replies: {
    type: [ReplySchema],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

ForumPostSchema.index({ status: 1, createdAt: -1 });
ForumPostSchema.index({ title: 'text', content: 'text' });

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);