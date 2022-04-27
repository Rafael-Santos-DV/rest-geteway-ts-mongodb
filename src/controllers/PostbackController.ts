import { Request, Response } from 'express';
import Transactions from '../models/Transactions';
import TransactionsService from '../services/TransactionsService';

class PostbackController {
  async pagarme(req: Request, res: Response) {
    const { id, object, current_status } = req.body;
    // pagarme.postback.verifySignature()
    try {
      if (object === 'transaction') {
        const transaction = await Transactions.findOne({ transactionId: id });

        if (!transaction) {
          return res.status(404).json();
        }

        const service = new TransactionsService();
        await service.updateStatus(transaction.code, current_status);

        return res.status(200).json();
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export default new PostbackController();
