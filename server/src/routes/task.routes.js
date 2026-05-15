import { Router } from 'express';
import {
  addTaskComment,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from '../controllers/task.controller.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  commentSchema,
  createTaskSchema,
  taskQuerySchema,
  updateTaskSchema
} from '../validators/task.validator.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(validate(taskQuerySchema, 'query'), getTasks)
  .post(authorize('admin'), validate(createTaskSchema), createTask);

router.post('/:id/comments', validate(commentSchema), addTaskComment);

router
  .route('/:id')
  .get(getTaskById)
  .put(validate(updateTaskSchema), updateTask)
  .delete(authorize('admin'), deleteTask);

export default router;
