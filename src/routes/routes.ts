import { Router } from 'express';
import CartsController from '../controllers/CartsController';

const Routes = Router();

Routes.get('/', CartsController.index);
Routes.post('/createCart', CartsController.create);

export default Routes;
