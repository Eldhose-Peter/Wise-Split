import { User } from "./users.model";
import { UserRepository } from "./users.repository";

export class UserService {
  private userRepository: UserRepository = new UserRepository();

  public async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }

  public async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findUserById(id);
  }
}
