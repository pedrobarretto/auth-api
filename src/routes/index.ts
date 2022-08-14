import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';

const router = Router();

router.use('/auth/v1', authRoutes);
router.use('/user/v1', userRoutes);

export { router };
