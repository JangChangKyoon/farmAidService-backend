import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean) // from @nestjs/graphql not common
  hi() {
    return true;
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') { email, password, role }: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    console.log(email);
    try {
      const { ok, error } = await this.usersService.createAccount({
        email,
        password,
        role,
      });

      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        error: 'ddddd',
        ok: false,
      };
    }
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
