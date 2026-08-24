import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();
router.get('/', userController.getRecords);
router.get('/:id', userController.getRecord);
router.post('/', userController.createRecord);
router.put('/:id', userController.updateRecord);
router.delete('/:id', userController.deleteRecord);

export const userRoutes = router;
