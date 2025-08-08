import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();
const authController = new AuthController();

// POST /api/auth/login
router.post('/login', authController.login.bind(authController));

// POST /api/auth/logout
router.post('/logout', authController.logout);

// POST /api/auth/refresh
router.post('/refresh', authController.refresh);

// GET /api/auth/me
router.get('/me', authMiddleware, authController.me);

export { router as authRoutes };
