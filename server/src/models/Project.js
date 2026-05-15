import mongoose from 'mongoose';
import { PROJECT_PRIORITIES } from '../utils/constants.js';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Project title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Project description cannot exceed 2000 characters'],
      default: ''
    },
    deadline: {
      type: Date,
      required: [true, 'Project deadline is required']
    },
    priority: {
      type: String,
      enum: PROJECT_PRIORITIES,
      default: 'Medium'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ owner: 1 });
projectSchema.index({ members: 1 });
projectSchema.index({ deadline: 1 });

export const Project = mongoose.model('Project', projectSchema);
