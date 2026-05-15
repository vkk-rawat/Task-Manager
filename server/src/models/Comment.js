import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1200, 'Comment cannot exceed 1200 characters']
    }
  },
  { timestamps: true }
);

commentSchema.index({ task: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);
