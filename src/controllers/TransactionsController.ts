import { Request, Response } from 'express';
import * as Yup from 'yup';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { parsePhoneNumber } from 'libphonenumber-js';
import Cart from '../models/Cart';
import TransactionsService from '../services/TransactionsService';

class TransactionsController {
  async create(req: Request, res: Response) {
    try {
      const {
        cartCode,
        paymentType,
        installments,
        customerEmail,
        customerName,
        customerMobile,
        customerDocument,
        billingAddress,
        billingNumber,
        billingNeighborhood,
        billingCity,
        billingState,
        billingZipCode,
        creditCardNumber,
        creditCardExpiretion,
        creditCardHolderName,
        creditCardCvv,
      } = req.body;

      const schema = Yup.object({
        cartCode: Yup.string().required(),
        paymentType: Yup.mixed().oneOf(['credit_card', 'billet']).required(),
        installments: Yup.number().min(1)
          .when(
            'paymentType',
            (paymentType: string, schema: Yup.NumberSchema) => (paymentType === 'credit_card' ? schema.max(12) : schema.max(1)),
          ).required(),
        customerEmail: Yup.string().required().email(),
        customerName: Yup.string().min(3).required(),
        customerMobile: Yup.string().required()
          .test(
            'is-valid-mobile',
            'is not a mobile number',
            (value) => parsePhoneNumber(value || '', 'BR').isValid(),
          ),
        customerDocument: Yup.string().required()
          .test(
            'is-valid-cpf/cnpj',
            'is not a cpf/cnpj valid',
            (value) => (
              cpf.isValid(value || '') || cnpj.isValid(value || '')
            ),
          ),
        billingAddress: Yup.string().required(),
        billingNumber: Yup.string().required(),
        billingNeighborhood: Yup.string().required(),
        billingCity: Yup.string().required(),
        billingState: Yup.string().required(),
        billingZipCode: Yup.string().required(),
        creditCardNumber: Yup.string()
          .when('paymentType', (paymentType: string, schema: Yup.StringSchema) => (
            paymentType === 'credit_card' ? schema.required() : schema
          )),
        creditCardExpiretion: Yup.string()
          .when('paymentType', (paymentType: string, schema: Yup.StringSchema) => (
            paymentType === 'credit_card' ? schema.required() : schema
          )),
        creditCardHolderName: Yup.string()
          .when('paymentType', (paymentType: string, schema: Yup.StringSchema) => (
            paymentType === 'credit_card' ? schema.required() : schema
          )),
        creditCardCvv: Yup.string()
          .when('paymentType', (paymentType: string, schema: Yup.StringSchema) => (
            paymentType === 'credit_card' ? schema.required() : schema
          )),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Error on validate schema.' });
      }

      const cart = await Cart.findOne({ code: cartCode });

      if (!cart) return res.status(404).json();

      const resultTransaction = await TransactionsService.process({
        billing: {
          address: billingAddress,
          city: billingCity,
          neighborhood: billingNeighborhood,
          number: billingNumber,
          state: billingState,
          zipcode: billingZipCode,
        },
        cartCode,
        creditCard: {
          number: creditCardNumber,
          holdername: creditCardHolderName,
          expiration: creditCardExpiretion,
          cvv: creditCardCvv,
        },
        customer: {
          document: customerDocument,
          email: customerEmail,
          mobile: customerMobile,
          name: customerName,
        },
        installments,
        paymentType,
      });

      return res.status(200).json(resultTransaction);
    } catch (err) {
      return res.status(500).json({ error: 'internal server error.' });
    }
  }
}

export default new TransactionsController();
