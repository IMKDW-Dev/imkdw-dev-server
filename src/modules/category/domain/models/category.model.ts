export default class Category {
  private constructor(id: number, name: string, image: string, desc: string, sort: number, articleCount: number) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.desc = desc;
    this.sort = sort;
    this.articleCount = articleCount;
  }

  private id: number;
  private name: string;
  private image: string;
  private desc: string;
  private sort: number;
  private articleCount: number;

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getImage() {
    return this.image;
  }

  getDesc() {
    return this.desc;
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

  isHaveArticles() {
    return this.articleCount > 0;
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
