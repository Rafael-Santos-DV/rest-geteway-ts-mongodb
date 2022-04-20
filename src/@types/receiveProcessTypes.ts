import { BillingValues, creditValues, CustomerValues } from './transactionTypes';

type ReturnItemsType = {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  tangible: boolean;

}

type ReceiverProcess = {
  transactionCode: string,
  total: number,
  paymentType: string;
  installments: number,
  creditCard: creditValues,
  customer: CustomerValues,
  billing: BillingValues,
  items?: ReturnItemsType[],
}

export default ReceiverProcess;
