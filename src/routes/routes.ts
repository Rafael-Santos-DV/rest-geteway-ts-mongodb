import { Router } from 'express';
import TransactionsController from '../controllers/TransactionsController';
import CartsController from '../controllers/CartsController';

const Routes = Router();

Routes.get('/carts', CartsController.index);
Routes.post('/carts', CartsController.create);
Routes.put('/carts/:id', CartsController.update);
Routes.delete('/carts/:id', CartsController.destroy);

Routes.post('/transactions', TransactionsController.create);

export default Routes;
