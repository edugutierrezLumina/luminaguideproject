import mongoose, { Document, Schema } from 'mongoose';

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

const BlogPostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  videos: {
    type: [String],
    default: []
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);