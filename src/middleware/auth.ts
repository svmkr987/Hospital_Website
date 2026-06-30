import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  // Simple mock token validation since we removed Firebase
  const token = authHeader.split('Bearer ')[1];
  if (token === 'simple-admin-token-123') {
    req.user = { uid: 'admin', email: 'admin@hospital.com' };
    return next();
  }
  
  return res.status(401).json({ error: 'Unauthorized: Invalid token' });
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer simple-admin-token-123') {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Requires admin role' });
};
