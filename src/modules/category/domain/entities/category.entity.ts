interface Props extends Partial<Category> {}

export default class Category {
  constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
    this.image = props.image;
    this.desc = props.desc;
    this.sort = props.sort;
    this.articleCount = props.articleCount;
  }

  id: number;
  name: string;
  image: string;
  desc: string;
  sort: number;
  articleCount: number;

  addArticleCount() {
    this.articleCount += 1;
  }

  changeImage(image: string) {
    this.image = image;
  }

  changeSort(sort: number) {
    this.sort = sort;
  }

  static create(props: Props): Category {
    return new Category(props);
  }
}
