import { Request, Response } from 'express';
import Cart from '../models/Cart';
import '../database/index';

class CartsController {
  async index(req: Request, res: Response) {
    try {
      const result = await Cart.find();
      console.log(result);
      return res.status(201).json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { price, code } = req.body;
      const result = await Cart.create({ price, code });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { code, price } = req.body;
      const cart = await Cart.findById(id);
      if (!cart) return res.status(404).json();

      await Cart.updateOne({ code, price });

      return res.status(200).json();
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cart = await Cart.findById(id);

      if (!cart) return res.status(404).json();

      await Cart.deleteOne();

      return res.status(200).json();
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export default new CartsController();
