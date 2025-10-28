import { Request, Response, NextFunction } from 'express';

export function devAuth(req: Request, res: Response, next: NextFunction) {
    const dev = req.headers['x-dev-user'];
    if (dev) {
        // header: x-dev-user: admin|user
        const role = String(dev);
        (req as any).user = {
            id: role === 'admin' ? 2 : 1,
            isAdmin: role === 'admin'
        };
    }
    next();
}
