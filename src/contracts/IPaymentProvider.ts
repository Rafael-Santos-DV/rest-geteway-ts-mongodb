import ReceiverProcess from '../@types/receiveProcessTypes';

export default interface IPaymentProvider {
  process: (params: ReceiverProcess) => void;
}
