import { Router } from 'express';
import TransactionsController from '../controllers/TransactionsController';
import CartsController from '../controllers/CartsController';
import PostbackController from '../controllers/PostbackController';

const Routes = Router();

Routes.get('/carts', CartsController.index);
Routes.post('/carts', CartsController.create);
Routes.put('/carts/:id', CartsController.update);
Routes.delete('/carts/:id', CartsController.destroy);

Routes.post('/transactions', TransactionsController.create);

Routes.post('/postbacks/pagarme', PostbackController.pagarme);

export default Routes;
