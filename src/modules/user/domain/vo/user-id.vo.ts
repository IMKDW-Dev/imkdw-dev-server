import { InvalidUserIdException } from '../../../../common/exceptions/400';
import { generateUUID } from '../../../../common/utils/uuid';

/**
 * 유저의 아이디 형식은 UUID를 사용한다.
 */
export default class UserId {
  private static readonly LENGTH = 36;

  private id: string;

  constructor(id?: string) {
    this.id = id || this.generateId();
    this.validate();
  }

  private validate() {
    if (this.id.length !== UserId.LENGTH) {
      throw new InvalidUserIdException(`아이디는 ${UserId.LENGTH}자여야 합니다.`);
    }
  }

  toString() {
    return this.id;
  }

  private generateId() {
    return generateUUID();
  }
}
