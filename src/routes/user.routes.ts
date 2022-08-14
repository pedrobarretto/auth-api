import { Router, Request, Response } from 'express';

import { userApp } from '../apps/UserApp';
import { CheckIfUserIsLoggedIn } from '../middlewares/AuthMiddleware';

const userRoutes = Router();

userRoutes.use(CheckIfUserIsLoggedIn);

userRoutes.post('/changePassword', async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const { userId } = req.session;

  await userApp.changePassword(userId, newPassword);

  return res.sendStatus(204);
});

export { userRoutes };
