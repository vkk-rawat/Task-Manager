import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from '../controllers/project.controller.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProjectSchema,
  projectQuerySchema,
  updateProjectSchema
} from '../validators/project.validator.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(validate(projectQuerySchema, 'query'), getProjects)
  .post(authorize('admin'), validate(createProjectSchema), createProject);

router
  .route('/:id')
  .get(getProjectById)
  .put(authorize('admin'), validate(updateProjectSchema), updateProject)
  .delete(authorize('admin'), deleteProject);

export default router;
