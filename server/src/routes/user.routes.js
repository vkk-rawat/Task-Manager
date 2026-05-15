import { Router } from 'express';
import { updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/user.validator.js';

const router = Router();

router.put('/me', protect, validate(updateProfileSchema), updateProfile);

export default router;
