import mongoose from 'mongoose';
import CartCode from '../@types/cartCodeTypes';

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
      enum: ['billet', 'credit_card', 'pix'],
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
