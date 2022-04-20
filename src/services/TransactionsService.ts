import { v4 as uuidv4 } from 'uuid';
import Cart from '../models/Cart';
import Transactions, { CartCode } from '../models/Transactions';

type CustomerValues = {
  name: string;
  email: string;
  mobile: string;
  document:string;
}

type BillingValues = {
  address: string;
  city: string;
  number: string;
  state: string;
  zipcode: string;
  neighborhood: string;
}

type creditValues = {
  number: string;
  expiration: string;
  holdername: string;
  cvv: string;
}

interface ProcessType {
  cartCode: string;
  paymentType: string;
  installments: number;
  customer: CustomerValues,
  billing: BillingValues;
  creditCard: creditValues;

}

class TransactionsService {
  async process(params: ProcessType): Promise<CartCode> {
    const cart = await Cart.findOne({ code: params.cartCode });

    if (!cart) {
      throw `Cart ${params.cartCode} was not found!`;
    }
    const {
      billing, cartCode, customer, installments, paymentType,
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

    return transaction;
  }
}

export default new TransactionsService();
