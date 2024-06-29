import { IRequester } from '../common/types/common.type';

declare global {
  namespace Express {
    interface Request {
      user: IRequester;
    }
  }
}
