import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { commentController } from '../controllers/commentController.js';

const routes = Router();
routes.get('/:productId', commentController.getRecords);
routes.post('/', authController.authorize, commentController.createRecord);
routes.delete('/:id', authController.authorize, commentController.deleteRecord);

export const commentRoutes = routes;
