interface Props extends Partial<Tag> {}

export default class Tag {
  constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
  }

  id: number;
  name: string;

  static create(props: Props): Tag {
    return new Tag(props);
  }
}
