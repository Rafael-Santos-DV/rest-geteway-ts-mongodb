import ReceiverProcess from '../@types/receiveProcessTypes';
import typesTranslateStatus from '../@types/translateStatusTypes';

export default interface IPaymentProvider {
  process: (params: ReceiverProcess) => void;
  transtaleStatus: (status: typesTranslateStatus) => string;
}
