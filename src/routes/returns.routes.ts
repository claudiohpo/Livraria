import { Router } from 'express';
import { CreateReturnController } from '../controller/checkout/CreateReturnController';
import { AuthorizeReturnController } from '../controller/admin/AuthorizeReturnController';
import { isAdmin } from '../Middleware/isAdmin';

const router = Router();
const createReturnController = new CreateReturnController();
const authorizeReturnController = new AuthorizeReturnController();

router.post('/', createReturnController.handle.bind(createReturnController));
router.post('/:id/authorize', isAdmin, authorizeReturnController.handle.bind(authorizeReturnController));

export default router;
