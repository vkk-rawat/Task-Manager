import { Router } from 'express';
import { addMember, getTeam, removeMember } from '../controllers/team.controller.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { memberChangeSchema } from '../validators/team.validator.js';

const router = Router();

router.use(protect);

router.get('/', getTeam);
router.post('/add-member', authorize('admin'), validate(memberChangeSchema), addMember);
router.delete('/remove-member', authorize('admin'), validate(memberChangeSchema), removeMember);

export default router;
