import { InvalidNicknameException } from '../../../../common/exceptions/400';
import { generateUUID } from '../../../../common/utils/uuid';

/**
 * 닉네임 유효성 규칙
 * - 3자 이상 8자 이하
 * - 특수문자, 공백을 포함할 수 없다
 */
export default class Nickname {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 8;
  private static readonly VALID_PATTERN = /^[a-zA-Z0-9가-힣]+$/;

  private readonly value: string;

  constructor(nickname?: string) {
    this.value = nickname || this.generateDefaultNickname();
    this.validate();
  }

  private validate(): void {
    if (this.value.length < Nickname.MIN_LENGTH || this.value.length > Nickname.MAX_LENGTH) {
      throw new InvalidNicknameException(
        `닉네임은 ${Nickname.MIN_LENGTH}자 이상 ${Nickname.MAX_LENGTH}자 이하여야 합니다.`,
      );
    }
    if (!Nickname.VALID_PATTERN.test(this.value)) {
      throw new InvalidNicknameException('닉네임에는 한글, 영어, 숫자만 사용할 수 있습니다.');
    }
  }

  toString(): string {
    return this.value;
  }

  private generateDefaultNickname(): string {
    return generateUUID().slice(0, Nickname.MAX_LENGTH);
  }
}
