import { CategoryHaveArticlesException } from '../../../../common/exceptions/403';
import CategoryDesc from '../vo/category-desc.vo';
import CategoryName from '../vo/category-name.vo';

export default class Category {
  private constructor(id: number, name: string, image: string, desc: string, sort: number, articleCount: number) {
    this.id = id;
    this.name = new CategoryName(name);
    this.image = image;
    this.desc = new CategoryDesc(desc);
    this.sort = sort;
    this.articleCount = articleCount;
  }

  private id: number;
  private name: CategoryName;
  private image: string;
  private desc: CategoryDesc;
  private sort: number;
  private articleCount: number;

  getId() {
    return this.id;
  }

  getName() {
    return this.name.toString();
  }

  getImage() {
    return this.image;
  }

  getDesc() {
    return this.desc.toString();
  }

  getSort() {
    return this.sort;
  }

  getArticleCount() {
    return this.articleCount;
  }

  addArticleCount() {
    this.articleCount += 1;
  }

  changeImage(image: string) {
    this.image = image;
  }

  changeSort(sort: number) {
    this.sort = sort;
  }

  changeName(name: string) {
    this.name = new CategoryName(name);
  }

  changeDesc(desc: string) {
    this.desc = new CategoryDesc(desc);
  }

  checkAvailableDelete() {
    if (this.articleCount > 0) {
      throw new CategoryHaveArticlesException(`카테고리에 게시글이 존재합니다.`);
    }
  }

  static builder = class {
    id: number;
    name: string;
    image: string;
    desc: string;
    sort: number;
    articleCount: number;

    setId(id: number) {
      this.id = id;
      return this;
    }

    setName(name: string) {
      this.name = name;
      return this;
    }

    setImage(image: string) {
      this.image = image;
      return this;
    }

    setDesc(desc: string) {
      this.desc = desc;
      return this;
    }

    setSort(sort: number) {
      this.sort = sort;
      return this;
    }

    setArticleCount(articleCount: number) {
      this.articleCount = articleCount;
      return this;
    }

    build() {
      return new Category(this.id, this.name, this.image, this.desc, this.sort, this.articleCount);
    }
  };
}
