export class User {
  private readonly id: string;
  private readonly firstName: string;
  private readonly lastName: string;
  private readonly bio: string;
  private readonly imageUrl: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    bio: string,
    imageUrl: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio;
    this.imageUrl = imageUrl;
  }
}
