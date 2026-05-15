import { asyncHandler } from '../utils/asyncHandler.js';

export const updateProfile = asyncHandler(async (req, res) => {
  Object.assign(req.user, req.body);
  await req.user.save();

  res.json({
    success: true,
    message: 'Profile updated',
    data: {
      user: req.user
    }
  });
});
