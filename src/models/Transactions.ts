import mongoose from 'mongoose';

interface CartCode {
  carCode: string;
  code: string;
  status: 'started' | 'processing' | 'pending' | 'approved' | 'refused' | 'refunded' | 'chargeback' | 'error';
  paymentType: 'billet' | 'credit_cart';
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

const Schema = new mongoose.Schema<CartCode>(
  {
    carCode: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        'started',
        'processing',
        'pending',
        'approved',
        'refused',
        'refunded',
        'chargeback',
        'error',
      ],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['billet', 'credit_card'],
      required: true,
    },
    installments: {
      type: Number,
    },
    total: {
      type: Number,
    },
    transactionId: {
      type: String,
    },
    processorResponse: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    customerDocument: {
      type: String,
    },
    customerMobile: {
      type: String,
    },
    customerName: {
      type: String,
    },
    billingAddress: {
      type: String,
    },
    billingCity: {
      type: String,
    },
    billingNeighborhood: {
      type: String,
    },
    billingNumber: {
      type: String,
    },
    billingState: {
      type: String,
    },
    billingZipCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Transaction', Schema);
