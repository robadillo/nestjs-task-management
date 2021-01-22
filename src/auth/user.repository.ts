import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  
  public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;

    try {
      await user.save();
    } catch (error) {
      console.log(error.code);
      if (error.code === '23505') { // error code to indicate that the value is duplicated. It would be a good practice to have all this codes in an enum in a shared folder
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}