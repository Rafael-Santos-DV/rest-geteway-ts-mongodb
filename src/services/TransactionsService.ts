import { v4 as uuidv4 } from 'uuid';
import CartCode from '../@types/cartCodeTypes';
import ProcessType from '../@types/transactionTypes';
import Cart from '../models/Cart';
import Transactions from '../models/Transactions';
import PagarMeProvider from '../providers/PagarMeProvider';

class TransactionsService {
  private paymentProvider;

  constructor() {
    this.paymentProvider = new PagarMeProvider();
  }

  async process(params: ProcessType): Promise<CartCode> {
    const cart = await Cart.findOne({ code: params.cartCode });

    if (!cart) {
      throw `Cart ${params.cartCode} was not found!`;
    }
    const {
      billing, cartCode, customer, installments, paymentType, creditCard,
    } = params;

    const transaction = await Transactions.create({
      customerName: customer.name,
      billingAddress: billing.address,
      billingCity: billing.city,
      billingNeighborhood: billing.neighborhood,
      billingNumber: billing.number,
      billingState: billing.state,
      billingZipCode: billing.zipcode,
      carCode: cartCode,
      code: await uuidv4(),
      customerDocument: customer.document,
      customerEmail: customer.email,
      customerMobile: customer.mobile,
      installments,
      paymentType,
      status: 'started',
      total: cart.price,
    });

    this.paymentProvider.process({
      billing,
      creditCard,
      customer,
      installments,
      paymentType,
      total: cart.price,
      transactionCode: cart.code,
    })
    return transaction;
  }
}

export default new TransactionsService();
