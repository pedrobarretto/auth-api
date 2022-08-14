import { Request, Response, NextFunction } from 'express';

export async function CheckIfUserIsLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.session;

  if (!userId) {
    console.debug('[CheckIfUserIsLoggedIn] >> User is not logged in');
    return res.status(403).json({ staus: 403, error: 'user-not-logged-in' });
  }

  return next();
}
