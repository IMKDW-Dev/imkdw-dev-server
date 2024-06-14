import { generateCUID } from '../../../../common/utils/cuid';

export default class ArticleId {
  constructor(id: string) {
    this.id = id;
  }

  id: string;

  addHash() {
    this.id = `${this.id}-${generateCUID().slice(0, 8)}`;
    return this;
  }

  toString() {
    return this.id;
  }
}
