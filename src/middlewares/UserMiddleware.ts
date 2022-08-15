import { Request, Response, NextFunction } from 'express';

import { authApp } from '../apps/AuthApp';
import { userApp } from '../apps/UserApp';

export async function checkUserCredentials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;

  const user = await userApp.findByEmail(email);
  console.debug('[checkUserCredentials] >> Checking if user exists');
  console.debug(user);

  if (user) {
    return res.status(404).json({ error: 'email-already-exists', status: 404 });
  }

  return next();
}

export async function checkLoginCredentials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  const user = await userApp.findByEmail(email);
  console.debug('[checkLoginCredentials] >> Checking if user exists');
  console.debug(user);

  if (!user)
    return res
      .status(404)
      .json({ error: 'email-or-password-wrong', status: 404 });

  const isPasswordValid = await authApp.isPasswordValid(
    password,
    user.password
  );
  console.debug('[checkLoginCredentials] >> Checking if password is valid');

  if (!isPasswordValid) {
    console.error('[checkLoginCredentials] >> Email or password is wrong');
    return res
      .status(404)
      .json({ error: 'email-or-password-wrong', status: 404 });
  }

  return next();
}
