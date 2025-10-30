import { Request, Response, NextFunction } from 'express';

export function devAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Token de autenticação não fornecido' });
        return;
    }

    const [, token] = authHeader.split(' ');

    if (token === 'mock-token-colaborador') {
        (req as any).user = { id: 'colaborador-mock-id', isAdmin: true };
        return next();
    }

    if (!token) {
        res.status(401).json({ error: 'Token de autenticação mal formatado' });
        return;
    }

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
