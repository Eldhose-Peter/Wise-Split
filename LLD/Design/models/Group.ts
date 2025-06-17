export class Group {
  private readonly name: string;
  private readonly description: string;
  private readonly imageUrl: string;
  private readonly users: Set<string>;

  constructor(
    name: string,
    description: string,
    imageUrl: string,
    users: Set<string>
  ) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.users = users;
  }

  public getUsers(): Set<string> {
    return this.users;
  }
}
