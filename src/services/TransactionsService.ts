import { v4 as uuidv4 } from 'uuid';
import ResponseProcessPayment from '../@types/response';
import ProcessType from '../@types/transactionTypes';
import Cart from '../models/Cart';
import Transactions from '../models/Transactions';
import PagarMeProvider from '../providers/PagarMeProvider';

class TransactionsService {
  public paymentProvider;

  constructor() {
    this.paymentProvider = new PagarMeProvider();
  }

  async process(params: ProcessType): Promise<ResponseProcessPayment> {
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

    const response = await this.paymentProvider.process({
      billing,
      creditCard,
      customer,
      installments,
      paymentType,
      total: cart.price,
      transactionCode: cart.code,
    });

    await transaction.updateOne({
      transationId: response.transationId,
      status: response.status,
      processorResponse: response.processorResponse,
    });

    return response;
  }

  async updateStatus(code: string, providerStatus: string) {
    const transaction = Transactions.findOne({ code });

    if (!transaction) throw `Transaction ${code} not found.`;

    const status = this.paymentProvider.transtaleStatus(providerStatus);
    if (!status) throw 'Status is empty.';

    await transaction.updateOne({
      status,
    });
  }
}

export default TransactionsService;
