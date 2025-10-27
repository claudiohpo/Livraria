import { Request, Response, NextFunction } from 'express';


export function isAdmin(req: Request, res: Response, next: NextFunction): void {
    try {
        const user = (req as any).user;
        if (!user) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }

        const isAdminFlag = user.isAdmin || (user.role && user.role.toLowerCase() === 'admin');
        if (!isAdminFlag) {
            res.status(403).json({ error: 'Acesso restrito a administradores' });
            return;
        }

        next();
    } catch (err) {
        res.status(500).json({ error: 'Erro no middleware isAdmin' });
    }
}

