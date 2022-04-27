import ReceiverProcess from '../@types/receiveProcessTypes';
import ResponseProcessPayment from '../@types/response';
import typesTranslateStatus from '../@types/translateStatusTypes';

export default interface IPaymentProvider {
  process: (params: ReceiverProcess) => Promise<ResponseProcessPayment>;
  transtaleStatus: (status: typesTranslateStatus) => string;
}
