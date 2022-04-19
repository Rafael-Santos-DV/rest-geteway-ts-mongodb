import mongoose from 'mongoose';

interface CartCode {
  code: string;
  price: number;
}

const Schema = new mongoose.Schema<CartCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Cart', Schema);
