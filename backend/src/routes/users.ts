import { Router } from 'express';

const router = Router();

// GET /api/users
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Users endpoint - TODO: Implement',
    data: [],
  });
});

export { router as userRoutes };
