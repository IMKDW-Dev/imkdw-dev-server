export default class ArticleContent {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  getContent() {
    return this.content;
  }

  replaceImageUrls(paths: { fromPath: string; toPath: string }[]) {
    paths.forEach(({ fromPath, toPath }) => {
      console.log('-'.repeat(50));
      console.log(this.content);
      console.log(fromPath, toPath);
      this.content = this.content.replace(fromPath, toPath);
      console.log(this.content);
      console.log('-'.repeat(50));
    });

    return this;
  }

  changeContent(content: string) {
    this.content = content;
  }
}
