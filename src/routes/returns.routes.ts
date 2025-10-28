import { Router } from 'express';
import { isAdmin } from '../Middleware/isAdmin';
import { devAuth } from '../Middleware/devAuth';

import { CreateReturnController } from '../controller/checkout/CreateReturnController';
import { AuthorizeReturnController } from '../controller/admin/AuthorizeReturnController';

const router = Router();

const createReturnController = new CreateReturnController();
const authorizeReturnController = new AuthorizeReturnController();

router.post('/', createReturnController.handle.bind(createReturnController));
router.post('/:id/authorize', devAuth,isAdmin, authorizeReturnController.handle.bind(authorizeReturnController));

export default router;
