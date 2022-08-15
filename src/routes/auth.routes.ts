import { Router, Request, Response } from 'express';

import { userApp } from '../apps/UserApp';
import {
  checkUserCredentials,
  checkLoginCredentials,
} from '../middlewares/UserMiddleware';

const authRoutes = Router();

authRoutes.post(
  '/register',
  checkUserCredentials,
  async (req: Request, res: Response) => {
    const { name, lastName, email, password } = req.body;
    const user = await userApp.register({ name, lastName, email, password });
    req.session.userId = user.id;
    req.session.save();
    return res.status(201).json(user);
  }
);

authRoutes.post(
  '/login',
  checkLoginCredentials,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { isPasswordValid, userId, token } = await userApp.login({
      email,
      password,
    });
    if (isPasswordValid) {
      req.session.userId = userId;
      req.session.save();
    }
    return res.status(200).json({ userId, token });
  }
);

authRoutes.post('/logout', async (req: Request, res: Response) => {
  req.session.userId = null;
  req.session.destroy((err) => {
    console.debug(err);
  });
  return res.sendStatus(200);
});

authRoutes.get('/secret', (req: Request, res: Response) => {
  if (req.session.userId) {
    return res.send(`Logado com sucesso! Seu id: ${req.session.userId}`);
  }

  return res.sendStatus(403);
});

export { authRoutes };
