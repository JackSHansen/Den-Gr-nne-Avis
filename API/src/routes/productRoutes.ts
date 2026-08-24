import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authController } from '../controllers/authController.js';

const routes = Router();
routes.get('/', productController.getRecords);
routes.get('/:slug', productController.getRecord);
routes.get('/category/:slug', productController.getRecordsFromCategory);
routes.post('/', authController.authorize, productController.createRecord);
routes.put('/:id', authController.authorize, productController.updateRecord);
routes.delete('/:id', authController.authorize, productController.deleteRecord);

export const productRoutes = routes;
