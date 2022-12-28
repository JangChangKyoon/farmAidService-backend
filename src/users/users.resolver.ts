import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Role } from 'src/auth/role.decorator';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Role(['Any'])
  @Query((returns) => User)
  me(@AuthUser() authUser: User) {
    // console.log('hi');
    console.log(authUser);
    return authUser;
  }
  /*
  User {
    id: 7,
    createAt: 2022-12-22T19:21:35.598Z,
    updateAt: 2022-12-22T19:21:35.598Z,
    email: 'jachky@korea.kr',
    password: '$2b$10$Esbny2pUCA0GAO815pML/eLOzX2XBev2sSiFIGbdYOVTqWzfya34W',
    role: 'Host'
  }
  */

  @Role(['Any'])
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Role(['Any'])
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }
}
