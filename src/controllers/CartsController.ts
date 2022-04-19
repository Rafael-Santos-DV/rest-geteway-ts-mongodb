import { Request, Response } from 'express';
import Cart from '../models/Cart';
import '../database/index';

class CartsController {
  async index(req: Request, res: Response) {
    try {
      const result = Cart.find();
      console.log(result);
      return res.status(201).json();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ erro: 'erro' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { price, code } = req.body;
      const result = await Cart.create({ price, code });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: '' });
    }
  }
}

export default new CartsController();
