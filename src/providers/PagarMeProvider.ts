import { cpf } from 'cpf-cnpj-validator';
import ReceiverProcess from '../@types/receiveProcessTypes';
import IPaymentProvider from '../contracts/IPaymentProvider';

class PagarMeProvider implements IPaymentProvider {
  async process(params: ReceiverProcess) {
    const {
      installments, creditCard, total, paymentType, customer, billing, items, transactionCode,
    } = params;

    const billetParams = {
      payment_method: 'boleto',
      amount: total * 100,
      installments,

    };
    const creditCardParams = {
      payment_method: 'credit_card',
      amount: total * 100,
      installments,
      card_number: creditCard.number.replace(/[^?0-9]/g, ''),
      card_expiration_data: creditCard.expiration.replace(/[^?0-9]/g, ''),
      card_cvv: creditCard.cvv,
      capture: true,
    };

    let paymentParams;

    switch (paymentType) {
      case 'billet':
        paymentParams = billetParams;
        break;
      case 'credit_card':
        paymentParams = creditCardParams;
        break
      default:
        throw `Payment ${paymentType}} not found.`;
    }

    const customerParams = {
      customer: {
        external_id: customer.email,
        name: customer.name,
        email: customer.email,
        type: cpf.isValid(customer.document) ? 'individual' : 'corporation',
        country: 'br',
        phone_number: [customer.mobile],
        documents: [
          {
            type: cpf.isValid(customer.document) ? 'cpf' : 'cnpj',
            number: customer.document.replace(/[^?0-9]/g, ''),
          },
        ],
      },
    }

    const billingParams = billing.zipcode ? {
      billing: {
        name: 'Billing Address',
        address: {
          country: 'br',
          state: billing.state,
          city: billing.city,
          neighborhood: billing.neighborhood,
          street: billing.address,
          street_number: billing.number,
          zipcode: billing.zipcode,
        },
      },
    }
      : {};

    const itemsParams = items && items.length > 0
      ? {
        items: items.map((item) => (
          {
            id: item.id,
            title: item.title,
            unit_price: item.unit_price,
            quantity: item.quantity,
            tangible: item.tangible,
          }
        )),

      } : {
        items: [
          {
            id: '1',
            title: `t-${transactionCode}`,
            unit_price: total * 100,
            quantity: 1,
            tangible: false,
          },
        ],
      }

    const metadataParams = {
      metadata: {
        transaction_code: transactionCode,
      },
    }

    const transactionParams = {
      async: false,
      // post_back_url: "",
      ...paymentParams,
      ...customerParams,
      ...billingParams,
      ...itemsParams,
      ...itemsParams,
      ...metadataParams,
    }

    console.debug(transactionParams);
  }
}

export default PagarMeProvider;
