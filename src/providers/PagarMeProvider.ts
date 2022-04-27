import { cpf } from 'cpf-cnpj-validator';
import pagarme from 'pagarme';
import { Transaction } from 'pagarme-js-types/src/client/transactions/responses';

import ReceiverProcess from '../@types/receiveProcessTypes';
import ResponseProcessPayment from '../@types/response';
import typesTranslateStatus from '../@types/translateStatusTypes';
import IPaymentProvider from '../contracts/IPaymentProvider';

type paymentMethodTypes = {
  amount: number,
  installments: string,
  card_holder_name?: string;
  card_number?: string;
  card_expiration_date?: string;
  card_cvv?: string;
  capture?: boolean;
}

class PagarMeProvider implements IPaymentProvider {
  async process(params: ReceiverProcess): Promise<ResponseProcessPayment> {
    const {
      installments, creditCard, total, paymentType, customer, billing, items, transactionCode,
    } = params;
    this.transtaleStatus('authorized');
    const creditCardParams: paymentMethodTypes = {
      // payment_method: 'credit_card',
      amount: total * 100,
      installments: String(installments),
      card_holder_name: creditCard.holdername,
      card_number: creditCard.number.replace(/[^?0-9]/g, ''),
      card_expiration_date: creditCard.expiration.replace(/[^?0-9]/g, ''),
      card_cvv: creditCard.cvv,
      capture: true,
    };

    const customerParams = {
      customer: {
        external_id: customer.email,
        id: transactionCode,
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
          zipcode: billing.zipcode.replace(/[^?0-9]/g, ''),
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

    const client = await pagarme.client.connect({
      api_key: process.env.PAGAR_ME_API_KEY,
    })

    let response: Transaction;

    switch (paymentType) {
      case 'billet':
        response = await client.transactions.create({
          payment_method: 'boleto',
          amount: total * 100,
          async: false,
          ...billingParams,
          ...customerParams,
          installments: String(installments),
          metadata: JSON.stringify(metadataParams.metadata),
          ...itemsParams,

        });
        break;

      case 'credit_card':
        response = await client.transactions.create({
          payment_method: 'credit_card',
          ...creditCardParams,
          async: false,
          ...billingParams,
          ...customerParams,
          metadata: JSON.stringify(metadataParams.metadata),
          capture: true,
        });
        break;

      default:
        throw `Payment ${paymentType} is not found!`;
    }

    return {
      billet: {
        barCode: response.boleto_barcode,
        url: response.boleto_url,
      },
      card: {
        id: String(response.acquirer_id),
      },
      processorResponse: JSON.stringify(response),
      status: this.transtaleStatus(response.status),
      transationId: String(response.id),
    };
  }

  transtaleStatus(status: typesTranslateStatus): string {
    const statusMap = new Map();
    statusMap.set('processing', 'processing');
    statusMap.set('waiting_payment', 'pending');
    statusMap.set('authorized', 'pending');
    statusMap.set('paid', 'approved');
    statusMap.set('refused', 'refused');
    statusMap.set('pending_refund', 'refunded');
    statusMap.set('refunded', 'refunded');
    statusMap.set('chargeback', 'chargeback');

    return statusMap.get(status);
  }
}

export default PagarMeProvider;
