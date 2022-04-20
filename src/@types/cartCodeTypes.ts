export default interface CartCode {
  carCode: string;
  code: string;
  status: 'started' | 'processing' | 'pending' | 'approved' | 'refused' | 'refunded' | 'chargeback' | 'error';
  paymentType: 'billet' | 'credit_card';
  installments: number;
  total: number;
  transactionId: string;
  processorResponse: string;
  customerEmail: string;
  customerName: string;
  customerMobile: string;
  customerDocument: string;
  billingAddress: string;
  billingNumber: string;
  billingNeighborhood: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
}
