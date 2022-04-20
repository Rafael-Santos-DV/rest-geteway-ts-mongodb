export type CustomerValues = {
  name: string;
  email: string;
  mobile: string;
  document:string;
}

export type BillingValues = {
  address: string;
  city: string;
  number: string;
  state: string;
  zipcode: string;
  neighborhood: string;
}

export type creditValues = {
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

export default ProcessType;
