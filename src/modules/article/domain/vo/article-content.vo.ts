export default class ArticleContent {
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString() {
    return this.value;
  }

  changeContent(content: string) {
    this.value = content;
  }

  updateImageUrls(paths: { fromPath: string; toPath: string }[]) {
    paths.forEach(({ fromPath, toPath }) => {
      this.value = this.value.replace(fromPath, toPath);
    });
  }
}
