export default class ArticleContent {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  getContent() {
    return this.content;
  }

  changeContent(content: string) {
    this.content = content;
  }

  replaceImageUrls(paths: { fromPath: string; toPath: string }[]) {
    paths.forEach(({ fromPath, toPath }) => {
      this.content = this.content.replace(fromPath, toPath);
    });
  }
}
